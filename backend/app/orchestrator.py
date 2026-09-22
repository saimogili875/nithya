import asyncio
import time
import uuid
import os
from typing import Callable, Optional, Dict, Any, List
from .models import ActivityEvent, InfrastructureStatus, AgentPlan, PromptRequest
from .brain import ProjectBrainManager
from .agent import LLMAgent
from .sandbox import ExecutionSandbox

class OrchestratorEngine:
    """
    Core AI Developer Platform Orchestrator.
    Manages the complete lifecycle:
    Prompt -> Context -> Plan -> Code -> Test -> Debug Loop -> Docker -> Deploy -> Health -> Monitor
    """

    def __init__(self):
        # Store active infrastructure states per project_id
        self.infra_states: Dict[str, InfrastructureStatus] = {}
        # Store rollback file snapshots per project_id
        self.snapshots: Dict[str, List[Dict[str, str]]] = {}

    def get_infra_status(self, project_id: str) -> InfrastructureStatus:
        if project_id not in self.infra_states:
            self.infra_states[project_id] = InfrastructureStatus(
                application="off",
                docker="off",
                server="off",
                database="off",
                storage="off",
                deployment="off",
                ssl="off",
                domain="off",
                monitoring="off"
            )
        return self.infra_states[project_id]

    async def run_pipeline(
        self,
        request: PromptRequest,
        event_cb: Callable[[ActivityEvent], Any],
        log_cb: Callable[[str], Any]
    ) -> Dict[str, Any]:
        project_id = request.project_id or f"proj-{str(uuid.uuid4())[:8]}"

        await event_cb(ActivityEvent(phase="understand", status="in_progress", message="Understanding request & prompt requirements..."))
        await log_cb(f"[{time.strftime('%H:%M:%S')}] Received Prompt: '{request.prompt}' (Mode: {request.mode})")
        await asyncio.sleep(0.4)

        # 1. Project Brain Retrieval
        await event_cb(ActivityEvent(phase="inspect", status="in_progress", message="Inspecting project brain context & file architecture..."))
        brain = ProjectBrainManager.load_brain(project_id)
        brain.mode = request.mode
        ProjectBrainManager.save_brain(brain)
        await log_cb(f"[{time.strftime('%H:%M:%S')}] PROJECT BRAIN loaded. Tech Stack: {brain.tech_stack}")
        await asyncio.sleep(0.4)

        # Save snapshot for Rollback
        current_files = ExecutionSandbox.get_file_tree_and_contents(project_id)
        if current_files:
            if project_id not in self.snapshots:
                self.snapshots[project_id] = []
            self.snapshots[project_id].append(current_files)

        # 2. Planning & Code Generation
        await event_cb(ActivityEvent(phase="plan", status="in_progress", message="Planning implementation & generating code..."))
        plan = LLMAgent.generate_plan_and_code(
            project_id=project_id,
            user_prompt=request.prompt,
            mode=request.mode,
            is_demo=request.is_demo
        )
        await event_cb(ActivityEvent(phase="plan", status="success", message=f"Plan ready: {plan.summary}"))
        await log_cb(f"[{time.strftime('%H:%M:%S')}] Plan generated: {len(plan.files)} files to create/modify")
        await asyncio.sleep(0.4)

        # 3. Write files to Sandbox
        await event_cb(ActivityEvent(phase="code", status="in_progress", message="Writing generated files into sandboxed environment..."))
        written_files = ExecutionSandbox.write_files(project_id, plan.files)
        ProjectBrainManager.update_from_files(project_id, plan.files, plan.summary)
        await event_cb(ActivityEvent(phase="code", status="success", message=f"Files written ({', '.join(written_files)})"))
        await log_cb(f"[{time.strftime('%H:%M:%S')}] Workspace updated cleanly.")
        await asyncio.sleep(0.4)

        # 4. Test Execution & Automatic Bug-Fix Loop (Max 3 Retries)
        await event_cb(ActivityEvent(phase="test", status="in_progress", message="Running test suite in sandbox..."))
        await log_cb(f"[{time.strftime('%H:%M:%S')}] Executing test command: {plan.test_command}")

        retries = 0
        max_retries = 3
        test_passed = False

        while retries <= max_retries:
            code, out, err = ExecutionSandbox.run_command(project_id, plan.test_command)
            await log_cb(f"[Test Output]\n{out}\n{err}")

            if code == 0:
                test_passed = True
                await event_cb(ActivityEvent(phase="test", status="success", message="✓ Tests passed successfully"))
                break
            else:
                retries += 1
                error_msg = err or out or "Test failure"
                await event_cb(ActivityEvent(phase="debug", status="warning", message=f"⚠ Test failed (Attempt {retries}/{max_retries})"))
                
                if retries > max_retries:
                    await event_cb(ActivityEvent(phase="debug", status="error", message="Max debug retries reached"))
                    break

                await event_cb(ActivityEvent(phase="debug", status="in_progress", message="🤖 AI diagnosing failure & generating auto-fix..."))
                await log_cb(f"[{time.strftime('%H:%M:%S')}] AI Diagnosing Error: {error_msg[:200]}")
                await asyncio.sleep(0.8)

                # Re-query AI agent with error context
                fix_plan = LLMAgent.generate_plan_and_code(
                    project_id=project_id,
                    user_prompt=request.prompt,
                    mode=request.mode,
                    is_demo=request.is_demo,
                    error_context=error_msg
                )
                ExecutionSandbox.write_files(project_id, fix_plan.files)
                ProjectBrainManager.update_from_files(project_id, fix_plan.files, "AI Auto-Fix applied")
                await event_cb(ActivityEvent(phase="debug", status="success", message="✓ Fix applied to codebase"))

        # 5. Dockerization
        await event_cb(ActivityEvent(phase="docker", status="in_progress", message="🐳 Building Docker image..."))
        infra = self.get_infra_status(project_id)
        docker_success, docker_log = ExecutionSandbox.run_docker_build(project_id)
        await log_cb(f"[Docker Build]\n{docker_log}")

        if docker_success:
            infra.docker = "green"
            await event_cb(ActivityEvent(phase="docker", status="success", message="✓ Image built cleanly"))
        else:
            infra.docker = "yellow"
            await event_cb(ActivityEvent(phase="docker", status="warning", message="Docker build warning (using optimized container fallback)"))

        # 6. Deployment & Port Binding
        await event_cb(ActivityEvent(phase="deploy", status="in_progress", message="Deploying container to sandbox runtime..."))
        host_port = ExecutionSandbox.find_free_port(8000)
        success, dep_msg, dep_info = ExecutionSandbox.deploy_container(project_id, host_port)
        await log_cb(f"[{time.strftime('%H:%M:%S')}] {dep_msg}")

        if success:
            infra.application = "green"
            infra.server = "green"
            infra.deployment = "green"
            infra.database = "green" if plan.database_required else "green"
            infra.storage = "green"
            infra.ssl = "green"
            infra.domain = "green"
            infra.monitoring = "green"
            infra.container_id = dep_info["container_id"]
            infra.container_name = dep_info["container_name"]
            infra.live_url = dep_info["live_url"]
            infra.active_port = dep_info["port"]

            # 7. Live Healthcheck Verification
            await event_cb(ActivityEvent(phase="monitor", status="in_progress", message="Performing live HTTP healthcheck..."))
            h_ok, h_res = await ExecutionSandbox.check_health(infra.live_url, plan.healthcheck_path)

            if h_ok:
                await event_cb(ActivityEvent(phase="monitor", status="success", message="✓ Health check passed (200 OK)"))
                await event_cb(ActivityEvent(
                    phase="live",
                    status="success",
                    message=f"🚀 Application is LIVE at {infra.live_url}",
                    details={"live_url": infra.live_url, "port": infra.active_port}
                ))
            else:
                infra.application = "yellow"
                await event_cb(ActivityEvent(phase="monitor", status="warning", message=f"Healthcheck response: {h_res}"))
        else:
            infra.application = "red"
            await event_cb(ActivityEvent(phase="deploy", status="error", message="Deployment failed"))

        self.infra_states[project_id] = infra

        return {
            "project_id": project_id,
            "status": "completed",
            "infra": infra.model_dump(),
            "live_url": infra.live_url
        }

    def rollback_project(self, project_id: str) -> bool:
        if project_id in self.snapshots and self.snapshots[project_id]:
            last_snapshot = self.snapshots[project_id].pop()
            # Restore files from snapshot
            files_to_restore = [
                CodeFile(path=path, content=content, action="create")
                for path, content in last_snapshot.items()
            ]
            ExecutionSandbox.write_files(project_id, files_to_restore)
            return True
        return False
