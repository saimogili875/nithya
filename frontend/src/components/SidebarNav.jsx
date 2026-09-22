import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Brain,
  Infinity
} from 'lucide-react';

export default function SidebarNav({ onOpenBrain }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { id: 'idea', label: '1. Idea Engine', path: '/idea', icon: <Sparkles size={16} /> },
    { id: 'techstack', label: '2. Tech Stack', path: '/tech-stack', icon: <Cpu size={16} /> },
    { id: 'design', label: '3. UI/UX Design', path: '/design', icon: <Palette size={16} /> },
    { id: 'financial', label: '4. Financials', path: '/financial', icon: <DollarSign size={16} /> },
    { id: 'competitors', label: '5. Competitors', path: '/competitors', icon: <Users size={16} /> },
    { id: 'documents', label: '6. Docs & PPT', path: '/documents', icon: <FileText size={16} /> },
    { id: 'support', label: '7. Human Support', path: '/support', icon: <UserCheck size={16} /> },
    { id: 'prototype', label: 'Live Prototype', path: '/prototype', icon: <Globe size={16} /> },
    { id: 'code', label: 'Code & Sandbox', path: '/code', icon: <Code2 size={16} /> },
    { id: 'deploy', label: 'Docker & Deploy', path: '/deploy', icon: <Rocket size={16} /> },
    { id: 'monitor', label: 'Self-Healing', path: '/monitor', icon: <Activity size={16} /> },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: '230px',
        minWidth: '230px',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        height: 'calc(100vh - 120px)',
        position: 'sticky',
        top: '100px',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        background: 'rgba(10, 12, 20, 0.95)'
      }}
    >
      {/* Sidebar Header */}
      <div style={{ padding: '8px 10px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#f59e0b', letterSpacing: '0.5px' }}>
          NAVIGATION WORKSPACE
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path === '/idea' && currentPath === '/');
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: isActive ? '800' : '500',
                color: isActive ? '#fbbf24' : '#94a3b8',
                background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid transparent',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ color: isActive ? '#f59e0b' : '#64748b' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Project Brain Trigger */}
      <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={onOpenBrain}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            fontSize: '0.78rem', 
            padding: '9px',
            background: 'rgba(245, 158, 11, 0.1)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            fontWeight: '700'
          }}
        >
          <Brain size={15} color="#f59e0b" /> Project Brain
        </button>
      </div>
    </aside>
  );
}

