import React, { useState, useEffect } from 'react';
import { Users, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function CompetitorPhase({ industry = "Tourism & Travel", prompt = "AI tourism platform" }) {
  const [compData, setCompData] = useState(null);

  useEffect(() => {
    fetchCompetitors();
  }, [industry]);

  const fetchCompetitors = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/projects/competitors/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, prompt })
      });
      const data = await res.json();
      setCompData(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users color="#8b5cf6" /> Phase 5: Competitor Intelligence Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          Public competitor market analysis across 5 perspectives: Customer, Business, Product, Tech, and Pricing.
        </p>
      </div>

      {compData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Key Differentiator Box */}
          <div className="glass-panel" style={{ padding: '16px', borderColor: '#8b5cf6', background: 'rgba(139,92,246,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <Zap size={16} /> KEY DIFFERENTIATOR FOR NITHYA
            </div>
            <p style={{ color: '#e5e7eb', fontSize: '0.85rem', marginTop: '4px' }}>{compData.key_differentiator}</p>
          </div>

          {/* Competitor Cards */}
          {compData.competitors.map((comp, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>{comp.name}</h3>
                <a href={comp.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {comp.website} <ExternalLink size={12} />
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>CUSTOMER VIEW:</span>
                  <p style={{ color: '#9ca3af', marginTop: '2px' }}>{comp.customer_view}</p>
                </div>
                <div>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>BUSINESS VIEW:</span>
                  <p style={{ color: '#9ca3af', marginTop: '2px' }}>{comp.business_view}</p>
                </div>
                <div>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>PRICING VIEW:</span>
                  <p style={{ color: '#9ca3af', marginTop: '2px' }}>{comp.pricing_view}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
