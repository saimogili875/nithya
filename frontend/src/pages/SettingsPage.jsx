import React from 'react';
import { Brain, Settings, Shield } from 'lucide-react';

export default function SettingsPage({ projectBrain }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))', borderColor: '#06b6d4' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain color="#06b6d4" /> PROJECT BRAIN & Platform Settings
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>
          Persistent project memory, tech stack choices, rules, API secrets management, and environment variables.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: '12px' }}>Persistent Project Context</h3>
        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38bdf8', background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
          {JSON.stringify(projectBrain || { project_id: 'hackathon-demo-1', status: 'active' }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
