import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Loader2, Sparkles, Rocket, ShieldCheck, Wrench } from 'lucide-react';

export default function ActivityFeed({ events = [] }) {
  const getIcon = (status, phase) => {
    if (status === 'in_progress') return <Loader2 size={16} color="#06b6d4" className="spin" />;
    if (status === 'success') {
      if (phase === 'live') return <Rocket size={16} color="#10b981" />;
      if (phase === 'monitor') return <ShieldCheck size={16} color="#10b981" />;
      return <CheckCircle2 size={16} color="#10b981" />;
    }
    if (status === 'warning') return <AlertTriangle size={16} color="#f59e0b" />;
    if (status === 'error') return <XCircle size={16} color="#f43f5e" />;
    if (phase === 'debug' || phase === 'fix') return <Wrench size={16} color="#8b5cf6" />;
    return <Sparkles size={16} color="#06b6d4" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#06b6d4" /> AI Activity Feed
        </h3>
        <span style={{ fontSize: '0.7rem', color: '#9ca3af', padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
          {events.length} Actions Recorded
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.85rem', padding: '30px 0' }}>
            Ready. Waiting for natural language prompt instruction...
          </div>
        ) : (
          events.map((ev, idx) => (
            <div
              key={ev.id || idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: ev.status === 'error' ? 'rgba(244, 63, 94, 0.1)' : ev.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: ev.status === 'error' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {getIcon(ev.status, ev.phase)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '600', color: ev.status === 'error' ? '#f43f5e' : ev.status === 'warning' ? '#f59e0b' : '#f3f4f6' }}>
                    {ev.message}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280', fontFamily: 'monospace' }}>
                    {ev.timestamp}
                  </span>
                </div>
                {ev.details && ev.details.live_url && (
                  <div style={{ marginTop: '4px' }}>
                    <a
                      href={ev.details.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', color: '#06b6d4', textDecoration: 'underline', fontWeight: '600' }}
                    >
                      🔗 Open Live App: {ev.details.live_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
