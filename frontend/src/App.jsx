import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SidebarNav from './components/SidebarNav';
import ProjectBrainModal from './components/ProjectBrainModal';

import IdeaPhase from './components/phases/IdeaPhase';
import TechStackPhase from './components/phases/TechStackPhase';
import DesignPhase from './components/phases/DesignPhase';
import FinancialPhase from './components/phases/FinancialPhase';
import CompetitorPhase from './components/phases/CompetitorPhase';
import BuildPhase from './components/phases/BuildPhase';
import DocumentPhase from './components/phases/DocumentPhase';
import SupportPhase from './components/phases/SupportPhase';
import AppPreview from './components/AppPreview';
import InfraStatus from './components/InfraStatus';

const BACKEND_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000';

export default function App() {
  const [projectId, setProjectId] = useState('hackathon-demo-1');
  const [activeTab, setActiveTab] = useState('overview');
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

  useEffect(() => {
    const connectWS = () => {
      const ws = new WebSocket(`${WS_URL}/ws/project/${projectId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('[WS] Connected to Nithya backend orchestrator');
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
    setActiveTab('build');
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
    setActiveTab('build');
    try {
      await fetch(`${BACKEND_URL}/api/project/${projectId}/inject-bug`, { method: 'POST' });
      setTimeout(fetchWorkspaceFiles, 1000);
    } catch (err) {
      console.error('Inject bug error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '16px', minHeight: '100vh', padding: '16px', background: 'var(--bg-primary)' }}>
      {/* Left Navigation Sidebar */}
      <SidebarNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenBrain={fetchBrain}
      />

      {/* Main Workspace Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowX: 'hidden' }}>
        {/* Header Bar */}
        <Header
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          onOpenBrain={fetchBrain}
          isConnected={isConnected}
          onRunDemo={handleRunDemo}
          onInjectBug={handleInjectBug}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <IdeaPhase
            onSubmitIdea={() => setActiveTab('techstack')}
            isAnalyzing={isProcessing}
          />
        )}

        {activeTab === 'idea' && (
          <IdeaPhase
            onSubmitIdea={() => setActiveTab('techstack')}
            isAnalyzing={isProcessing}
          />
        )}

        {activeTab === 'techstack' && (
          <TechStackPhase industry={brainData?.industry || "Tourism & Travel"} />
        )}

        {activeTab === 'design' && (
          <DesignPhase industry={brainData?.industry || "Tourism & Travel"} />
        )}

        {activeTab === 'financial' && (
          <FinancialPhase industry={brainData?.industry || "Tourism & Travel"} />
        )}

        {activeTab === 'competitors' && (
          <CompetitorPhase industry={brainData?.industry || "Tourism & Travel"} />
        )}

        {(activeTab === 'build' || activeTab === 'deploy' || activeTab === 'monitor') && (
          <BuildPhase
            selectedMode={selectedMode}
            onSubmitPrompt={handleSubmitPrompt}
            isProcessing={isProcessing}
            events={events}
            logs={logs}
            files={files}
            infra={infra}
            onClearLogs={() => setLogs([])}
          />
        )}

        {activeTab === 'preview' && (
          <div style={{ height: '700px' }}>
            <AppPreview liveUrl={infra.live_url} activePort={infra.active_port} />
          </div>
        )}

        {activeTab === 'documents' && (
          <DocumentPhase industry={brainData?.industry || "Tourism & Travel"} />
        )}

        {activeTab === 'support' && (
          <SupportPhase />
        )}
      </main>

      {/* Project Brain Inspector Modal */}
      <ProjectBrainModal
        isOpen={isBrainOpen}
        onClose={() => setIsBrainOpen(false)}
        brainData={brainData}
      />
    </div>
  );
}
