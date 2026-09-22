import React from 'react';
import CodeDiffViewer from '../components/CodeDiffViewer';
import TerminalLogs from '../components/TerminalLogs';
import ActivityFeed from '../components/ActivityFeed';

export default function CodePage({ files, logs, events, onClearLogs }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', borderColor: '#3b82f6' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff' }}>Code Explorer, Sandbox & Test Runner</h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Inspect generated source files, Git diffs, test suite outputs, and AI activity feed.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', minHeight: '620px' }}>
        <div style={{ gridColumn: 'span 4' }}>
          <ActivityFeed events={events} />
        </div>

        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ flex: 1, minHeight: '340px' }}>
            <CodeDiffViewer files={files} />
          </div>
          <div style={{ height: '260px' }}>
            <TerminalLogs logs={logs} onClear={onClearLogs} />
          </div>
        </div>
      </div>
    </div>
  );
}
