import React from 'react';
import CodeDiffViewer from '../components/CodeDiffViewer';
import TerminalLogs from '../components/TerminalLogs';
import ActivityFeed from '../components/ActivityFeed';
import GoldCard from '../components/ui/GoldCard';
import { Code2 } from 'lucide-react';

export default function CodePage({ files, logs, events, onClearLogs }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto' }}>
      <GoldCard active={true} style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 color="#f59e0b" size={20} /> Code Explorer, Sandbox & Test Suite Workspace
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
          Inspect generated fullstack source code, live Git diffs, unit test results, and WebSocket activity logs.
        </p>
      </GoldCard>

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
