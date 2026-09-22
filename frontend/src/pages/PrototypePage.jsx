import React, { useState } from 'react';
import AppPreview from '../components/AppPreview';
import GoldCard from '../components/ui/GoldCard';
import { Globe, Smartphone, Monitor, RefreshCw, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function PrototypePage({ infra }) {
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'mobile'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto', height: 'calc(100vh - 160px)' }}>
      
      {/* Header Banner */}
      <GoldCard active={true} style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gold-badge" style={{ marginBottom: '4px' }}>LIVE PROTOTYPE WORKSPACE</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe color="#f59e0b" size={20} /> Live Application Prototype Studio
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setViewport('desktop')}
              className={viewport === 'desktop' ? 'gold-btn' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={viewport === 'mobile' ? 'gold-btn' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>
        </div>
      </GoldCard>

      {/* Live Prototype Window Container */}
      <div 
        style={{ 
          flex: 1, 
          minHeight: '520px', 
          width: viewport === 'mobile' ? '385px' : '100%',
          margin: viewport === 'mobile' ? '0 auto' : '0',
          transition: 'all 0.3s ease'
        }}
      >
        <AppPreview liveUrl={infra?.live_url} activePort={infra?.active_port} />
      </div>

    </div>
  );
}
