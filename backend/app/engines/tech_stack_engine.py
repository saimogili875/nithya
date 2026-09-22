from typing import Dict, Any, List
from ..models import TechStackOption

class TechStackEngine:
    """
    Phase 2: Tech Stack Engine.
    Generates 5 distinct architectural options based on requirements and highlights
    the Top 3 recommendations with pros/cons and cost impact.
    """

    @classmethod
    def generate_stack_options(cls, industry: str, user_scale: str = "medium") -> Dict[str, Any]:
        options = [
            TechStackOption(
                id="opt-1",
                name="FastAPI + React + SQLite / PostgreSQL",
                stack="Python (FastAPI) | React (Vite) | Docker | SQLite",
                why="Ultra-fast AI development speed with minimal memory footprint and zero cold-start delay.",
                advantages=["Extremely fast execution & rapid prototyping", "Native Python AI/ML ecosystem support", "Lean Docker image build"],
                disadvantages=["Requires separate frontend-backend dev server"],
                scalability="High (10,000+ RPS with Uvicorn workers)",
                complexity="Low (Clean decoupled REST API)",
                estimated_cost_impact="$15 - $45 / month",
                is_recommended=True
            ),
            TechStackOption(
                id="opt-2",
                name="Next.js + Node.js + PostgreSQL",
                stack="TypeScript (Next.js 14) | Node.js | TailwindCSS | PostgreSQL",
                why="Unified full-stack TypeScript codebase with Server-Side Rendering (SSR) for high SEO.",
                advantages=["Single language across UI & Backend", "Excellent SEO & SSR capabilities", "Vercel / Railway ready"],
                disadvantages=["Slightly higher RAM consumption during SSR builds"],
                scalability="High (Serverless auto-scaling)",
                complexity="Medium (Fullstack Next.js routes)",
                estimated_cost_impact="$25 - $60 / month",
                is_recommended=True
            ),
            TechStackOption(
                id="opt-3",
                name="Django REST + React + PostgreSQL",
                stack="Python (Django) | React | Celery | PostgreSQL",
                why="Batteries-included enterprise framework with admin panel and ORM.",
                advantages=["Built-in admin dashboard & user auth", "Robust Django ORM & migrations", "Great for data-heavy domain models"],
                disadvantages=["Heavier initial project structure"],
                scalability="Very High (Enterprise scaled)",
                complexity="Medium-High",
                estimated_cost_impact="$40 - $90 / month",
                is_recommended=True
            ),
            TechStackOption(
                id="opt-4",
                name="Go (Gin) + Vue.js + Redis",
                stack="Golang (Gin) | Vue 3 | Redis | PostgreSQL",
                why="Sub-millisecond API response latency for real-time high-throughput systems.",
                advantages=["Ultra-low CPU & memory footprint", "High concurrency throughput", "Static binary deployment"],
                disadvantages=["Slower initial boilerplate setup time"],
                scalability="Extreme (100k+ concurrent connections)",
                complexity="High",
                estimated_cost_impact="$20 - $50 / month",
                is_recommended=False
            ),
            TechStackOption(
                id="opt-5",
                name="Microservices Cloud Stack",
                stack="FastAPI Microservices | React | Docker Compose | NGINX",
                why="Decoupled domain services for independent horizontal scaling.",
                advantages=["Isolated fault domains", "Independent deployment pipelines", "Ideal for large dev teams"],
                disadvantages=["Higher devops orchestration complexity"],
                scalability="Infinite",
                complexity="Very High",
                estimated_cost_impact="$70 - $200 / month",
                is_recommended=False
            )
        ]

        top_3 = [opt.model_dump() for opt in options if opt.is_recommended]

        return {
            "industry": industry,
            "user_scale": user_scale,
            "all_options": [opt.model_dump() for opt in options],
            "top_3_recommendations": top_3,
            "selected_default": top_3[0]
        }
