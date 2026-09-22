import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, ArrowLeft, ExternalLink, Zap, Loader2 } from 'lucide-react';

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
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(6,182,212,0.1))', borderColor: '#f43f5e' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users color="#f43f5e" /> Phase 5: Competitor Intelligence Engine
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>
          Public market analysis across Customer, Business, Product, Technology, and Pricing views.
        </p>
      </div>

      {isAnalyzing && (
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', borderColor: '#f43f5e' }}>
          <Loader2 size={36} color="#f43f5e" className="spin" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>Analyzing market competitors and public signals...</h3>
        </div>
      )}

      {compData && !isAnalyzing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Key Differentiator Box */}
          <div className="glass-panel" style={{ padding: '20px', borderColor: '#f43f5e', background: 'rgba(244,63,94,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: 'bold', fontSize: '0.95rem' }}>
              <Zap size={18} /> KEY DIFFERENTIATOR & OPPORTUNITY AREA
            </div>
            <p style={{ color: '#e5e7eb', fontSize: '0.9rem', marginTop: '6px' }}>{compData.key_differentiator}</p>
          </div>

          {/* Competitor Cards */}
          {compData.competitors.map((comp, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{comp.name}</h3>
                <a href={comp.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {comp.website} <ExternalLink size={14} />
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>CUSTOMER PERSPECTIVE:</span>
                  <p style={{ color: '#9ca3af', marginTop: '2px' }}>{comp.customer_view}</p>
                </div>
                <div>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>BUSINESS PERSPECTIVE:</span>
                  <p style={{ color: '#9ca3af', marginTop: '2px' }}>{comp.business_view}</p>
                </div>
                <div>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>PRICING PERSPECTIVE:</span>
                  <p style={{ color: '#9ca3af', marginTop: '2px' }}>{comp.pricing_view}</p>
                </div>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button onClick={() => navigate('/financial')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Back to Cost
            </button>
            <button onClick={() => navigate('/documents')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #f43f5e, #06b6d4)' }}>
              Continue to Documents & PPT → <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
