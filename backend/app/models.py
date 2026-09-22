from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import time
import uuid

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
    database_type: str = "none"  # "postgresql", "sqlite", "none"

class ProjectBrain(BaseModel):
    project_id: str
    name: str = "Untitled App"
    mode: str = "new"  # "new", "local", "github"
    purpose: str = ""
    tech_stack: List[str] = []
    architecture: str = "Microservice / API"
    files: List[str] = []
    dependencies: List[str] = []
    database: str = "None"
    apis: List[str] = []
    environment_variables: Dict[str, str] = {}
    docker_config: Dict[str, Any] = {}
    test_command: str = ""
    run_command: str = ""
    healthcheck_path: str = "/health"
    deployment_config: Dict[str, Any] = {}
    previous_changes: List[Dict[str, Any]] = []
    known_bugs: List[str] = []
    project_rules: List[str] = []
    updated_at: float = Field(default_factory=time.time)

class ActivityEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: time.strftime("%H:%M:%S"))
    phase: str  # e.g., "understand", "inspect", "plan", "code", "test", "debug", "docker", "deploy", "monitor", "fix"
    status: str = "info"  # "in_progress", "success", "warning", "error", "info"
    message: str
    details: Optional[Dict[str, Any]] = None

class InfrastructureStatus(BaseModel):
    application: str = "off"  # "green", "red", "yellow", "off"
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
    mode: str = "new"  # "new", "local", "github"
    local_path: Optional[str] = None
    repo_url: Optional[str] = None
    is_demo: bool = False

class HumanApprovalRequest(BaseModel):
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    action_type: str  # "db_migration", "db_delete", "git_push", "env_change"
    payload: Dict[str, Any] = {}
    status: str = "pending"  # "pending", "approved", "rejected"
    created_at: float = Field(default_factory=time.time)
