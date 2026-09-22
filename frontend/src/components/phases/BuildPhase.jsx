import React from 'react';
import PromptInput from '../PromptInput';
import ActivityFeed from '../ActivityFeed';
import CodeDiffViewer from '../CodeDiffViewer';
import TerminalLogs from '../TerminalLogs';
import AppPreview from '../AppPreview';
import InfraStatus from '../InfraStatus';

export default function BuildPhase({
  selectedMode,
  onSubmitPrompt,
  isProcessing,
  events,
  logs,
  files,
  infra,
  onClearLogs
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Prompt Bar */}
      <PromptInput
        selectedMode={selectedMode}
        onSubmitPrompt={onSubmitPrompt}
        isProcessing={isProcessing}
      />

      {/* Infrastructure Status Grid */}
      <InfraStatus infra={infra} />

      {/* Main Grid Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', minHeight: '640px' }}>
        {/* Left: Activity Feed (4 cols) */}
        <div style={{ gridColumn: 'span 4' }}>
          <ActivityFeed events={events} />
        </div>

        {/* Center: Code Viewer & Terminal (5 cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ flex: 1, minHeight: '340px' }}>
            <CodeDiffViewer files={files} />
          </div>
          <div style={{ height: '280px' }}>
            <TerminalLogs logs={logs} onClear={onClearLogs} />
          </div>
        </div>

        {/* Right: Live App Preview (3 cols) */}
        <div style={{ gridColumn: 'span 3' }}>
          <AppPreview liveUrl={infra.live_url} activePort={infra.active_port} />
        </div>
      </div>
    </div>
  );
}
