import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoldCard from '../components/ui/GoldCard';
import { Users, ArrowRight, ArrowLeft, ExternalLink, Zap, Loader2, MessageSquare, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CompetitorPage({ projectBrain }) {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [compData, setCompData] = useState(null);

  useEffect(() => {
    handleAnalyzeMarket();
  }, []);

  const handleAnalyzeMarket = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/api/projects/competitors/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'hackathon-demo-1',
          industry: projectBrain?.industry || 'Tourism & Travel',
          prompt: projectBrain?.purpose || 'AI tourism platform'
        })
      });
      const data = await res.json();
      setCompData(data);
    } catch (e) {
      // Structured fallback data
      setCompData({
        key_differentiator: "AI-driven real-time guide matching combined with hyper-local WhatsApp instant booking.",
        competitors: [
          {
            name: "MakeMyTrip / Tripadvisor",
            website: "https://www.tripadvisor.com",
            customer_view: "High availability of global listings but lacks personalized AI itineraries.",
            business_view: "Commission-heavy marketplace model with legacy mobile app UX.",
            pricing_view: "$20 - $150 per tour booking fee."
          },
          {
            name: "Viator / GetYourGuide",
            website: "https://www.getyourguide.com",
            customer_view: "Good tour selection but customer complaints cite delayed booking confirmations.",
            business_view: "B2C aggregation platform with strict supplier onboarding criteria.",
            pricing_view: "20% platform commission model."
          }
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Header Banner */}
      <GoldCard active={true} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gold-badge" style={{ marginBottom: '8px' }}>PHASE 5 ENGINE</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users color="#f59e0b" size={24} /> AI Market Intelligence & Competitor Studio
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              Public market analysis across customer sentiment, positioning, pricing gaps, and market whitespace opportunities.
            </p>
          </div>
          <span className="gold-badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
            DEMO RESEARCH DATA
          </span>
        </div>
      </GoldCard>

      {isAnalyzing && (
        <GoldCard style={{ textAlign: 'center', padding: '36px' }}>
          <Loader2 size={32} color="#f59e0b" className="spin" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>Analyzing public competitor signals...</h3>
        </GoldCard>
      )}

      {compData && !isAnalyzing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Market Whitespace & Key Differentiator Box */}
          <GoldCard active={true} style={{ borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24', fontWeight: '800', fontSize: '1rem' }}>
              <Zap size={20} color="#f59e0b" /> MARKET WHITESPACE & MOAT OPPORTUNITY
            </div>
            <p style={{ color: '#f8fafc', fontSize: '0.9rem', marginTop: '8px', lineHeight: '1.5' }}>
              {compData.key_differentiator}
            </p>
          </GoldCard>

          {/* Competitor Discovery Cards */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '14px' }}>
              Discovered Market Competitors
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {compData.competitors.map((comp, i) => (
                <GoldCard key={i} title={comp.name} badge="Competitor Analysis">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <a href={comp.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {comp.website} <ExternalLink size={13} />
                    </a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', fontSize: '0.82rem' }}>
                    <div style={{ padding: '10px', background: 'rgba(8, 10, 16, 0.8)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#06b6d4', fontWeight: '800', display: 'block', marginBottom: '4px' }}>CUSTOMER SENTIMENT:</span>
                      <p style={{ color: '#94a3b8', lineHeight: '1.4' }}>{comp.customer_view}</p>
                    </div>

                    <div style={{ padding: '10px', background: 'rgba(8, 10, 16, 0.8)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#10b981', fontWeight: '800', display: 'block', marginBottom: '4px' }}>BUSINESS POSITIONING:</span>
                      <p style={{ color: '#94a3b8', lineHeight: '1.4' }}>{comp.business_view}</p>
                    </div>

                    <div style={{ padding: '10px', background: 'rgba(8, 10, 16, 0.8)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#f59e0b', fontWeight: '800', display: 'block', marginBottom: '4px' }}>PUBLIC PRICING MODEL:</span>
                      <p style={{ color: '#94a3b8', lineHeight: '1.4' }}>{comp.pricing_view}</p>
                    </div>
                  </div>
                </GoldCard>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button onClick={() => navigate('/financial')} className="gold-btn" style={{ background: 'transparent', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Back to Cost
            </button>
            <button onClick={() => navigate('/documents')} className="gold-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px' }}>
              Continue to Documents & PPT → <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
