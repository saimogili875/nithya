import React from 'react';
import AppPreview from '../components/AppPreview';

export default function PrototypePage({ infra }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1400px', margin: '0 auto', height: 'calc(100vh - 180px)' }}>
      <div className="glass-panel" style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(16,185,129,0.1))', borderColor: '#06b6d4' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff' }}>Interactive Application Prototype Preview</h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Test your live deployed application prototype in real-time.</p>
      </div>

      <div style={{ flex: 1, minHeight: '550px' }}>
        <AppPreview liveUrl={infra.live_url} activePort={infra.active_port} />
      </div>
    </div>
  );
}
