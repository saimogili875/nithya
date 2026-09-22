import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LalMascot from './LalMascot';
import { Infinity, Check, Code2, Globe, Rocket, Activity, Settings, Brain, Sparkles } from 'lucide-react';

export default function TopNavHeader({ onOpenBrain, brainData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const phases = [
    { num: 1, id: 'idea', label: 'Idea Engine', path: '/idea' },
    { num: 2, id: 'techstack', label: 'Tech Stack', path: '/tech-stack' },
    { num: 3, id: 'design', label: 'UI/UX Design', path: '/design' },
    { num: 4, id: 'financial', label: 'Financials', path: '/financial' },
    { num: 5, id: 'competitors', label: 'Competitors', path: '/competitors' },
    { num: 6, id: 'documents', label: 'Docs & PPT', path: '/documents' },
    { num: 7, id: 'support', label: 'Human Support', path: '/support' },
  ];

  const getPhaseIndex = (path) => {
    if (path === '/' || path === '/idea') return 0;
    if (path === '/tech-stack') return 1;
    if (path === '/design') return 2;
    if (path === '/financial') return 3;
    if (path === '/competitors') return 4;
    if (path === '/documents') return 5;
    if (path === '/support') return 6;
    return 7;
  };

  const currentIndex = getPhaseIndex(currentPath);

  return (
    <header 
      className="glass-panel" 
      style={{ 
        padding: '12px 20px', 
        marginBottom: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        background: 'rgba(10, 12, 20, 0.95)', 
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(245, 158, 11, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Gold Animated Header Line */}
      <div className="gold-animated-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

      {/* Top Navbar Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Brand */}
        <div onClick={() => navigate('/idea')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>
            <Infinity size={24} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f8fafc', letterSpacing: '-0.5px' }}>NITHYA</h1>
              <span className="gold-badge">
                AI PLATFORM
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>From Business Idea to Production Software</p>
          </div>
        </div>

        {/* Engineering Quick Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => navigate('/prototype')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', border: 'none', background: currentPath === '/prototype' ? 'rgba(245, 158, 11, 0.2)' : 'transparent', color: currentPath === '/prototype' ? '#fbbf24' : '#94a3b8' }}
          >
            <Globe size={13} /> Live Prototype
          </button>
          <button
            onClick={() => navigate('/code')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', border: 'none', background: currentPath === '/code' ? 'rgba(245, 158, 11, 0.2)' : 'transparent', color: currentPath === '/code' ? '#fbbf24' : '#94a3b8' }}
          >
            <Code2 size={13} /> Code & Tests
          </button>
          <button
            onClick={() => navigate('/deploy')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', border: 'none', background: currentPath === '/deploy' ? 'rgba(245, 158, 11, 0.2)' : 'transparent', color: currentPath === '/deploy' ? '#fbbf24' : '#94a3b8' }}
          >
            <Rocket size={13} /> Deploy
          </button>
          <button
            onClick={() => navigate('/monitor')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', border: 'none', background: currentPath === '/monitor' ? 'rgba(245, 158, 11, 0.2)' : 'transparent', color: currentPath === '/monitor' ? '#fbbf24' : '#94a3b8' }}
          >
            <Activity size={13} /> Self-Heal
          </button>
        </div>

        {/* Project Brain Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onOpenBrain} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.78rem', 
              padding: '6px 14px', 
              borderRadius: '8px', 
              background: 'rgba(245, 158, 11, 0.12)', 
              color: '#fbbf24', 
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: '700'
            }}
          >
            <Brain size={15} color="#f59e0b" /> Project Brain
          </button>
        </div>
      </div>

      {/* Sequential Phase Progress Stepper Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
        {phases.map((p, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isLocked = idx > currentIndex;

          return (
            <React.Fragment key={p.id}>
              <div
                onClick={() => { if (!isLocked) navigate(p.path); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.45 : 1
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    background: isCompleted ? '#10b981' : isCurrent ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.1)',
                    color: isCurrent ? '#000' : '#fff',
                    boxShadow: isCurrent ? '0 0 12px rgba(245, 158, 11, 0.6)' : 'none'
                  }}
                >
                  {isCompleted ? <Check size={14} color="#fff" /> : p.num}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: isCurrent ? '800' : '500', color: isCurrent ? '#fbbf24' : isCompleted ? '#10b981' : '#94a3b8' }}>
                  {p.label}
                </span>
              </div>
              {idx < phases.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: idx < currentIndex ? '#10b981' : 'rgba(255,255,255,0.1)', margin: '0 10px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </header>
  );
}

