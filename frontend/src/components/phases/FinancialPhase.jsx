import React, { useState, useEffect } from 'react';
import { DollarSign, Server, Database, HardDrive, Cpu, MessageSquare } from 'lucide-react';

export default function FinancialPhase({ industry = "Tourism & Travel" }) {
  const [scale, setScale] = useState('medium');
  const [financialData, setFinancialData] = useState(null);

  useEffect(() => {
    fetchEstimate();
  }, [scale, industry]);

  const fetchEstimate = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/projects/financial/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, selected_scale: scale })
      });
      const data = await res.json();
      setFinancialData(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(6,182,212,0.1))' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign color="#f59e0b" /> Phase 4: Financial & Infrastructure Cost Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          Rate-card based financial estimation for compute, database, storage, AI LLM APIs, and messaging across user scale tiers.
        </p>
      </div>

      {/* Scale Tier Selector */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px' }}>
        {['small', 'medium', 'large'].map((s) => (
          <button
            key={s}
            onClick={() => setScale(s)}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700',
              border: scale === s ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
              background: scale === s ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0,0,0,0.3)',
              color: scale === s ? '#f59e0b' : '#9ca3af', cursor: 'pointer'
            }}
          >
            {s === 'small' ? 'SMALL (10 - 100 users)' : s === 'medium' ? 'MEDIUM (~1,000 users)' : 'LARGE (10,000+ users)'}
          </button>
        ))}
      </div>

      {financialData && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                Estimated Monthly Operating Cost
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{financialData.active_estimate.name}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b', fontFamily: 'monospace' }}>
                ${financialData.active_estimate.total_monthly} / mo
              </div>
              <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Est. Annual: ${(financialData.active_estimate.total_monthly * 12).toFixed(0)}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.85rem' }}>
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}><Server size={14} color="#06b6d4" /> Server Compute</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>${financialData.active_estimate.server} / mo</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}><Database size={14} color="#10b981" /> Database Managed</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>${financialData.active_estimate.database} / mo</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={14} color="#8b5cf6" /> AI LLM APIs</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>${financialData.active_estimate.ai_apis} / mo</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={14} color="#ec4899" /> Messaging & CDN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>${(financialData.active_estimate.cdn_domain + financialData.active_estimate.whatsapp).toFixed(0)} / mo</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
