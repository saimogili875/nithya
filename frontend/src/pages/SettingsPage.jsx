import React from 'react';
import { Brain, Settings, Shield } from 'lucide-react';
import GoldCard from '../components/ui/GoldCard';

export default function SettingsPage({ projectBrain }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <GoldCard active={true} style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain color="#f59e0b" size={24} /> Project Brain & Platform Settings Studio
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
          Persistent project memory, tech stack choices, rules, API secrets management, and environment variables.
        </p>
      </GoldCard>

      <GoldCard title="Persistent Project Brain Context State" badge="Brain v2.0">
        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#fbbf24', background: 'rgba(8, 10, 16, 0.9)', padding: '16px', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          {JSON.stringify(projectBrain || { project_id: 'hackathon-demo-1', status: 'active' }, null, 2)}
        </pre>
      </GoldCard>
    </div>
  );
}
