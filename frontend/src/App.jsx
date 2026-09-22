import React, { useState, useEffect, useRef } from 'react';
import LalMascot from './components/LalMascot';
import SidebarNav from './components/SidebarNav';
import ProjectBrainModal from './components/ProjectBrainModal';
import CodeDiffViewer from './components/CodeDiffViewer';
import TerminalLogs from './components/TerminalLogs';
import AppPreview from './components/AppPreview';
import ActivityFeed from './components/ActivityFeed';
import InfraStatus from './components/InfraStatus';

import IdeaPhase from './components/phases/IdeaPhase';
import TechStackPhase from './components/phases/TechStackPhase';
import DesignPhase from './components/phases/DesignPhase';
import FinancialPhase from './components/phases/FinancialPhase';
import CompetitorPhase from './components/phases/CompetitorPhase';
import BuildPhase from './components/phases/BuildPhase';
import DocumentPhase from './components/phases/DocumentPhase';
import SupportPhase from './components/phases/SupportPhase';

import {
  Infinity, Send, ArrowRight, CheckCircle2, Cpu, Globe, Rocket, Activity,
  AlertTriangle, ShieldCheck, Wrench, RefreshCw, FileText, Smartphone,
  Database, Server, HardDrive, Lock, ChevronRight, Layers, FileCode, Check,
  Bot, Award, DollarSign, Users, ExternalLink, Calendar, HelpCircle, X,
  LayoutGrid, Sidebar as SidebarIcon
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000';

export default function App() {
  const [projectId, setProjectId] = useState('hackathon-demo-1');
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' for full 7-phase dashboard, or 'idea', 'techstack', etc.
  const [selectedIndustry, setSelectedIndustry] = useState('Tourism & Travel');
  const [selectedTemplate, setSelectedTemplate] = useState('Hackathon Presentation');
  const [selectedCostScale, setSelectedCostScale] = useState('medium');
  const [promptInput, setPromptInput] = useState('I want to build a tourism platform for Hyderabad offering local trips and health checks...');
  const [showSidebar, setShowSidebar] = useState(true);

  // Active Workspace / Code Inspector Modal state
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState('code');

  // Backend real-time state
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

      ws.onopen = () => setIsConnected(true);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'activity_event') setEvents((prev) => [payload.data, ...prev]);
          else if (payload.type === 'log_event') setLogs((prev) => [...prev, payload.data]);
          else if (payload.type === 'infra_event') setInfra(payload.data);
        } catch (e) { console.error(e); }
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
    } catch (e) {}
  };

  const handleExecutePrompt = async (customPrompt) => {
    const p = customPrompt || promptInput;
    setIsProcessing(true);
    setEvents([]);
    setLogs([]);
    setShowWorkspaceModal(true);
    setWorkspaceTab('feed');

    try {
      await fetch(`${BACKEND_URL}/api/project/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: p,
          mode: 'new',
          industry: selectedIndustry,
          project_id: projectId
        })
      });
      setTimeout(fetchWorkspaceFiles, 2000);
      setTimeout(fetchWorkspaceFiles, 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  const handleRunQuickDemo = async () => {
    setIsProcessing(true);
    setEvents([]);
    setLogs([]);
    setShowWorkspaceModal(true);
    setWorkspaceTab('feed');
    try {
      await fetch(`${BACKEND_URL}/api/demo/run-quick-demo`);
      setTimeout(fetchWorkspaceFiles, 2000);
      setTimeout(fetchWorkspaceFiles, 5000);
    } catch (e) {} finally {
      setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  const handleInjectBug = async () => {
    setShowWorkspaceModal(true);
    setWorkspaceTab('feed');
    try {
      await fetch(`${BACKEND_URL}/api/project/${projectId}/inject-bug`, { method: 'POST' });
      setTimeout(fetchWorkspaceFiles, 1000);
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070913', width: '100%' }}>
      
      {/* ========================================================================= */}
      {/* ALWAYS VISIBLE LEFT SIDEBAR NAVIGATION WITH ALL OPTIONS */}
      {/* ========================================================================= */}
      {showSidebar && (
        <div style={{ width: '250px', flexShrink: 0, padding: '16px 12px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          <SidebarNav
            activeTab={activeTab === 'grid' ? 'overview' : activeTab}
            onSelectTab={(tabId) => {
              if (tabId === 'overview') setActiveTab('grid');
              else setActiveTab(tabId);
            }}
            onOpenBrain={fetchBrain}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE VIEW AREA */}
      {/* ========================================================================= */}
      <main style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowX: 'auto', minWidth: 0 }}>
        
        {/* TOP HEADER */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Left Branding & Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px', color: '#06b6d4' }}
              title="Toggle Left Navigation Options"
            >
              <SidebarIcon size={20} />
            </button>

            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Infinity size={24} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff' }}>NITHYA</h1>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                  AI PLATFORM
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#6b7280' }}>From Business Idea to Production Software</p>
            </div>
          </div>

          {/* View Switcher Pills */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => setActiveTab('grid')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', border: 'none',
                background: activeTab === 'grid' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                color: activeTab === 'grid' ? '#fff' : '#9ca3af'
              }}
            >
              <LayoutGrid size={15} /> 7-Phase Grid View
            </button>
            <button
              onClick={() => setActiveTab('build')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', border: 'none',
                background: activeTab === 'build' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                color: activeTab === 'build' ? '#fff' : '#9ca3af'
              }}
            >
              <FileCode size={15} /> Code Workspace View
            </button>
          </div>

          {/* Right Mascot Box & Speech Bubble */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(30, 27, 75, 0.8)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '12px', padding: '8px 12px', maxWidth: '190px', fontSize: '0.72rem' }}>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>Hi! I'm <span style={{ color: '#ec4899' }}>LAL</span></div>
              <div style={{ color: '#9ca3af', fontSize: '0.68rem', marginTop: '1px' }}>Your AI Business & Dev Assistant!</div>
            </div>
            <LalMascot width={54} height={54} />
          </div>
        </header>

        {/* Dynamic Main Workspace Tabs */}
        {activeTab === 'grid' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Horizontal 7-Phase Grid */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
              
              {/* Column 1: Phase 1 */}
              <div className="phase-column phase-1-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="num-badge" style={{ background: '#3b82f6' }}>1</div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>Idea / Prompt Engine</h3>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Start your journey — any way you want.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.7rem' }}>
                    <FileText size={13} color="#3b82f6" /> New Project from Scratch
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', fontSize: '0.7rem' }}>
                    <Globe size={13} color="#06b6d4" /> Existing Project (Cloud / Local)
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', fontSize: '0.7rem' }}>
                    <FileCode size={13} color="#8b5cf6" /> GitHub Repository
                  </button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: '#3b82f6', fontWeight: 'bold', marginBottom: '3px' }}>
                    <Bot size={12} /> Ask LAL
                  </div>
                  <textarea
                    rows={2}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.72rem', outline: 'none', resize: 'none' }}
                  />
                  <button
                    onClick={() => handleExecutePrompt()}
                    style={{ width: '100%', padding: '5px', borderRadius: '5px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '4px' }}
                  >
                    Start Building →
                  </button>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}>Select Industry</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                    {['Tourism & Travel', 'AgriTech', 'HealthTech', 'EdTech', 'FinTech', 'E-Commerce'].map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setSelectedIndustry(ind)}
                        style={{
                          padding: '5px 2px', borderRadius: '4px', fontSize: '0.62rem', fontWeight: '600',
                          border: selectedIndustry === ind ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)',
                          background: selectedIndustry === ind ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.02)',
                          color: selectedIndustry === ind ? '#3b82f6' : '#9ca3af', textAlign: 'center'
                        }}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: '0.68rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>✓ AI analyzes your idea</div>
                  <div>✓ Finds relevant competitors</div>
                  <div>✓ Understands requirements</div>
                  <div>✓ Identifies opportunities</div>
                </div>

                <button onClick={() => handleExecutePrompt()} style={{ padding: '7px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  Continue to Research →
                </button>
              </div>

              {/* Column 2: Phase 2 */}
              <div className="phase-column phase-2-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="num-badge" style={{ background: '#10b981' }}>2</div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>Tech Stack Engine</h3>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Get the best tech options.</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.65rem' }}>
                  <div><span style={{ color: '#6b7280' }}>Users:</span> <span style={{ color: '#fff', fontWeight: 'bold' }}>~ 1,000</span></div>
                  <div><span style={{ color: '#6b7280' }}>Budget:</span> <span style={{ color: '#fff', fontWeight: 'bold' }}>Medium</span></div>
                  <div><span style={{ color: '#6b7280' }}>Real-time?:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>Yes</span></div>
                  <div><span style={{ color: '#6b7280' }}>Mobile App?:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>Yes</span></div>
                </div>

                <button style={{ padding: '5px', borderRadius: '5px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  Generate Options
                </button>

                <div style={{ fontSize: '0.65rem', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ padding: '3px 5px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>1 Django + React + PostgreSQL</div>
                  <div style={{ padding: '3px 5px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>2 Next.js + Node.js + PostgreSQL</div>
                  <div style={{ padding: '3px 5px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', fontWeight: 'bold' }}>4 FastAPI + React + PostgreSQL</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '6px', fontSize: '0.65rem', color: '#9ca3af' }}>
                  <div style={{ color: '#10b981', fontWeight: 'bold' }}>🏆 Top 3 Recommendations</div>
                  <div>✓ Why it fits your project</div>
                  <div>✓ Advantages & trade-offs</div>
                </div>

                <button style={{ padding: '7px', borderRadius: '6px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  Detailed Comparison →
                </button>
              </div>

              {/* Column 3: Phase 3 */}
              <div className="phase-column phase-3-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="num-badge" style={{ background: '#8b5cf6' }}>3</div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>UI/UX Design Engine</h3>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Designs before development.</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#fff' }}>Explore Hyderabad</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b5cf6' }}>Like Never Before</div>
                  <p style={{ fontSize: '0.58rem', color: '#9ca3af', marginTop: '2px' }}>Discover local experiences and trips.</p>
                  <button style={{ marginTop: '4px', padding: '3px 6px', borderRadius: '4px', background: '#8b5cf6', color: '#fff', border: 'none', fontSize: '0.6rem', fontWeight: 'bold' }}>Explore Trips</button>
                </div>

                <div style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>✓ Color Palette (Pink, Cyan, Blue)</div>
                  <div>Aa Typography (Inter & Fira Code)</div>
                  <div>[ Components ] Buttons, Cards, Inputs</div>
                </div>

                <button style={{ padding: '7px', borderRadius: '6px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  Generate UI Prototype →
                </button>
              </div>

              {/* Column 4: Phase 4 */}
              <div className="phase-column phase-4-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="num-badge" style={{ background: '#f59e0b' }}>4</div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>Financial / Infra Engine</h3>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Estimated costs before live.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2px' }}>
                  {['small', 'medium', 'large'].map((sc) => (
                    <button key={sc} onClick={() => setSelectedCostScale(sc)} style={{ flex: 1, padding: '3px', borderRadius: '3px', fontSize: '0.6rem', fontWeight: 'bold', border: selectedCostScale === sc ? '1px solid #f59e0b' : 'none', background: selectedCostScale === sc ? 'rgba(245, 158, 11, 0.25)' : 'transparent', color: selectedCostScale === sc ? '#f59e0b' : '#9ca3af' }}>
                      {sc.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Server (Cloud)</span><span style={{ color: '#fff' }}>$20 - $50</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Database</span><span style={{ color: '#fff' }}>$10 - $30</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>AI APIs</span><span style={{ color: '#fff' }}>$20 - $100</span></div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#9ca3af' }}>Estimated Total</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#f59e0b' }}>$97 - $340 / month</div>
                </div>

                <button style={{ padding: '7px', borderRadius: '6px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  View Cost Breakdown →
                </button>
              </div>

              {/* Column 5: Phase 5 */}
              <div className="phase-column phase-5-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="num-badge" style={{ background: '#f43f5e' }}>5</div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>Competitor Intelligence</h3>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Market analysis & insights.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.65rem' }}>
                  {['MakeMyTrip', 'Yatra', 'Goibibo', 'Cleartrip'].map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 5px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', color: '#fff' }}>
                      <span>{c}</span>
                      <span style={{ color: '#f43f5e', fontSize: '0.6rem' }}>📊 Signal</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div><span style={{ color: '#f43f5e' }}>Customer View:</span> Reviews & UX</div>
                  <div><span style={{ color: '#f43f5e' }}>Business View:</span> Monetization gaps</div>
                </div>

                <button style={{ padding: '7px', borderRadius: '6px', background: 'linear-gradient(135deg, #f43f5e, #be123c)', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  View Full Analysis →
                </button>
              </div>

              {/* Column 6: Phase 6 */}
              <div className="phase-column phase-6-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="num-badge" style={{ background: '#06b6d4' }}>6</div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>PPT & Document Engine</h3>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Turn ideas into decks.</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid #06b6d4', borderRadius: '6px', padding: '5px', textAlign: 'center', fontSize: '0.65rem', color: '#06b6d4', fontWeight: 'bold' }}>
                  13 Industries × 10 Types = 130 Decks
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.62rem' }}>
                  {['Investor Pitch', 'Hackathon Presentation', 'Business Proposal'].map((t) => (
                    <div key={t} onClick={() => setSelectedTemplate(t)} style={{ padding: '3px 5px', borderRadius: '3px', cursor: 'pointer', background: selectedTemplate === t ? 'rgba(6, 182, 212, 0.25)' : 'transparent', color: selectedTemplate === t ? '#06b6d4' : '#9ca3af' }}>
                      {t} {selectedTemplate === t && '✓'}
                    </div>
                  ))}
                </div>

                <button style={{ padding: '7px', borderRadius: '6px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  Generate with AI →
                </button>
              </div>

              {/* Column 7: Phase 7 */}
              <div className="phase-column phase-7-glow">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="num-badge" style={{ background: '#d946ef' }}>7</div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>Human Support</h3>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Expert help when needed.</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(217, 70, 239, 0.15)', border: '1px solid #d946ef', borderRadius: '6px', padding: '6px', fontSize: '0.65rem' }}>
                  <div style={{ color: '#d946ef', fontWeight: 'bold' }}>Book a Developer</div>
                  <div style={{ color: '#9ca3af', marginTop: '1px' }}>1-hour guided session.</div>
                  <button style={{ marginTop: '4px', width: '100%', padding: '3px', borderRadius: '3px', background: '#d946ef', color: '#fff', border: 'none', fontSize: '0.6rem', fontWeight: 'bold' }}>
                    Schedule Session →
                  </button>
                </div>

                <div style={{ fontSize: '0.62rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div>• API Keys & Integrations</div>
                  <div>• WhatsApp / Razorpay</div>
                  <div>• Domain & DNS Setup</div>
                </div>
              </div>

            </div>

            {/* Bottom Execution Bar */}
            <div className="glass-panel" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => handleExecutePrompt()} style={{ padding: '6px 12px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileCode size={14} /> Generate Code
                </button>
                <span style={{ color: '#6b7280' }}>→</span>

                <button onClick={() => handleExecutePrompt()} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem', fontWeight: '600' }}>
                  Test in Sandbox
                </button>
                <span style={{ color: '#6b7280' }}>→</span>

                <button onClick={() => { setShowWorkspaceModal(true); setWorkspaceTab('preview'); }} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem', fontWeight: '600' }}>
                  Preview App
                </button>
                <span style={{ color: '#6b7280' }}>→</span>

                <button onClick={() => handleRunQuickDemo()} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem', fontWeight: '600' }}>
                  Deploy to Cloud
                </button>
                <span style={{ color: '#6b7280' }}>→</span>

                <button onClick={handleInjectBug} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Inject Bug & Self-Heal
                </button>
              </div>

              <button onClick={handleRunQuickDemo} style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #d946ef, #ec4899)', color: '#fff', border: 'none', fontSize: '0.82rem', fontWeight: '800', boxShadow: '0 0 15px rgba(217, 70, 239, 0.4)' }}>
                Start Building with LAL →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'idea' && <IdeaPhase onSubmitIdea={() => setActiveTab('techstack')} isAnalyzing={isProcessing} />}
        {activeTab === 'techstack' && <TechStackPhase industry={selectedIndustry} />}
        {activeTab === 'design' && <DesignPhase industry={selectedIndustry} />}
        {activeTab === 'financial' && <FinancialPhase industry={selectedIndustry} />}
        {activeTab === 'competitors' && <CompetitorPhase industry={selectedIndustry} />}
        {activeTab === 'build' && <BuildPhase selectedMode="new" onSubmitPrompt={handleExecutePrompt} isProcessing={isProcessing} events={events} logs={logs} files={files} infra={infra} onClearLogs={() => setLogs([])} />}
        {activeTab === 'preview' && <div style={{ height: '700px' }}><AppPreview liveUrl={infra.live_url} activePort={infra.active_port} /></div>}
        {activeTab === 'documents' && <DocumentPhase industry={selectedIndustry} />}
        {activeTab === 'support' && <SupportPhase />}

      </main>

      {/* ========================================================================= */}
      {/* WORKSPACE MODAL */}
      {/* ========================================================================= */}
      {showWorkspaceModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '95%', maxWidth: '1400px', height: '88vh', display: 'flex', flexDirection: 'column', background: '#0a0d18', borderColor: '#06b6d4' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>Sandbox Code Workspace & Live Execution</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['code', 'feed', 'terminal', 'preview', 'infra'].map((t) => (
                    <button key={t} onClick={() => setWorkspaceTab(t)} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', background: workspaceTab === t ? 'rgba(6, 182, 212, 0.25)' : 'transparent', color: workspaceTab === t ? '#06b6d4' : '#9ca3af', border: 'none' }}>
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowWorkspaceModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={22} /></button>
            </div>
            <div style={{ flex: 1, padding: '16px', overflow: 'hidden' }}>
              {workspaceTab === 'code' && <CodeDiffViewer files={files} />}
              {workspaceTab === 'feed' && <ActivityFeed events={events} />}
              {workspaceTab === 'terminal' && <TerminalLogs logs={logs} onClear={() => setLogs([])} />}
              {workspaceTab === 'preview' && <AppPreview liveUrl={infra.live_url} activePort={infra.active_port} />}
              {workspaceTab === 'infra' && <InfraStatus infra={infra} />}
            </div>
          </div>
        </div>
      )}

      {/* Project Brain Modal */}
      <ProjectBrainModal isOpen={isBrainOpen} onClose={() => setIsBrainOpen(false)} brainData={brainData} />
    </div>
  );
}
