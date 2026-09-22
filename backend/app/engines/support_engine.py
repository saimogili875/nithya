import time
from typing import Dict, Any, List
from ..models import HumanSupportRequest

class SupportEngine:
    """
    Phase 7: Human Developer Support Engine.
    Manages 'Book a Developer' 1-hour sessions for production deployment assistance,
    Razorpay/WhatsApp key injection, DNS configuration, and BYOK migration.
    """

    # In-memory session store per project
    requests_store: List[HumanSupportRequest] = []

    @classmethod
    def book_developer_session(
        cls,
        project_id: str,
        user_name: str,
        category: str,
        description: str,
        preferred_time: str
    ) -> HumanSupportRequest:
        req = HumanSupportRequest(
            project_id=project_id,
            user_name=user_name,
            category=category,
            description=description,
            preferred_time=preferred_time,
            status="SCHEDULED"
        )
        cls.requests_store.append(req)
        return req

    @classmethod
    def get_project_requests(cls, project_id: str) -> List[Dict[str, Any]]:
        return [r.model_dump() for r in cls.requests_store if r.project_id == project_id]
