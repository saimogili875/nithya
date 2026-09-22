import os
import json
import time
from typing import List, Dict, Any, Optional
from .models import ProjectBrain, CodeFile

BRAIN_STORE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "brain_data")
os.makedirs(BRAIN_STORE_DIR, exist_ok=True)

class ProjectBrainManager:
    """
    Manages structured, persistent project memory (PROJECT BRAIN).
    Ensures state is stored on disk and provides intelligent context retrieval.
    """

    @staticmethod
    def get_file_path(project_id: str) -> str:
        return os.path.join(BRAIN_STORE_DIR, f"{project_id}.json")

    @classmethod
    def load_brain(cls, project_id: str) -> ProjectBrain:
        file_path = cls.get_file_path(project_id)
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return ProjectBrain(**data)
            except Exception as e:
                print(f"[Brain] Error loading brain for {project_id}: {e}")
        
        # Create default initial brain
        brain = ProjectBrain(
            project_id=project_id,
            name=f"Project-{project_id[:6]}",
            purpose="AI Managed Web Application",
            tech_stack=["Python", "FastAPI", "SQLite", "Docker"],
            architecture="RESTful Microservice with Docker Sandbox",
            project_rules=[
                "Always include /health endpoint",
                "Ensure all dependencies are declared in requirements.txt or package.json",
                "Containerize app with multi-stage or lean Dockerfile",
                "Never hardcode secrets or API keys"
            ]
        )
        cls.save_brain(brain)
        return brain

    @classmethod
    def save_brain(cls, brain: ProjectBrain) -> None:
        brain.updated_at = time.time()
        file_path = cls.get_file_path(brain.project_id)
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(brain.model_dump(), f, indent=2)
        except Exception as e:
            print(f"[Brain] Error saving brain for {brain.project_id}: {e}")

    @classmethod
    def update_from_files(cls, project_id: str, files: List[CodeFile], plan_summary: str = "") -> ProjectBrain:
        brain = cls.load_brain(project_id)
        file_paths = set(brain.files)
        apis = set(brain.apis)
        deps = set(brain.dependencies)

        for f in files:
            if f.action == "delete":
                file_paths.discard(f.path)
            else:
                file_paths.add(f.path)
            
            # Simple heuristic detection for APIs and dependencies
            if "requirements.txt" in f.path:
                for line in f.content.splitlines():
                    line = line.strip()
                    if line and not line.startswith("#"):
                        deps.add(line.split("==")[0].split(">=")[0])
            elif "package.json" in f.path:
                if "express" in f.content.lower():
                    deps.add("express")
                if "react" in f.content.lower():
                    deps.add("react")

            if "/health" in f.content or "def health" in f.content or 'app.get("/health"' in f.content:
                apis.add("GET /health")
            if "POST" in f.content or "app.post(" in f.content:
                apis.add("POST Endpoints")
            if "GET" in f.content or "app.get(" in f.content:
                apis.add("GET Endpoints")

        brain.files = sorted(list(file_paths))
        brain.apis = sorted(list(apis))
        brain.dependencies = sorted(list(deps))

        if plan_summary:
            brain.previous_changes.append({
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "summary": plan_summary,
                "file_count": len(files)
            })

        cls.save_brain(brain)
        return brain

    @classmethod
    def get_relevant_context(cls, project_id: str, user_prompt: str) -> Dict[str, Any]:
        """
        Retreives only relevant memory and file context rather than sending entire repo.
        """
        brain = cls.load_brain(project_id)
        prompt_lower = user_prompt.lower()

        relevant_files = []
        for f_path in brain.files:
            f_lower = f_path.lower()
            if any(term in prompt_lower for term in ["health", "api", "route", "server", "main", "app"]):
                if "main" in f_lower or "app" in f_lower or "server" in f_lower or "api" in f_lower:
                    relevant_files.append(f_path)
            elif "docker" in prompt_lower or "container" in prompt_lower:
                if "docker" in f_lower:
                    relevant_files.append(f_path)
            elif "db" in prompt_lower or "database" in prompt_lower or "model" in prompt_lower:
                if "db" in f_lower or "model" in f_lower or "schema" in f_lower or "sql" in f_lower:
                    relevant_files.append(f_path)

        if not relevant_files:
            relevant_files = brain.files[:5]  # Limit fallback context

        return {
            "purpose": brain.purpose,
            "tech_stack": brain.tech_stack,
            "architecture": brain.architecture,
            "all_files": brain.files,
            "relevant_files": relevant_files,
            "dependencies": brain.dependencies,
            "database": brain.database,
            "known_bugs": brain.known_bugs,
            "project_rules": brain.project_rules,
            "test_command": brain.test_command,
            "run_command": brain.run_command
        }
