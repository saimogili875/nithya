from typing import Dict, Any, List
from ..models import CompetitorAnalysis

class CompetitorEngine:
    """
    Phase 5: Competitor Intelligence Engine.
    Provides structured public competitor research across 5 perspectives:
    Customer, Business, Product, Tech, and Pricing.
    """

    @classmethod
    def analyze_competitors(cls, industry: str, prompt: str) -> Dict[str, Any]:
        competitors_by_industry = {
            "Tourism & Travel": [
                CompetitorAnalysis(
                    name="MakeMyTrip / Yatra",
                    website="https://makemytrip.com",
                    customer_view="High feature density, frequent user reviews cite cluttered navigation.",
                    business_view="Commission per booking + sponsored hotel placements.",
                    product_view="Flights, Hotels, Packages, Bus & Rail booking.",
                    tech_view="React web, Native Mobile apps, Java/Node backend microservices.",
                    pricing_view="Dynamic pricing model with seasonal surges."
                ),
                CompetitorAnalysis(
                    name="TripAdvisor",
                    website="https://tripadvisor.com",
                    customer_view="Trusted for authentic user reviews & photo sharing.",
                    business_view="Ad impression revenue + affiliate lead generation.",
                    product_view="Reviews, Hotel price comparison, Experience booking.",
                    tech_view="Cloud hosted distributed search indexing.",
                    pricing_view="Free for consumers, CPC/CPA for travel operators."
                )
            ],
            "FinTech": [
                CompetitorAnalysis(
                    name="Razorpay / Stripe",
                    website="https://razorpay.com",
                    customer_view="Clean, seamless checkout UX with 1-click UPI.",
                    business_view="2% transaction processing fee + subscription billing SaaS.",
                    product_view="Payment Gateway, Subscriptions, Payroll, Payouts.",
                    tech_view="Node.js/Go core API, Redis idempotency, React Dashboard.",
                    pricing_view="2% flat fee per transaction."
                )
            ]
        }

        comps = competitors_by_industry.get(industry, competitors_by_industry["Tourism & Travel"])

        return {
            "industry": industry,
            "query_prompt": prompt,
            "competitors": [c.model_dump() for c in comps],
            "key_differentiator": f"AI-First Autonomous Self-Healing Platform tailored for {industry} with instant prototype deployment."
        }
