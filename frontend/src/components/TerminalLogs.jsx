import React, { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';

export default function TerminalLogs({ logs = [], onClear }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(5, 7, 12, 0.95)' }}>
      {/* Header Bar */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: '600', marginLeft: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TerminalIcon size={14} color="#06b6d4" /> Sandboxed Terminal & Logs
          </span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}
            title="Clear terminal logs"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Terminal Console Output */}
      <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: '1.6', color: '#38bdf8' }}>
        {logs.length === 0 ? (
          <div style={{ color: '#4b5563' }}>$ Terminal process initialized. Logs will stream live here...</div>
        ) : (
          logs.map((line, idx) => (
            <div key={idx} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {line}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
