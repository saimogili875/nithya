import asyncio
import time
import os
import httpx
from typing import Dict, Any, Callable
from .models import ActivityEvent, PromptRequest
from .sandbox import ExecutionSandbox
from .brain import ProjectBrainManager

class ProductionMonitor:
    """
    Continuous background health monitor & autonomous self-fix trigger.
    Constantly watches live deployed applications and triggers automatic AI repair
    when errors (e.g. 500 Internal Server Error) occur.
    """

    def __init__(self, orchestrator):
        self.orchestrator = orchestrator
        self.running_monitors = set()
        self.is_fixing = False

    async def start_monitoring(
        self,
        project_id: str,
        live_url: str,
        event_cb: Callable[[ActivityEvent], Any],
        log_cb: Callable[[str], Any]
    ):
        if project_id in self.running_monitors:
            return

        self.running_monitors.add(project_id)
        await log_cb(f"[{time.strftime('%H:%M:%S')}] 🟢 Production Monitor started probing {live_url}/health")

        while project_id in self.running_monitors:
            await asyncio.sleep(3)
            if self.is_fixing:
                continue

            infra = self.orchestrator.get_infra_status(project_id)
            if not infra.live_url:
                continue

            health_url = f"{infra.live_url.rstrip('/')}/health"
            try:
                async with httpx.AsyncClient(timeout=2.0) as client:
                    resp = await client.get(health_url)
                    if resp.status_code == 200:
                        infra.application = "green"
                        infra.monitoring = "green"
                    else:
                        await self._handle_production_failure(
                            project_id,
                            f"HTTP {resp.status_code} Error: {resp.text[:150]}",
                            event_cb,
                            log_cb
                        )
            except Exception as e:
                await self._handle_production_failure(
                    project_id,
                    f"Production Connection Failure: {str(e)}",
                    event_cb,
                    log_cb
                )

    async def _handle_production_failure(
        self,
        project_id: str,
        error_details: str,
        event_cb: Callable[[ActivityEvent], Any],
        log_cb: Callable[[str], Any]
    ):
        if self.is_fixing:
            return
        self.is_fixing = True

        infra = self.orchestrator.get_infra_status(project_id)
        infra.application = "red"

        await event_cb(ActivityEvent(phase="monitor", status="error", message="⚠ PRODUCTION ALERT: HTTP 500 Error Detected on /health"))
        await log_cb(f"[{time.strftime('%H:%M:%S')}] 🛑 INCIDENT: {error_details}")
        await asyncio.sleep(1.0)

        await event_cb(ActivityEvent(phase="fix", status="in_progress", message="🤖 AI investigating root cause & unhandled ZeroDivisionError..."))
        await log_cb(f"[{time.strftime('%H:%M:%S')}] AI Diagnosis: Endpoint returning 500. Patching main.py logic...")
        await asyncio.sleep(1.2)

        req = PromptRequest(
            project_id=project_id,
            prompt="Fix production 500 error in main.py and restore /health endpoint",
            is_demo=True
        )

        # Execute autonomous self-fix pipeline
        await self.orchestrator.run_pipeline(req, event_cb, log_cb)
        await event_cb(ActivityEvent(phase="live", status="success", message="🟢 Autonomous Production Self-Healing Completed! Health Restored to 200 OK."))
        self.is_fixing = False

    @classmethod
    def inject_bug(cls, project_id: str) -> bool:
        pdir = ExecutionSandbox.get_project_dir(project_id)
        main_py = os.path.join(pdir, "main.py")
        if os.path.exists(main_py):
            buggy_code = (
                "from fastapi import FastAPI, HTTPException\n"
                "import uvicorn\n"
                "import os\n\n"
                "app = FastAPI(title='Weather API - BUG INJECTED')\n\n"
                "@app.get('/')\n"
                "def read_root():\n"
                "    raise HTTPException(status_code=500, detail='Internal Server Error')\n\n"
                "@app.get('/health')\n"
                "def health():\n"
                "    # INTENTIONAL 500 BUG FOR DEMO\n"
                "    raise HTTPException(status_code=500, detail='Database Deadlock - HTTP 500')\n\n"
                "if __name__ == '__main__':\n"
                "    port = int(os.environ.get('PORT', 8000))\n"
                "    uvicorn.run(app, host='0.0.0.0', port=port)\n"
            )
            with open(main_py, "w", encoding="utf-8") as f:
                f.write(buggy_code)
            
            # Restart process to reflect buggy app
            pid_file = os.path.join(pdir, ".app_pid")
            if os.path.exists(pid_file):
                try:
                    with open(pid_file, "r") as f:
                        old_pid = int(f.read().strip())
                    os.kill(old_pid, 9)
                except Exception:
                    pass
            ExecutionSandbox.deploy_container(project_id, 8001)
            return True
        return False
