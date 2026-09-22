import React from 'react';
import { Cpu, Terminal, GitBranch, FolderCheck, Sparkles, Brain, ShieldAlert } from 'lucide-react';

export default function Header({ selectedMode, onSelectMode, onOpenBrain, isConnected, onRunDemo, onInjectBug }) {
  return (
    <header className="glass-panel" style={{ padding: '14px 24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      {/* Brand & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)' }}>
          <Cpu size={24} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Developer Platform
            </h1>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
              PROMPT TO PRODUCTION
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>I tell the AI what I want. The AI handles the engineering.</p>
        </div>
      </div>

      {/* Project Mode Selector Tabs */}
      <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => onSelectMode('new')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', border: 'none',
            background: selectedMode === 'new' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
            color: selectedMode === 'new' ? '#fff' : '#9ca3af'
          }}
        >
          <Sparkles size={14} /> Mode A: New Project
        </button>
        <button
          onClick={() => onSelectMode('local')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', border: 'none',
            background: selectedMode === 'local' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
            color: selectedMode === 'local' ? '#fff' : '#9ca3af'
          }}
        >
          <FolderCheck size={14} /> Mode B: Local Project
        </button>
        <button
          onClick={() => onSelectMode('github')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', border: 'none',
            background: selectedMode === 'github' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
            color: selectedMode === 'github' ? '#fff' : '#9ca3af'
          }}
        >
          <GitBranch size={14} /> Mode C: GitHub Project
        </button>
      </div>

      {/* Quick Action Bar for Hackathon Demos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onOpenBrain}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
          title="Inspect Project Brain Context"
        >
          <Brain size={15} color="#06b6d4" /> Project Brain
        </button>

        <button
          onClick={onInjectBug}
          className="btn-danger"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
          title="Inject a 500 error into production app to demonstrate autonomous self-healing!"
        >
          <ShieldAlert size={15} /> Simulate Prod Bug
        </button>

        <button
          onClick={onRunDemo}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
        >
          <Sparkles size={15} /> 1-Min Hackathon Demo
        </button>

        {/* Connection Pulse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className={`status-dot ${isConnected ? 'green' : 'red'}`} />
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{isConnected ? 'Live WS' : 'Connecting'}</span>
        </div>
      </div>
    </header>
  );
}
