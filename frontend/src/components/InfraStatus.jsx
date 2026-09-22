import React from 'react';
import { Server, Box, Database, HardDrive, ShieldCheck, Activity, Globe, Lock } from 'lucide-react';

export default function InfraStatus({ infra = {} }) {
  const items = [
    { key: 'application', label: 'Application', icon: <Server size={14} /> },
    { key: 'docker', label: 'Docker Container', icon: <Box size={14} /> },
    { key: 'server', label: 'Server / Host', icon: <Server size={14} /> },
    { key: 'database', label: 'Database', icon: <Database size={14} /> },
    { key: 'storage', label: 'Storage', icon: <HardDrive size={14} /> },
    { key: 'deployment', label: 'Deployment', icon: <ShieldCheck size={14} /> },
    { key: 'ssl', label: 'SSL Certificate', icon: <Lock size={14} /> },
    { key: 'domain', label: 'Domain', icon: <Globe size={14} /> },
    { key: 'monitoring', label: 'Monitoring', icon: <Activity size={14} /> },
  ];

  return (
    <div className="glass-panel" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} color="#06b6d4" /> Infrastructure Health Status
        </h3>
        {infra.container_id && (
          <span style={{ fontSize: '0.7rem', color: '#10b981', fontFamily: 'monospace' }}>
            ID: {infra.container_id}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        {items.map((it) => {
          const state = infra[it.key] || 'off';
          return (
            <div
              key={it.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '8px 10px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '0.78rem' }}>
                {it.icon}
                <span>{it.label}</span>
              </div>
              <span className={`status-dot ${state}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
