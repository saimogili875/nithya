import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, ShieldCheck, DollarSign, Layers } from 'lucide-react';

export default function TechStackPhase({ industry = "Tourism & Travel" }) {
  const [stackData, setStackData] = useState(null);
  const [selectedStackId, setSelectedStackId] = useState('opt-1');

  useEffect(() => {
    fetchStackOptions();
  }, [industry]);

  const fetchStackOptions = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/projects/tech-stack/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, user_scale: 'medium' })
      });
      const data = await res.json();
      setStackData(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.1))' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu color="#3b82f6" /> Phase 2: Tech Stack Recommendation Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          Autonomous architectural reasoning evaluating 5 technical stack options and highlighting the Top 3 recommendations for {industry}.
        </p>
      </div>

      {stackData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f3f4f6' }}>
            5 Generated Technology Stack Architectures
          </h3>

          {stackData.all_options.map((opt) => {
            const isSelected = selectedStackId === opt.id;
            return (
              <div
                key={opt.id}
                className="glass-panel"
                onClick={() => setSelectedStackId(opt.id)}
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  borderColor: isSelected ? '#06b6d4' : 'rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(18, 24, 36, 0.75)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff' }}>{opt.name}</h4>
                    {opt.is_recommended && (
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>
                        TOP 3 RECOMMENDATION
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#06b6d4', fontFamily: 'monospace' }}>
                    {opt.estimated_cost_impact}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '12px' }}>{opt.why}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>ADVANTAGES:</span>
                    <ul style={{ paddingLeft: '16px', color: '#9ca3af', marginTop: '2px' }}>
                      {opt.advantages.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>SCALABILITY & COMPLEXITY:</span>
                    <p style={{ color: '#9ca3af', marginTop: '2px' }}>Scalability: {opt.scalability}</p>
                    <p style={{ color: '#9ca3af' }}>Complexity: {opt.complexity}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
