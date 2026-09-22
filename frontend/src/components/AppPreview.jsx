import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Play, Globe, CheckCircle2 } from 'lucide-react';

export default function AppPreview({ liveUrl, activePort }) {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestEndpoint = async (path) => {
    if (!liveUrl) return;
    setLoading(true);
    try {
      const res = await fetch(`${liveUrl.replace(/\/$/, '')}${path}`);
      const data = await res.json();
      setTestResult({ path, status: res.status, data });
    } catch (err) {
      setTestResult({ path, status: 500, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={16} color="#10b981" />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f3f4f6' }}>Application Preview</span>
          {liveUrl && (
            <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)' }}>
              LIVE Port {activePort || 8000}
            </span>
          )}
        </div>

        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Open App <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        {!liveUrl ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6b7280', padding: '20px' }}>
            <Globe size={36} color="#374151" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '0.9rem' }}>No active container deployment yet.</p>
            <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>Run a prompt to launch your application automatically.</p>
          </div>
        ) : (
          <>
            {/* Quick Test Toolbar */}
            <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Test Endpoints:</span>
              <button
                onClick={() => handleTestEndpoint('/health')}
                disabled={loading}
                style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#06b6d4', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer' }}
              >
                GET /health
              </button>
              <button
                onClick={() => handleTestEndpoint('/api/weather')}
                disabled={loading}
                style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#06b6d4', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer' }}
              >
                GET /api/weather
              </button>
            </div>

            {/* Test Result Inspector if triggered */}
            {testResult && (
              <div style={{ padding: '10px 14px', background: testResult.status === 200 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 'bold', color: testResult.status === 200 ? '#10b981' : '#f43f5e' }}>
                  <span>Endpoint {testResult.path}</span>
                  <span>HTTP {testResult.status}</span>
                </div>
                <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#e5e7eb' }}>
                  {JSON.stringify(testResult.data || testResult.error, null, 2)}
                </pre>
              </div>
            )}

            {/* Application Preview iframe */}
            <iframe
              src={liveUrl}
              title="Live Application Preview"
              style={{ flex: 1, width: '100%', border: 'none', background: '#ffffff' }}
            />
          </>
        )}
      </div>
    </div>
  );
}
