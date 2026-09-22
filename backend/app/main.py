import os
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional

from .models import PromptRequest, ActivityEvent, InfrastructureStatus, PresentationRequest, INDUSTRIES, PRESENTATION_TYPES
from .brain import ProjectBrainManager
from .orchestrator import OrchestratorEngine
from .monitor import ProductionMonitor
from .sandbox import ExecutionSandbox

from .engines.idea_engine import IdeaEngine
from .engines.tech_stack_engine import TechStackEngine
from .engines.design_engine import DesignEngine
from .engines.financial_engine import FinancialEngine
from .engines.competitor_engine import CompetitorEngine
from .engines.document_engine import DocumentEngine
from .engines.support_engine import SupportEngine

app = FastAPI(
    title="Nithya — AI Software & Business Platform",
    description="From Business Idea to Production Software: Autonomous prompt-to-production platform with 7 business & software engines.",
    version="2.0.0"
)

# Enable CORS for Vite frontend (supports local dev and environment config)
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = OrchestratorEngine()
monitor = ProductionMonitor(orchestrator)
doc_engine = DocumentEngine()

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
    return {
        "status": "healthy",
        "service": "Nithya AI Software & Business Platform Backend",
        "version": "2.0.0",
        "engines": ["IdeaEngine", "TechStackEngine", "DesignEngine", "FinancialEngine", "CompetitorEngine", "DocumentEngine", "SupportEngine"]
    }

@app.websocket("/ws/project/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: str):
    await websocket.accept()
    if project_id not in active_websockets:
        active_websockets[project_id] = []
    active_websockets[project_id].append(websocket)

    infra = orchestrator.get_infra_status(project_id)
    await websocket.send_json({"type": "infra_event", "data": infra.model_dump()})
    
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_websockets[project_id].remove(websocket)

# ----------------------------------------------------
# EXISTING CORE P0/P1/P2 ORCHESTRATION ROUTES
# ----------------------------------------------------

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
        prompt="Build an AI-powered tourism platform for Hyderabad with a health endpoint",
        mode="new",
        industry="Tourism & Travel",
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

# ----------------------------------------------------
# NEW 7-PHASE ENGINE API ROUTES
# ----------------------------------------------------

class IdeaAnalysisRequest(BaseModel):
    project_id: str = "hackathon-demo-1"
    prompt: str
    industry: str = "Tourism & Travel"

@app.post("/api/projects/idea/analyze")
def analyze_idea_route(req: IdeaAnalysisRequest):
    res = IdeaEngine.analyze_idea(req.prompt, req.industry)
    brain = ProjectBrainManager.load_brain(req.project_id)
    brain.industry = res["industry"]
    brain.purpose = res["business_summary"]
    ProjectBrainManager.save_brain(brain)
    return res

class TechStackRequest(BaseModel):
    project_id: str = "hackathon-demo-1"
    industry: str = "Tourism & Travel"
    user_scale: str = "medium"

@app.post("/api/projects/tech-stack/analyze")
def analyze_tech_stack_route(req: TechStackRequest):
    res = TechStackEngine.generate_stack_options(req.industry, req.user_scale)
    brain = ProjectBrainManager.load_brain(req.project_id)
    brain.stack_options = res["all_options"]
    brain.recommended_stacks = res["top_3_recommendations"]
    brain.selected_stack = res["selected_default"]["name"]
    ProjectBrainManager.save_brain(brain)
    return res

class DesignRequest(BaseModel):
    project_id: str = "hackathon-demo-1"
    industry: str = "Tourism & Travel"
    style_preference: str = "Modern Glassmorphic"

@app.post("/api/projects/design/analyze")
def analyze_design_route(req: DesignRequest):
    res = DesignEngine.generate_design_direction(req.industry, req.style_preference)
    brain = ProjectBrainManager.load_brain(req.project_id)
    brain.design_system = res["design_system"]
    ProjectBrainManager.save_brain(brain)
    return res

class FinancialRequest(BaseModel):
    project_id: str = "hackathon-demo-1"
    industry: str = "Tourism & Travel"
    selected_scale: str = "medium"

@app.post("/api/projects/financial/estimate")
def estimate_financial_route(req: FinancialRequest):
    res = FinancialEngine.calculate_estimate(req.industry, req.selected_scale)
    brain = ProjectBrainManager.load_brain(req.project_id)
    brain.financial_estimate = res["active_estimate"]
    ProjectBrainManager.save_brain(brain)
    return res

class CompetitorRequest(BaseModel):
    project_id: str = "hackathon-demo-1"
    industry: str = "Tourism & Travel"
    prompt: str = "AI tourism platform"

@app.post("/api/projects/competitors/research")
def research_competitors_route(req: CompetitorRequest):
    res = CompetitorEngine.analyze_competitors(req.industry, req.prompt)
    brain = ProjectBrainManager.load_brain(req.project_id)
    brain.competitor_context = res["competitors"]
    ProjectBrainManager.save_brain(brain)
    return res

@app.post("/api/projects/documents/generate")
def generate_document_route(req: PresentationRequest):
    brain = ProjectBrainManager.load_brain(req.project_id)
    brain_summary = {
        "selected_stack": brain.selected_stack,
        "purpose": brain.purpose
    }
    deck = doc_engine.generate_presentation_deck(req.industry, req.presentation_type, req.title, brain_summary)
    return deck

class SupportBookingRequest(BaseModel):
    project_id: str = "hackathon-demo-1"
    user_name: str = "Developer"
    category: str = "API keys & Production Deployment"
    description: str = "Assistance connecting domain and Razorpay key injection"
    preferred_time: str = "Today at 4:00 PM"

@app.post("/api/projects/support/book")
def book_support_route(req: SupportBookingRequest):
    support_req = SupportEngine.book_developer_session(
        req.project_id,
        req.user_name,
        req.category,
        req.description,
        req.preferred_time
    )
    brain = ProjectBrainManager.load_brain(req.project_id)
    brain.human_support_requests.append(support_req.model_dump())
    ProjectBrainManager.save_brain(brain)
    return {"status": "booked", "request": support_req.model_dump()}

@app.get("/api/meta/industries")
def get_industries_route():
    return {"industries": INDUSTRIES, "presentation_types": PRESENTATION_TYPES}
