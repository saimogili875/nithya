from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import time
import uuid

INDUSTRIES = [
    "AgriTech",
    "HealthTech",
    "EdTech",
    "Retail / E-Commerce",
    "FinTech",
    "Manufacturing",
    "Logistics & Supply Chain",
    "Real Estate / PropTech",
    "Hospitality",
    "Energy & Utilities",
    "Government / CivicTech",
    "Biotech / Research",
    "Tourism & Travel"
]

PRESENTATION_TYPES = [
    "Investor Pitch",
    "Hackathon Presentation",
    "Business Proposal",
    "Product Demo",
    "Technical Architecture",
    "Market Research",
    "College Project",
    "Project Report",
    "Marketing Presentation",
    "Training Presentation"
]

class CodeFile(BaseModel):
    path: str
    content: str
    action: str = "create"  # "create", "modify", "delete"

class AgentPlan(BaseModel):
    summary: str
    steps: List[str] = []
    files: List[CodeFile] = []
    test_command: str = "python -m unittest discover -s tests"
    run_command: str = "python main.py"
    healthcheck_path: str = "/health"
    dockerfile: str = ""
    docker_compose: str = ""
    environment_variables: Dict[str, str] = {}
    database_required: bool = False
    database_type: str = "none"

class TechStackOption(BaseModel):
    id: str
    name: str
    stack: str
    why: str
    advantages: List[str]
    disadvantages: List[str]
    scalability: str
    complexity: str
    estimated_cost_impact: str
    is_recommended: bool = False

class DesignSystem(BaseModel):
    brand_style: str = "Modern Glassmorphic"
    color_palette: Dict[str, str] = Field(default_factory=lambda: {
        "primary": "#06b6d4",
        "secondary": "#3b82f6",
        "accent": "#10b981",
        "background": "#0a0d14",
        "card": "#121824"
    })
    typography: str = "Inter & Fira Code"
    navigation_style: str = "Left Collapsible Sidebar"
    component_style: str = "Rounded Glass Panels with Micro-glow"
    mobile_ux: str = "Single-column Bottom Sheet Control Center"

class FinancialEstimate(BaseModel):
    scale_tier: str = "Medium (~1,000 users)"
    server_cost: float = 45.0
    database_cost: float = 30.0
    storage_cost: float = 15.0
    api_costs: Dict[str, float] = Field(default_factory=lambda: {
        "AI LLM APIs": 40.0,
        "WhatsApp / SMS": 20.0,
        "CDN & SSL": 10.0
    })
    total_monthly: float = 160.0

class CompetitorAnalysis(BaseModel):
    name: str
    website: str
    customer_view: str
    business_view: str
    product_view: str
    tech_view: str
    pricing_view: str
    confidence: str = "High (Public Data)"

class PresentationRequest(BaseModel):
    project_id: str
    industry: str = "Tourism & Travel"
    presentation_type: str = "Hackathon Presentation"
    title: str = "Nithya AI Platform Presentation"

class HumanSupportRequest(BaseModel):
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    project_id: str
    user_name: str = "Developer"
    category: str = "API keys & Production Deployment"
    description: str = "Need assistance setting up custom domain and Razorpay key injection"
    preferred_time: str = "Today at 4:00 PM"
    status: str = "PENDING"  # PENDING, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    created_at: float = Field(default_factory=time.time)

class ProjectBrain(BaseModel):
    project_id: str
    name: str = "Untitled App"
    mode: str = "new"  # "new", "local", "github"
    industry: str = "Tourism & Travel"
    purpose: str = "AI Managed Web Application"
    business_description: str = "AI-powered digital software solution"
    target_users: str = "End consumers & business managers"
    user_scale: str = "medium"  # "small", "medium", "large"
    budget_range: str = "$100 - $500 / month"
    business_model: str = "SaaS Subscription / API Pay-as-you-go"
    
    tech_stack: List[str] = ["Python", "FastAPI", "SQLite", "Docker", "React"]
    stack_options: List[Dict[str, Any]] = []
    recommended_stacks: List[Dict[str, Any]] = []
    selected_stack: str = "FastAPI + React + SQLite"
    
    architecture: str = "Microservice / API with Sandboxed Execution"
    files: List[str] = []
    dependencies: List[str] = []
    database: str = "SQLite"
    apis: List[str] = []
    environment_variables: Dict[str, str] = {}
    docker_config: Dict[str, Any] = {}
    test_command: str = ""
    run_command: str = ""
    healthcheck_path: str = "/health"
    deployment_config: Dict[str, Any] = {}
    
    design_system: Dict[str, Any] = Field(default_factory=lambda: DesignSystem().model_dump())
    competitor_context: List[Dict[str, Any]] = []
    financial_estimate: Dict[str, Any] = Field(default_factory=lambda: FinancialEstimate().model_dump())
    ppt_preferences: Dict[str, Any] = Field(default_factory=lambda: {"presentation_type": "Hackathon Presentation"})
    human_support_requests: List[Dict[str, Any]] = []
    
    previous_changes: List[Dict[str, Any]] = []
    known_bugs: List[str] = []
    project_rules: List[str] = []
    updated_at: float = Field(default_factory=time.time)

class ActivityEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: time.strftime("%H:%M:%S"))
    phase: str
    status: str = "info"
    message: str
    details: Optional[Dict[str, Any]] = None

class InfrastructureStatus(BaseModel):
    application: str = "off"
    docker: str = "off"
    server: str = "off"
    database: str = "off"
    storage: str = "off"
    deployment: str = "off"
    ssl: str = "off"
    domain: str = "off"
    monitoring: str = "off"
    container_id: Optional[str] = None
    container_name: Optional[str] = None
    live_url: Optional[str] = None
    active_port: Optional[int] = None
    db_type: Optional[str] = None

class PromptRequest(BaseModel):
    project_id: Optional[str] = None
    prompt: str
    mode: str = "new"
    industry: Optional[str] = "Tourism & Travel"
    local_path: Optional[str] = None
    repo_url: Optional[str] = None
    is_demo: bool = False
