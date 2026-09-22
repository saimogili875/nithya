import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import TopNavHeader from './components/TopNavHeader';
import ProjectBrainModal from './components/ProjectBrainModal';

import IdeaPage from './pages/IdeaPage';
import TechStackPage from './pages/TechStackPage';
import DesignPage from './pages/DesignPage';
import FinancialPage from './pages/FinancialPage';
import CompetitorPage from './pages/CompetitorPage';
import DocumentPage from './pages/DocumentPage';
import SupportPage from './pages/SupportPage';
import PrototypePage from './pages/PrototypePage';
import CodePage from './pages/CodePage';
import DeployPage from './pages/DeployPage';
import MonitorPage from './pages/MonitorPage';
import SettingsPage from './pages/SettingsPage';

const BACKEND_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000';

function AppContent() {
  const [projectId, setProjectId] = useState('hackathon-demo-1');
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [files, setFiles] = useState({});
  const [infra, setInfra] = useState({});
  const [brainData, setBrainData] = useState({
    project_id: 'hackathon-demo-1',
    industry: 'Tourism & Travel',
    selected_stack: 'FastAPI + React + PostgreSQL'
  });

  const [isBrainOpen, setIsBrainOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWS = () => {
      const ws = new WebSocket(`${WS_URL}/ws/project/${projectId}`);
      wsRef.current = ws;

      ws.onopen = () => setIsConnected(true);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'activity_event') setEvents((prev) => [payload.data, ...prev]);
          else if (payload.type === 'log_event') setLogs((prev) => [...prev, payload.data]);
          else if (payload.type === 'infra_event') setInfra(payload.data);
        } catch (e) {}
      };
      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWS, 3000);
      };
    };

    connectWS();
    fetchWorkspaceFiles();
    fetchInfra();

    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [projectId]);

  const fetchWorkspaceFiles = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project/${projectId}/files`);
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch (e) {}
  };

  const fetchInfra = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project/${projectId}/infra`);
      const data = await res.json();
      setInfra(data);
    } catch (e) {}
  };

  const fetchBrain = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project/${projectId}/brain`);
      const data = await res.json();
      setBrainData(data);
      setIsBrainOpen(true);
    } catch (e) {
      setIsBrainOpen(true);
    }
  };

  const updateBrain = (updates) => {
    setBrainData((prev) => ({ ...prev, ...updates }));
  };

  const handleInjectBug = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/project/${projectId}/inject-bug`, { method: 'POST' });
      setTimeout(fetchWorkspaceFiles, 1000);
    } catch (e) {}
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 20px', background: '#070913' }}>
      
      {/* Global Top Nav Header with Stepper */}
      <TopNavHeader
        onOpenBrain={fetchBrain}
        brainData={brainData}
      />

      {/* Main SaaS Multi-Page Routes */}
      <main style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
          <Route path="/" element={<IdeaPage projectBrain={brainData} updateBrain={updateBrain} />} />
          <Route path="/idea" element={<IdeaPage projectBrain={brainData} updateBrain={updateBrain} />} />
          <Route path="/tech-stack" element={<TechStackPage projectBrain={brainData} updateBrain={updateBrain} />} />
          <Route path="/design" element={<DesignPage projectBrain={brainData} updateBrain={updateBrain} />} />
          <Route path="/financial" element={<FinancialPage projectBrain={brainData} />} />
          <Route path="/competitors" element={<CompetitorPage projectBrain={brainData} />} />
          <Route path="/documents" element={<DocumentPage projectBrain={brainData} />} />
          <Route path="/support" element={<SupportPage projectBrain={brainData} />} />
          
          <Route path="/prototype" element={<PrototypePage infra={infra} />} />
          <Route path="/code" element={<CodePage files={files} logs={logs} events={events} onClearLogs={() => setLogs([])} />} />
          <Route path="/deploy" element={<DeployPage infra={infra} />} />
          <Route path="/monitor" element={<MonitorPage infra={infra} events={events} onInjectBug={handleInjectBug} />} />
          <Route path="/settings" element={<SettingsPage projectBrain={brainData} />} />
        </Routes>
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

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
