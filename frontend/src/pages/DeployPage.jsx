import React from 'react';
import InfraStatus from '../components/InfraStatus';

export default function DeployPage({ infra, onDeploy }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(16,185,129,0.1))', borderColor: '#f59e0b' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>Dockerization & Cloud Deployment</h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>Container build, port binding, SSL certificate allocation, and deployment management.</p>
      </div>

      <InfraStatus infra={infra} />

      {infra.live_url && (
        <div className="glass-panel" style={{ padding: '24px', borderColor: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>🚀 YOUR APP IS LIVE IN PRODUCTION</h3>
          <p style={{ color: '#e5e7eb', marginTop: '4px' }}>Container Instance: {infra.container_id || 'active-sandbox'}</p>
          <a href={infra.live_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#06b6d4', marginTop: '8px', display: 'inline-block' }}>
            {infra.live_url}
          </a>
        </div>
      )}
    </div>
  );
}
