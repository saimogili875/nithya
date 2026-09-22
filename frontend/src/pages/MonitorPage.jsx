import React from 'react';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import ActivityFeed from '../components/ActivityFeed';
import GoldCard from '../components/ui/GoldCard';

export default function MonitorPage({ infra, events, onInjectBug }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <GoldCard active={true} style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity color="#f59e0b" size={24} /> 24/7 Production Health Monitor & Self-Healing Loop
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
          Probes live application health endpoints continuously. Automatically detects HTTP 500 errors, triggers LAL AI auto-debugging, applies source code patches, passes test suite, and redeploys container automatically.
        </p>
      </GoldCard>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={onInjectBug}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: '800',
            border: 'none',
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.4)'
          }}
        >
          <ShieldAlert size={18} /> Inject Production Bug (Simulate HTTP 500 Failure)
        </button>
      </div>

      <div style={{ height: '520px' }}>
        <ActivityFeed events={events} />
      </div>
    </div>
  );
}
