from typing import Dict, Any, List

class FinancialEngine:
    """
    Phase 4: Financial & Infrastructure Engine.
    Estimates infrastructure, database, storage, CDN, AI API, and messaging costs
    across Small, Medium, and Large user scales using rate-card abstractions.
    """

    # Provider Rate Card Abstraction (Estimates)
    RATE_CARD = {
        "server_small": 15.0,    # 1 vCPU, 2GB RAM Container
        "server_medium": 45.0,   # 2 vCPU, 4GB RAM Dedicated Container
        "server_large": 150.0,   # Auto-scaled Cluster (4 node)
        
        "db_small": 10.0,        # Managed SQLite / Small Postgres
        "db_medium": 35.0,       # High-availability PostgreSQL (10GB)
        "db_large": 120.0,       # Multi-AZ PostgreSQL (100GB)
        
        "storage_small": 5.0,
        "storage_medium": 15.0,
        "storage_large": 50.0,
        
        "ai_api_small": 15.0,    # ~500k tokens/mo
        "ai_api_medium": 60.0,   # ~3M tokens/mo
        "ai_api_large": 250.0,   # ~15M tokens/mo
        
        "cdn_ssl": 10.0,
        "whatsapp_sms": 25.0
    }

    @classmethod
    def calculate_estimate(cls, industry: str, selected_scale: str = "medium") -> Dict[str, Any]:
        scenarios = {
            "small": {
                "name": "Small (10 - 100 users)",
                "server": cls.RATE_CARD["server_small"],
                "database": cls.RATE_CARD["db_small"],
                "storage": cls.RATE_CARD["storage_small"],
                "ai_apis": cls.RATE_CARD["ai_api_small"],
                "cdn_domain": 5.0,
                "whatsapp": 0.0,
                "total_monthly": cls.RATE_CARD["server_small"] + cls.RATE_CARD["db_small"] + cls.RATE_CARD["storage_small"] + cls.RATE_CARD["ai_api_small"] + 5.0
            },
            "medium": {
                "name": "Medium (~1,000 users)",
                "server": cls.RATE_CARD["server_medium"],
                "database": cls.RATE_CARD["db_medium"],
                "storage": cls.RATE_CARD["storage_medium"],
                "ai_apis": cls.RATE_CARD["ai_api_medium"],
                "cdn_domain": cls.RATE_CARD["cdn_ssl"],
                "whatsapp": cls.RATE_CARD["whatsapp_sms"],
                "total_monthly": cls.RATE_CARD["server_medium"] + cls.RATE_CARD["db_medium"] + cls.RATE_CARD["storage_medium"] + cls.RATE_CARD["ai_api_medium"] + cls.RATE_CARD["cdn_ssl"] + cls.RATE_CARD["whatsapp_sms"]
            },
            "large": {
                "name": "Large (10,000+ users)",
                "server": cls.RATE_CARD["server_large"],
                "database": cls.RATE_CARD["db_large"],
                "storage": cls.RATE_CARD["storage_large"],
                "ai_apis": cls.RATE_CARD["ai_api_large"],
                "cdn_domain": 30.0,
                "whatsapp": 80.0,
                "total_monthly": cls.RATE_CARD["server_large"] + cls.RATE_CARD["db_large"] + cls.RATE_CARD["storage_large"] + cls.RATE_CARD["ai_api_large"] + 30.0 + 80.0
            }
        }

        active_scenario = scenarios.get(selected_scale.lower(), scenarios["medium"])

        return {
            "industry": industry,
            "selected_scale": selected_scale,
            "active_estimate": active_scenario,
            "all_scenarios": scenarios,
            "disclaimer": "Estimates based on public cloud provider rate-cards. Actual consumption may vary based on traffic spikes."
        }
