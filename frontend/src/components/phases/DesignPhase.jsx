import React, { useState, useEffect } from 'react';
import { Palette, Layers, Smartphone, Layout, Eye } from 'lucide-react';

export default function DesignPhase({ industry = "Tourism & Travel" }) {
  const [designData, setDesignData] = useState(null);

  useEffect(() => {
    fetchDesignDirection();
  }, [industry]);

  const fetchDesignDirection = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/projects/design/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, style_preference: 'Modern Glassmorphic' })
      });
      const data = await res.json();
      setDesignData(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette color="#10b981" /> Phase 3: UI/UX Design Intelligence Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          Original design system synthesis for {industry} providing curated color swatches, typography tokens, component styles, and mobile UX directions.
        </p>
      </div>

      {designData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {/* Color Palette Panel */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={16} color="#06b6d4" /> Curated Color Palette
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.entries(designData.design_system.color_palette).map(([key, hex]) => (
                <div key={key} style={{ flex: 1, minWidth: '80px', textAlign: 'center' }}>
                  <div style={{ height: '45px', borderRadius: '8px', background: hex, boxShadow: `0 0 10px ${hex}44`, marginBottom: '6px' }} />
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'capitalize' }}>{key}</span>
                  <div style={{ fontSize: '0.7rem', color: '#fff', fontFamily: 'monospace' }}>{hex}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography & System Specs */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layout size={16} color="#8b5cf6" /> System Architecture & Typography
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>TYPOGRAPHY:</span>
                <p style={{ color: '#e5e7eb' }}>{designData.design_system.typography}</p>
              </div>
              <div>
                <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>NAVIGATION STYLE:</span>
                <p style={{ color: '#e5e7eb' }}>{designData.design_system.navigation_style}</p>
              </div>
              <div>
                <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>COMPONENT STYLE:</span>
                <p style={{ color: '#e5e7eb' }}>{designData.design_system.component_style}</p>
              </div>
            </div>
          </div>

          {/* Mobile UX Direction */}
          <div className="glass-panel" style={{ padding: '20px', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smartphone size={16} color="#ec4899" /> Mobile First UX & Touch Patterns
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>{designData.design_system.mobile_ux}</p>
          </div>
        </div>
      )}
    </div>
  );
}
