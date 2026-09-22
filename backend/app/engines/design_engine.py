from typing import Dict, Any
from ..models import DesignSystem

class DesignEngine:
    """
    Phase 3: UI/UX Design Engine.
    Generates structured design directions, color systems, typography, layout rules,
    and mobile UX patterns without copying competitors.
    """

    @classmethod
    def generate_design_direction(cls, industry: str, style_preference: str = "Glassmorphic Modern") -> Dict[str, Any]:
        # Industry-tuned color palettes
        palettes = {
            "AgriTech": {"primary": "#10b981", "secondary": "#059669", "accent": "#f59e0b", "background": "#06130e", "card": "#0f291e"},
            "HealthTech": {"primary": "#0284c7", "secondary": "#06b6d4", "accent": "#10b981", "background": "#081018", "card": "#101e2e"},
            "FinTech": {"primary": "#6366f1", "secondary": "#8b5cf6", "accent": "#10b981", "background": "#0a0a14", "card": "#141428"},
            "Tourism & Travel": {"primary": "#06b6d4", "secondary": "#3b82f6", "accent": "#ec4899", "background": "#0a0d14", "card": "#121824"},
            "Retail / E-Commerce": {"primary": "#f43f5e", "secondary": "#fb923c", "accent": "#06b6d4", "background": "#120a0f", "card": "#24131d"}
        }

        colors = palettes.get(industry, palettes["Tourism & Travel"])

        design = DesignSystem(
            brand_style=style_preference,
            color_palette=colors,
            typography="Inter (Headings) & Fira Code (Technical Data)",
            navigation_style="Collapsible Left Sidebar with Mobile Control Sheet",
            component_style="Translucent Glassmorphism with Micro-glowing Borders",
            mobile_ux="Touch-first Bottom Action Sheets & Floating Control Bar"
        )

        return {
            "industry": industry,
            "design_system": design.model_dump(),
            "component_tokens": {
                "border_radius": "12px",
                "backdrop_filter": "blur(16px)",
                "shadow": "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
            }
        }
