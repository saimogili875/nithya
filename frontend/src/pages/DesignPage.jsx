import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, ArrowRight, ArrowLeft, Loader2, Smartphone, Layout, CheckCircle2, Layers } from 'lucide-react';

export default function DesignPage({ projectBrain, updateBrain }) {
  const navigate = useNavigate();

  const selectedStack = projectBrain?.selected_stack || 'FastAPI + React + PostgreSQL';
  const [stylePreference, setStylePreference] = useState('Modern Glassmorphic');
  const [mobileFirst, setMobileFirst] = useState('Yes');
  const [accessibility, setAccessibility] = useState('WCAG AA Compliant');

  const [isGenerating, setIsGenerating] = useState(false);
  const [designData, setDesignData] = useState(null);

  useEffect(() => {
    handleGenerateDesign();
  }, []);

  const handleGenerateDesign = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/api/projects/design/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'hackathon-demo-1',
          industry: projectBrain?.industry || 'Tourism & Travel',
          style_preference: stylePreference
        })
      });
      const data = await res.json();
      setDesignData(data);
      if (updateBrain) updateBrain({ design_system: data.design_system });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))', borderColor: '#8b5cf6' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Palette color="#8b5cf6" /> Phase 3: UI/UX Design Engine
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>
          Generating design system for selected architecture: <strong style={{ color: '#8b5cf6' }}>{selectedStack}</strong>.
        </p>
      </div>

      {isGenerating && (
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', borderColor: '#8b5cf6' }}>
          <Loader2 size={36} color="#8b5cf6" className="spin" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>Synthesizing original design system...</h3>
        </div>
      )}

      {designData && !isGenerating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {/* Color Palette Panel */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={18} color="#06b6d4" /> Curated Color Palette
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

            {/* Typography & Layout */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layout size={18} color="#8b5cf6" /> System Architecture & Typography
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div><span style={{ color: '#06b6d4', fontWeight: 'bold' }}>TYPOGRAPHY:</span> <p style={{ color: '#e5e7eb' }}>{designData.design_system.typography}</p></div>
                <div><span style={{ color: '#06b6d4', fontWeight: 'bold' }}>NAVIGATION STYLE:</span> <p style={{ color: '#e5e7eb' }}>{designData.design_system.navigation_style}</p></div>
                <div><span style={{ color: '#06b6d4', fontWeight: 'bold' }}>COMPONENT STYLE:</span> <p style={{ color: '#e5e7eb' }}>{designData.design_system.component_style}</p></div>
              </div>
            </div>
          </div>

          {/* Mobile UX Direction */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="#ec4899" /> Mobile First & Responsive UX
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{designData.design_system.mobile_ux}</p>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button onClick={() => navigate('/tech-stack')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Back to Tech Stack
            </button>
            <button onClick={() => navigate('/financial')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
              Continue to Cost Estimation → <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
