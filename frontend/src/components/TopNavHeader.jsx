import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LalMascot from './LalMascot';
import { Infinity, Check, Code2, Globe, Rocket, Activity, Settings, Brain } from 'lucide-react';

export default function TopNavHeader({ onOpenBrain, brainData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const phases = [
    { num: 1, id: 'idea', label: 'Idea', path: '/idea' },
    { num: 2, id: 'techstack', label: 'Tech Stack', path: '/tech-stack' },
    { num: 3, id: 'design', label: 'Design', path: '/design' },
    { num: 4, id: 'financial', label: 'Cost', path: '/financial' },
    { num: 5, id: 'competitors', label: 'Competitors', path: '/competitors' },
    { num: 6, id: 'documents', label: 'Documents', path: '/documents' },
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
    <header className="glass-panel" style={{ padding: '12px 20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(10, 13, 24, 0.95)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
      {/* Top Navbar Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Brand */}
        <div onClick={() => navigate('/idea')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)' }}>
            <Infinity size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>NITHYA</h1>
              <span style={{ fontSize: '0.62rem', fontWeight: '700', padding: '2px 6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                SAAS PLATFORM
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>From Business Idea to Production Software</p>
          </div>
        </div>

        {/* Engineering Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => navigate('/prototype')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', border: 'none', background: currentPath === '/prototype' ? 'rgba(6,182,212,0.2)' : 'transparent', color: currentPath === '/prototype' ? '#06b6d4' : '#9ca3af' }}
          >
            <Globe size={13} /> Prototype
          </button>
          <button
            onClick={() => navigate('/code')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', border: 'none', background: currentPath === '/code' ? 'rgba(6,182,212,0.2)' : 'transparent', color: currentPath === '/code' ? '#06b6d4' : '#9ca3af' }}
          >
            <Code2 size={13} /> Code & Tests
          </button>
          <button
            onClick={() => navigate('/deploy')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', border: 'none', background: currentPath === '/deploy' ? 'rgba(6,182,212,0.2)' : 'transparent', color: currentPath === '/deploy' ? '#06b6d4' : '#9ca3af' }}
          >
            <Rocket size={13} /> Deploy
          </button>
          <button
            onClick={() => navigate('/monitor')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', border: 'none', background: currentPath === '/monitor' ? 'rgba(6,182,212,0.2)' : 'transparent', color: currentPath === '/monitor' ? '#06b6d4' : '#9ca3af' }}
          >
            <Activity size={13} /> Self-Heal
          </button>
          <button
            onClick={() => navigate('/settings')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', border: 'none', background: currentPath === '/settings' ? 'rgba(6,182,212,0.2)' : 'transparent', color: currentPath === '/settings' ? '#06b6d4' : '#9ca3af' }}
          >
            <Settings size={13} /> Brain
          </button>
        </div>

        {/* LAL Assistant Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onOpenBrain} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '5px 10px' }}>
            <Brain size={14} color="#06b6d4" /> Project Brain
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LalMascot width={40} height={40} />
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ec4899' }}>LAL Assistant</span>
          </div>
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
                  gap: '6px',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.4 : 1
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    background: isCompleted ? '#10b981' : isCurrent ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    boxShadow: isCurrent ? '0 0 10px #06b6d4' : 'none'
                  }}
                >
                  {isCompleted ? <Check size={12} /> : p.num}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: isCurrent ? 'bold' : '500', color: isCurrent ? '#06b6d4' : isCompleted ? '#10b981' : '#9ca3af' }}>
                  {p.label}
                </span>
              </div>
              {idx < phases.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: idx < currentIndex ? '#10b981' : 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </header>
  );
}
