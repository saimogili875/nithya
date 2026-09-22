from typing import Dict, Any, List
from abc import ABC, abstractmethod

class PresentationProvider(ABC):
    @abstractmethod
    def generate_presentation(self, industry: str, presentation_type: str, title: str, brain_summary: Dict[str, Any]) -> Dict[str, Any]:
        pass

class LocalPptxProvider(PresentationProvider):
    """
    Local PPT presentation renderer providing structured slide decks.
    """

    def generate_presentation(self, industry: str, presentation_type: str, title: str, brain_summary: Dict[str, Any]) -> Dict[str, Any]:
        slides = [
            {
                "slide_number": 1,
                "title": title,
                "subtitle": f"AI Platform Pitch — {industry}",
                "bullet_points": [
                    f"Target Industry: {industry}",
                    "Positioning: Business Idea → Production Software",
                    "Generated autonomously by Nithya AI Engine"
                ]
            },
            {
                "slide_number": 2,
                "title": "Problem Statement & Opportunity",
                "subtitle": f"Transforming {industry} Workflows",
                "bullet_points": [
                    "Legacy software engineering takes 3-6 months.",
                    "High operational costs and brittle deployments.",
                    "Nithya reduces time-to-market from months to minutes."
                ]
            },
            {
                "slide_number": 3,
                "title": "Technical Architecture & Stack",
                "subtitle": brain_summary.get("selected_stack", "FastAPI + React + Docker"),
                "bullet_points": [
                    f"Core Stack: {brain_summary.get('selected_stack', 'FastAPI + React')}",
                    "Containerization: Docker microservice isolation",
                    "Monitoring: Continuous /health prober & AI self-healing"
                ]
            },
            {
                "slide_number": 4,
                "title": "Financial Estimation & ROI",
                "subtitle": "Infrastructure Cost Optimization",
                "bullet_points": [
                    "Small Scale (10-100 users): ~$50/mo",
                    "Medium Scale (~1,000 users): ~$160/mo",
                    "High availability container scaling with rate-card cost predictability."
                ]
            },
            {
                "slide_number": 5,
                "title": "Live Production Demo & Next Steps",
                "subtitle": "Autonomous Deployment",
                "bullet_points": [
                    "Code generation & unit testing completed cleanly.",
                    "Live container instance running with active SSL.",
                    "24/7 AI Self-healing & Human Developer Support."
                ]
            }
        ]

        return {
            "provider": "LocalPPTXProvider",
            "industry": industry,
            "presentation_type": presentation_type,
            "title": title,
            "total_slides": len(slides),
            "slides": slides,
            "download_filename": f"{presentation_type.lower().replace(' ', '_')}_{industry.lower().replace(' ', '_')}.json"
        }

class DocumentEngine:
    """
    Phase 6: PPT & Document Engine.
    Coordinates presentation generation across 13 Industries x 10 Presentation Types.
    """

    def __init__(self, provider: PresentationProvider = None):
        self.provider = provider or LocalPptxProvider()

    def generate_presentation_deck(self, industry: str, presentation_type: str, title: str, brain_summary: Dict[str, Any] = None) -> Dict[str, Any]:
        summary = brain_summary or {}
        return self.provider.generate_presentation(industry, presentation_type, title, summary)
