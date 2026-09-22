from typing import Dict, Any, List
from ..models import ProjectBrain, INDUSTRIES

class IdeaEngine:
    """
    Phase 1: Idea / Prompt Engine.
    Converts business prompts into structured PRDs, industry classifications,
    module breakdowns, and implementation milestones.
    """

    @classmethod
    def analyze_idea(cls, prompt: str, selected_industry: str = "Tourism & Travel") -> Dict[str, Any]:
        prompt_lower = prompt.lower()
        
        # Industry auto-detection heuristic if generic
        detected_industry = selected_industry
        if "crop" in prompt_lower or "farm" in prompt_lower or "soil" in prompt_lower:
            detected_industry = "AgriTech"
        elif "doctor" in prompt_lower or "health" in prompt_lower or "patient" in prompt_lower:
            detected_industry = "HealthTech"
        elif "learn" in prompt_lower or "school" in prompt_lower or "course" in prompt_lower:
            detected_industry = "EdTech"
        elif "shop" in prompt_lower or "store" in prompt_lower or "cart" in prompt_lower:
            detected_industry = "Retail / E-Commerce"
        elif "payment" in prompt_lower or "bank" in prompt_lower or "loan" in prompt_lower:
            detected_industry = "FinTech"
        elif "tour" in prompt_lower or "travel" in prompt_lower or "hotel" in prompt_lower or "hyderabad" in prompt_lower:
            detected_industry = "Tourism & Travel"

        return {
            "prompt": prompt,
            "industry": detected_industry,
            "business_summary": f"Autonomous software platform tailored for {detected_industry} addressing '{prompt}'.",
            "target_users": "End Consumers, Enterprise Operations & Regional Managers",
            "prd": {
                "vision": f"Deliver a high-reliability, real-time platform for {detected_industry}.",
                "core_requirements": [
                    "RESTful API & Healthcheck endpoint (/health)",
                    "Interactive Responsive User Interface",
                    "Database storage & state persistence",
                    "Containerized deployment with automatic health monitoring"
                ],
                "recommended_modules": [
                    "User Authentication & Roles Module",
                    "Core Domain API Services",
                    "Data Analytics & Metrics Dashboard",
                    "Background Job / Notification Service"
                ]
            }
        }
