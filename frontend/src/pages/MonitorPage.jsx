import React from 'react';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import ActivityFeed from '../components/ActivityFeed';

export default function MonitorPage({ infra, events, onInjectBug }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(6,182,212,0.1))', borderColor: '#f43f5e' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity color="#f43f5e" /> 24/7 Production Health Monitor & Self-Healing Loop
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>
          Continuously probes live application endpoint (`/health`). Automatically triggers AI investigation, patch generation, test suite validation, and container redeployment upon HTTP 500 incidents.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={onInjectBug}
          className="btn-danger"
          style={{ padding: '12px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ShieldAlert size={18} /> Inject Production Bug (Simulate HTTP 500)
        </button>
      </div>

      <div style={{ height: '500px' }}>
        <ActivityFeed events={events} />
      </div>
    </div>
  );
}
