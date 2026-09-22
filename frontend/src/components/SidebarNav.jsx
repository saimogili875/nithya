import React from 'react';
import {
  Sparkles,
  Cpu,
  Palette,
  DollarSign,
  Users,
  Code2,
  Globe,
  Rocket,
  Activity,
  FileText,
  UserCheck,
  LayoutDashboard,
  Brain
} from 'lucide-react';

export default function SidebarNav({ activeTab, onSelectTab, onOpenBrain }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'idea', label: 'Phase 1: Idea Engine', icon: <Sparkles size={16} /> },
    { id: 'techstack', label: 'Phase 2: Tech Stack', icon: <Cpu size={16} /> },
    { id: 'design', label: 'Phase 3: UI/UX Design', icon: <Palette size={16} /> },
    { id: 'financial', label: 'Phase 4: Financial Est.', icon: <DollarSign size={16} /> },
    { id: 'competitors', label: 'Phase 5: Competitors', icon: <Users size={16} /> },
    { id: 'build', label: 'Phase 6: Build & Code', icon: <Code2 size={16} /> },
    { id: 'preview', label: 'Live Preview', icon: <Globe size={16} /> },
    { id: 'deploy', label: 'Deploy & Docker', icon: <Rocket size={16} /> },
    { id: 'monitor', label: 'Self-Healing Monitor', icon: <Activity size={16} /> },
    { id: 'documents', label: 'PPT & Docs', icon: <FileText size={16} /> },
    { id: 'support', label: 'Book Developer', icon: <UserCheck size={16} /> },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: '240px',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: '16px'
      }}
    >
      {/* Platform Branding */}
      <div style={{ padding: '8px 12px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1rem', color: '#fff' }}>NITHYA</div>
            <div style={{ fontSize: '0.65rem', color: '#06b6d4', fontWeight: '700' }}>IDEA TO PRODUCTION</div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#06b6d4' : '#9ca3af',
                background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ color: isActive ? '#06b6d4' : '#6b7280' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Project Brain Action */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={onOpenBrain}
          className="btn-secondary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', padding: '10px' }}
        >
          <Brain size={16} color="#06b6d4" /> Project Brain
        </button>
      </div>
    </aside>
  );
}
