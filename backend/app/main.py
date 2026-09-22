import os
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, List, Any

from .models import PromptRequest, ActivityEvent, InfrastructureStatus
from .brain import ProjectBrainManager
from .orchestrator import OrchestratorEngine
from .monitor import ProductionMonitor
from .sandbox import ExecutionSandbox

app = FastAPI(
    title="AI Developer Platform - Prompt to Production",
    description="Hackathon MVP backend orchestrating autonomous code generation, sandboxed Docker execution, self-healing bug fixes, and live monitoring.",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = OrchestratorEngine()
monitor = ProductionMonitor(orchestrator)

# Active WebSocket connections per project_id
active_websockets: Dict[str, List[WebSocket]] = {}

async def broadcast_event(project_id: str, event: ActivityEvent):
    if project_id in active_websockets:
        payload = {
            "type": "activity_event",
            "data": event.model_dump()
        }
        for ws in active_websockets[project_id]:
            try:
                await ws.send_json(payload)
            except Exception:
                pass

async def broadcast_log(project_id: str, log_line: str):
    if project_id in active_websockets:
        payload = {
            "type": "log_event",
            "data": log_line
        }
        for ws in active_websockets[project_id]:
            try:
                await ws.send_json(payload)
            except Exception:
                pass

async def broadcast_infra(project_id: str):
    if project_id in active_websockets:
        infra = orchestrator.get_infra_status(project_id)
        payload = {
            "type": "infra_event",
            "data": infra.model_dump()
        }
        for ws in active_websockets[project_id]:
            try:
                await ws.send_json(payload)
            except Exception:
                pass

@app.get("/health")
def backend_health():
    return {"status": "healthy", "service": "AI Orchestrator Backend", "version": "1.0.0"}

@app.websocket("/ws/project/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: str):
    await websocket.accept()
    if project_id not in active_websockets:
        active_websockets[project_id] = []
    active_websockets[project_id].append(websocket)

    # Send initial state upon connection
    infra = orchestrator.get_infra_status(project_id)
    await websocket.send_json({"type": "infra_event", "data": infra.model_dump()})
    
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_websockets[project_id].remove(websocket)

@app.post("/api/project/prompt")
async def handle_prompt(request: PromptRequest, background_tasks: BackgroundTasks):
    project_id = request.project_id or "hackathon-demo-1"
    request.project_id = project_id

    async def event_cb(event: ActivityEvent):
        await broadcast_event(project_id, event)
        await broadcast_infra(project_id)

    async def log_cb(log_line: str):
        await broadcast_log(project_id, log_line)

    async def pipeline_runner():
        await orchestrator.run_pipeline(request, event_cb, log_cb)
        infra = orchestrator.get_infra_status(project_id)
        if infra.live_url:
            asyncio.create_task(monitor.start_monitoring(project_id, infra.live_url, event_cb, log_cb))

    background_tasks.add_task(pipeline_runner)
    return {"status": "processing", "project_id": project_id, "message": "Orchestrator pipeline initiated"}

@app.get("/api/project/{project_id}/brain")
def get_project_brain(project_id: str):
    brain = ProjectBrainManager.load_brain(project_id)
    return brain.model_dump()

@app.get("/api/project/{project_id}/files")
def get_project_files(project_id: str):
    files = ExecutionSandbox.get_file_tree_and_contents(project_id)
    return {"files": files}

@app.get("/api/project/{project_id}/infra")
def get_infra(project_id: str):
    infra = orchestrator.get_infra_status(project_id)
    return infra.model_dump()

@app.post("/api/project/{project_id}/inject-bug")
async def inject_bug_endpoint(project_id: str, background_tasks: BackgroundTasks):
    """
    Triggers intentional 500 bug injection & autonomous AI self-healing recovery!
    """
    success = ProductionMonitor.inject_bug(project_id)
    if success:
        infra = orchestrator.get_infra_status(project_id)
        infra.application = "red"
        await broadcast_infra(project_id)

        async def event_cb(event: ActivityEvent):
            await broadcast_event(project_id, event)
            await broadcast_infra(project_id)

        async def log_cb(log_line: str):
            await broadcast_log(project_id, log_line)

        async def trigger_healing():
            await monitor._handle_production_failure(
                project_id,
                "HTTP 500 Internal Server Error (Database Deadlock)",
                event_cb,
                log_cb
            )

        background_tasks.add_task(trigger_healing)
        return {"status": "bug_injected", "message": "500 bug injected. Autonomous self-healing triggered!"}
    raise HTTPException(status_code=400, detail="Project main.py not found to inject bug")

@app.post("/api/project/{project_id}/rollback")
async def rollback_endpoint(project_id: str):
    success = orchestrator.rollback_project(project_id)
    if success:
        await broadcast_event(project_id, ActivityEvent(
            phase="code",
            status="success",
            message="↩ Workspace rolled back to previous snapshot"
        ))
        return {"status": "rolled_back"}
    return {"status": "no_snapshot"}

@app.get("/api/demo/run-quick-demo")
async def run_quick_demo(background_tasks: BackgroundTasks):
    project_id = "hackathon-demo-1"
    req = PromptRequest(
        project_id=project_id,
        prompt="Build me a simple weather API with a health endpoint",
        mode="new",
        is_demo=True
    )

    async def event_cb(event: ActivityEvent):
        await broadcast_event(project_id, event)
        await broadcast_infra(project_id)

    async def log_cb(log_line: str):
        await broadcast_log(project_id, log_line)

    async def demo_runner():
        await orchestrator.run_pipeline(req, event_cb, log_cb)
        infra = orchestrator.get_infra_status(project_id)
        if infra.live_url:
            asyncio.create_task(monitor.start_monitoring(project_id, infra.live_url, event_cb, log_cb))

    background_tasks.add_task(demo_runner)
    return {"status": "demo_started", "project_id": project_id}
