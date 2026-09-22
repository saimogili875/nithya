import React from 'react';
import InfraStatus from '../components/InfraStatus';
import GoldCard from '../components/ui/GoldCard';
import { Rocket, ExternalLink } from 'lucide-react';

export default function DeployPage({ infra }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <GoldCard active={true} style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Rocket color="#f59e0b" size={24} /> Dockerization & Cloud Deployment Studio
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
          Automated Docker container build, port binding, SSL certificate allocation, and multi-cloud deployment status.
        </p>
      </GoldCard>

      <InfraStatus infra={infra} />

      {infra?.live_url && (
        <GoldCard active={true} style={{ borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🚀 LIVE PRODUCTION DEPLOYMENT ONLINE
          </h3>
          <p style={{ color: '#f8fafc', marginTop: '6px', fontSize: '0.88rem' }}>Container Instance: {infra.container_id || 'active-sandbox'}</p>
          <a href={infra.live_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1rem', fontWeight: '800', color: '#fbbf24', marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {infra.live_url} <ExternalLink size={16} />
          </a>
        </GoldCard>
      )}
    </div>
  );
}
