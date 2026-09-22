import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ActivityFeed from './components/ActivityFeed';
import CodeDiffViewer from './components/CodeDiffViewer';
import TerminalLogs from './components/TerminalLogs';
import AppPreview from './components/AppPreview';
import InfraStatus from './components/InfraStatus';
import ProjectBrainModal from './components/ProjectBrainModal';

const BACKEND_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000';

export default function App() {
  const [projectId, setProjectId] = useState('hackathon-demo-1');
  const [selectedMode, setSelectedMode] = useState('new');
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [files, setFiles] = useState({});
  const [infra, setInfra] = useState({});
  const [brainData, setBrainData] = useState(null);
  const [isBrainOpen, setIsBrainOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const wsRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWS = () => {
      const ws = new WebSocket(`${WS_URL}/ws/project/${projectId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('[WS] Connected to backend orchestrator');
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'activity_event') {
            setEvents((prev) => [payload.data, ...prev]);
          } else if (payload.type === 'log_event') {
            setLogs((prev) => [...prev, payload.data]);
          } else if (payload.type === 'infra_event') {
            setInfra(payload.data);
          }
        } catch (e) {
          console.error('[WS] Message parse error:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWS, 3000);
      };
    };

    connectWS();
    fetchWorkspaceFiles();
    fetchInfra();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [projectId]);

  const fetchWorkspaceFiles = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project/${projectId}/files`);
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch (e) {
      console.error('Error fetching files:', e);
    }
  };

  const fetchInfra = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project/${projectId}/infra`);
      const data = await res.json();
      setInfra(data);
    } catch (e) {
      console.error('Error fetching infra:', e);
    }
  };

  const fetchBrain = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project/${projectId}/brain`);
      const data = await res.json();
      setBrainData(data);
      setIsBrainOpen(true);
    } catch (e) {
      console.error('Error fetching brain:', e);
    }
  };

  const handleSubmitPrompt = async (promptData) => {
    setIsProcessing(true);
    setEvents([]);
    setLogs([]);
    try {
      await fetch(`${BACKEND_URL}/api/project/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...promptData, project_id: projectId })
      });
      // Refresh workspace files after delay
      setTimeout(fetchWorkspaceFiles, 2000);
      setTimeout(fetchWorkspaceFiles, 5000);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  const handleRunDemo = async () => {
    setIsProcessing(true);
    setEvents([]);
    setLogs([]);
    try {
      await fetch(`${BACKEND_URL}/api/demo/run-quick-demo`);
      setTimeout(fetchWorkspaceFiles, 2000);
      setTimeout(fetchWorkspaceFiles, 5000);
    } catch (err) {
      console.error('Demo error:', err);
    } finally {
      setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  const handleInjectBug = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/project/${projectId}/inject-bug`, { method: 'POST' });
      setTimeout(fetchWorkspaceFiles, 1000);
    } catch (err) {
      console.error('Inject bug error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '16px' }}>
      {/* Platform Header */}
      <Header
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        onOpenBrain={fetchBrain}
        isConnected={isConnected}
        onRunDemo={handleRunDemo}
        onInjectBug={handleInjectBug}
      />

      {/* Prompt Bar */}
      <PromptInput
        selectedMode={selectedMode}
        onSubmitPrompt={handleSubmitPrompt}
        isProcessing={isProcessing}
      />

      {/* Infrastructure Status Panel */}
      <div style={{ marginBottom: '16px' }}>
        <InfraStatus infra={infra} />
      </div>

      {/* Main Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', minHeight: '680px' }}>
        {/* Left Column: Activity Feed (4 cols) */}
        <div style={{ gridColumn: 'span 4' }}>
          <ActivityFeed events={events} />
        </div>

        {/* Center Column: Code/Diff & Terminal (5 cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ flex: 1, minHeight: '340px' }}>
            <CodeDiffViewer files={files} />
          </div>
          <div style={{ height: '300px' }}>
            <TerminalLogs logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>

        {/* Right Column: Live App Preview (3 cols) */}
        <div style={{ gridColumn: 'span 3' }}>
          <AppPreview liveUrl={infra.live_url} activePort={infra.active_port} />
        </div>
      </div>

      {/* Project Brain Modal */}
      <ProjectBrainModal
        isOpen={isBrainOpen}
        onClose={() => setIsBrainOpen(false)}
        brainData={brainData}
      />
    </div>
  );
}
