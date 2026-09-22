import React, { useState, useEffect, useRef } from 'react';
import LalMascot from './components/LalMascot';
import ProjectBrainModal from './components/ProjectBrainModal';
import CodeDiffViewer from './components/CodeDiffViewer';
import TerminalLogs from './components/TerminalLogs';
import AppPreview from './components/AppPreview';
import ActivityFeed from './components/ActivityFeed';
import InfraStatus from './components/InfraStatus';

import {
  Infinity, Send, ArrowRight, CheckCircle2, Cpu, Globe, Rocket, Activity,
  AlertTriangle, ShieldCheck, Wrench, RefreshCw, FileText, Smartphone,
  Database, Server, HardDrive, Lock, ChevronRight, Layers, FileCode, Check,
  Bot, Award, DollarSign, Users, ExternalLink, Calendar, HelpCircle, X
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000';

export default function App() {
  const [projectId, setProjectId] = useState('hackathon-demo-1');
  const [selectedIndustry, setSelectedIndustry] = useState('Tourism & Travel');
  const [selectedTemplate, setSelectedTemplate] = useState('Hackathon Presentation');
  const [selectedCostScale, setSelectedCostScale] = useState('medium');
  const [promptInput, setPromptInput] = useState('I want to build a tourism platform for Hyderabad offering local trips and health checks...');
  
  // Active Workspace / Code Inspector Modal state
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState('code'); // 'code', 'feed', 'terminal', 'preview', 'infra'

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
    <div style={{ padding: '16px 20px', minWidth: '1580px', margin: '0 auto', background: '#070913' }}>
      
      {/* ========================================================================= */}
      {/* TOP NAVBAR HEADER */}
      {/* ========================================================================= */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}>
            <Infinity size={26} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>NITHYA</h1>
              <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                AI SOFTWARE & BUSINESS PLATFORM
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>AI SOFTWARE & BUSINESS PLATFORM</p>
          </div>
        </div>

        {/* Center Main Headline & Stepper */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', background: 'linear-gradient(90deg, #fff, #93c5fd, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            From Business Idea to Production Software
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px', fontWeight: '500' }}>
            7 Phases. One Platform. Infinite Possibilities.
          </p>

          {/* Stepper Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af' }}>
            <span style={{ color: '#06b6d4' }}>IDEA</span> →
            <span style={{ color: '#3b82f6' }}>RESEARCH</span> →
            <span style={{ color: '#8b5cf6' }}>DESIGN</span> →
            <span style={{ color: '#10b981' }}>BUILD</span> →
            <span style={{ color: '#f59e0b' }}>DEPLOY</span> →
            <span style={{ color: '#f43f5e' }}>MONITOR</span> →
            <span style={{ color: '#d946ef' }}>GROW</span>
          </div>
        </div>

        {/* Right Mascot Box & Speech Bubble */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(30, 27, 75, 0.8)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '14px', padding: '10px 14px', maxWidth: '210px', fontSize: '0.75rem', position: 'relative' }}>
            <div style={{ color: '#fff', fontWeight: 'bold' }}>Hi! I'm <span style={{ color: '#ec4899' }}>LAL</span></div>
            <div style={{ color: '#9ca3af', fontSize: '0.7rem', marginTop: '2px' }}>Your AI Business & Development Assistant. Let's turn your ideas into reality!</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LalMascot width={62} height={62} />
            <span style={{ fontFamily: 'var(--font-script)', color: '#ec4899', fontSize: '0.9rem', marginTop: '-4px' }}>Your Idea. Our AI. Real Impact.</span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN 7-COLUMN PHASES HORIZONTAL GRID */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px' }}>
        
        {/* ------------------------------------------------------------- */}
        {/* COLUMN 1: PHASE 1 — IDEA / PROMPT ENGINE */}
        {/* ------------------------------------------------------------- */}
        <div className="phase-column phase-1-glow">
          {/* Header Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="num-badge" style={{ background: '#3b82f6' }}>1</div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff' }}>Idea / Prompt Engine</h3>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Start your journey — any way you want.</p>
            </div>
          </div>

          {/* 3 Source Options Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.72rem', textAlign: 'left' }}>
              <FileText size={14} color="#3b82f6" /> New Project from Scratch
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', fontSize: '0.72rem', textAlign: 'left' }}>
              <Globe size={14} color="#06b6d4" /> Existing Project (Cloud / Local)
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', fontSize: '0.72rem', textAlign: 'left' }}>
              <FileCode size={14} color="#8b5cf6" /> GitHub Repository
            </button>
          </div>

          {/* Ask LAL Prompt Box */}
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '8px 10px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold', marginBottom: '4px' }}>
              <Bot size={13} /> Ask LAL
            </div>
            <textarea
              rows={3}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="What are you building?"
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.75rem', outline: 'none', resize: 'none' }}
            />
            <button
              onClick={() => handleExecutePrompt()}
              style={{ width: '100%', padding: '6px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}
            >
              Start Building <ArrowRight size={14} />
            </button>
          </div>

          {/* Industry Selection Grid */}
          <div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 'bold', marginBottom: '6px' }}>Select Industry</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {['Tourism & Travel', 'AgriTech', 'HealthTech', 'EdTech', 'FinTech', 'E-Commerce'].map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  style={{
                    padding: '6px 4px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '600',
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

          {/* Feature Checklist */}
          <div style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><Check size={12} color="#3b82f6" style={{ display: 'inline', marginRight: '4px' }} /> AI analyzes your idea</div>
            <div><Check size={12} color="#3b82f6" style={{ display: 'inline', marginRight: '4px' }} /> Finds relevant competitors</div>
            <div><Check size={12} color="#3b82f6" style={{ display: 'inline', marginRight: '4px' }} /> Understands requirements</div>
            <div><Check size={12} color="#3b82f6" style={{ display: 'inline', marginRight: '4px' }} /> Identifies business opportunities</div>
          </div>

          {/* CTA */}
          <button onClick={() => handleExecutePrompt()} style={{ padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Continue to Research →
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COLUMN 2: PHASE 2 — TECH STACK ENGINE */}
        {/* ------------------------------------------------------------- */}
        <div className="phase-column phase-2-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="num-badge" style={{ background: '#10b981' }}>2</div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff' }}>Tech Stack Engine</h3>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Get the best technology options for your needs.</p>
            </div>
          </div>

          {/* Requirements Grid */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.68rem' }}>
            <div><span style={{ color: '#6b7280' }}>Expected Users:</span> <div style={{ color: '#fff', fontWeight: 'bold' }}>~ 1,000</div></div>
            <div><span style={{ color: '#6b7280' }}>Budget:</span> <div style={{ color: '#fff', fontWeight: 'bold' }}>Medium</div></div>
            <div><span style={{ color: '#6b7280' }}>Real-time?:</span> <div style={{ color: '#10b981', fontWeight: 'bold' }}>Yes</div></div>
            <div><span style={{ color: '#6b7280' }}>Mobile App?:</span> <div style={{ color: '#10b981', fontWeight: 'bold' }}>Yes</div></div>
            <div><span style={{ color: '#6b7280' }}>AI Features?:</span> <div style={{ color: '#10b981', fontWeight: 'bold' }}>Yes</div></div>
            <div><span style={{ color: '#6b7280' }}>Database:</span> <div style={{ color: '#fff', fontWeight: 'bold' }}>PostgreSQL</div></div>
          </div>

          <button style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.72rem', fontWeight: 'bold' }}>
            Generate Options
          </button>

          {/* 5 Possible Architectures */}
          <div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}>5 Possible Architectures</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem', color: '#e5e7eb' }}>
              <div style={{ padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>1 Django + React + PostgreSQL</div>
              <div style={{ padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>2 Next.js + Node.js + PostgreSQL</div>
              <div style={{ padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>3 Django + Next.js + PostgreSQL</div>
              <div style={{ padding: '4px 6px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', fontWeight: 'bold' }}>4 FastAPI + React + PostgreSQL</div>
              <div style={{ padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>5 AI-selected stack (Custom)</div>
            </div>
          </div>

          {/* Top 3 Recommendations */}
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '8px', fontSize: '0.7rem', color: '#9ca3af' }}>
            <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>🏆 Top 3 Recommendations</div>
            <div>✓ Why it fits your project</div>
            <div>✓ Advantages & trade-offs</div>
            <div>✓ Scalability & complexity</div>
            <div>✓ Estimated cost impact</div>
          </div>

          <button style={{ padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 'bold' }}>
            View Detailed Comparison →
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COLUMN 3: PHASE 3 — UI/UX DESIGN ENGINE */}
        {/* ------------------------------------------------------------- */}
        <div className="phase-column phase-3-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="num-badge" style={{ background: '#8b5cf6' }}>3</div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff' }}>UI/UX Design Engine</h3>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Create beautiful designs before dev.</p>
            </div>
          </div>

          {/* Mockup Preview Card (Explore Hyderabad) */}
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <div style={{ padding: '6px 8px', background: '#1e1b4b', fontSize: '0.68rem', fontWeight: 'bold', color: '#8b5cf6' }}>TourHYD</div>
            <div style={{ padding: '10px', textAlign: 'center', backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.2), transparent)', minHeight: '90px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#fff' }}>Explore Hyderabad</div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8b5cf6' }}>Like Never Before</div>
              <p style={{ fontSize: '0.6rem', color: '#9ca3af', marginTop: '4px' }}>Discover amazing places, local experiences, and trips.</p>
              <button style={{ marginTop: '6px', padding: '3px 8px', borderRadius: '4px', background: '#8b5cf6', color: '#fff', border: 'none', fontSize: '0.62rem', fontWeight: 'bold' }}>
                Explore Trips
              </button>
            </div>
          </div>

          {/* Design Elements List */}
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>✓ Color Palette</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1e1b4b' }} />
              </div>
            </div>
            <div>Aa Typography (Inter & Fira Code)</div>
            <div>[ Components ] Buttons, Cards, Inputs</div>
            <div>[ Page Structure ] Responsive Layout</div>
            <div>[ Mobile Responsive ] Touch Controls</div>
          </div>

          <button style={{ padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Generate UI Prototype →
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COLUMN 4: PHASE 4 — FINANCIAL / INFRASTRUCTURE ENGINE */}
        {/* ------------------------------------------------------------- */}
        <div className="phase-column phase-4-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="num-badge" style={{ background: '#f59e0b' }}>4</div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff' }}>Financial / Infra Engine</h3>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Know your estimated costs before live.</p>
            </div>
          </div>

          {/* Cost Scale Selector */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {['small', 'medium', 'large'].map((sc) => (
              <button
                key={sc}
                onClick={() => setSelectedCostScale(sc)}
                style={{
                  flex: 1, padding: '4px 2px', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 'bold',
                  border: selectedCostScale === sc ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                  background: selectedCostScale === sc ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.02)',
                  color: selectedCostScale === sc ? '#f59e0b' : '#9ca3af'
                }}
              >
                {sc.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Itemized Cost Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem', color: '#9ca3af' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Server (Cloud)</span><span style={{ color: '#fff', fontWeight: 'bold' }}>$20 - $50</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Database</span><span style={{ color: '#fff', fontWeight: 'bold' }}>$10 - $30</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Storage</span><span style={{ color: '#fff', fontWeight: 'bold' }}>$5 - $20</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>CDN</span><span style={{ color: '#fff', fontWeight: 'bold' }}>$5 - $15</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Domain + SSL</span><span style={{ color: '#fff', fontWeight: 'bold' }}>$2 - $10</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>AI APIs</span><span style={{ color: '#fff', fontWeight: 'bold' }}>$20 - $100</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Maps / Travel APIs</span><span style={{ color: '#fff', fontWeight: 'bold' }}>$10 - $50</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>WhatsApp / SMS</span><span style={{ color: '#fff', fontWeight: 'bold' }}>$10 - $40</span></div>
          </div>

          {/* Estimated Total Box */}
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Estimated Total</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#f59e0b' }}>$97 - $340 / month</div>
          </div>

          <button style={{ padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 'bold' }}>
            View Cost Breakdown →
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COLUMN 5: PHASE 5 — COMPETITOR INTELLIGENCE */}
        {/* ------------------------------------------------------------- */}
        <div className="phase-column phase-5-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="num-badge" style={{ background: '#f43f5e' }}>5</div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff' }}>Competitor Intelligence</h3>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Understand the market & competitors.</p>
            </div>
          </div>

          {/* Real Market Insights List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem' }}>
            {['MakeMyTrip', 'Yatra', 'Goibibo', 'Cleartrip', 'EaseMyTrip'].map((comp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                <span style={{ color: '#fff' }}>{comp}</span>
                <span style={{ color: '#f43f5e', fontSize: '0.65rem' }}>📊 Market Signal</span>
              </div>
            ))}
          </div>

          {/* AI Analysis Perspectives */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem', color: '#9ca3af' }}>
            <div><span style={{ color: '#f43f5e', fontWeight: 'bold' }}>Customer View:</span> User reviews & feature comparisons</div>
            <div><span style={{ color: '#f43f5e', fontWeight: 'bold' }}>Business View:</span> Market gaps & monetization</div>
            <div><span style={{ color: '#f43f5e', fontWeight: 'bold' }}>Product View:</span> Core feature differences</div>
            <div><span style={{ color: '#f43f5e', fontWeight: 'bold' }}>Pricing View:</span> Public pricing comparisons</div>
          </div>

          <button style={{ padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #f43f5e, #be123c)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 'bold' }}>
            View Full Analysis →
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COLUMN 6: PHASE 6 — PPT & DOCUMENT ENGINE */}
        {/* ------------------------------------------------------------- */}
        <div className="phase-column phase-6-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="num-badge" style={{ background: '#06b6d4' }}>6</div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff' }}>PPT & Document Engine</h3>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Turn ideas into powerful decks.</p>
            </div>
          </div>

          {/* Formula Box */}
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid #06b6d4', borderRadius: '8px', padding: '6px', textAlign: 'center', fontSize: '0.7rem', color: '#06b6d4', fontWeight: 'bold' }}>
            13 Industries × 10 Presentation Types = 130 Templates
          </div>

          {/* Choose Template Type List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.65rem' }}>
            {['Investor Pitch', 'Hackathon Presentation', 'Business Proposal', 'Product Demo', 'Technical Architecture'].map((tmpl) => (
              <div
                key={tmpl}
                onClick={() => setSelectedTemplate(tmpl)}
                style={{
                  padding: '4px 6px', borderRadius: '4px', cursor: 'pointer',
                  background: selectedTemplate === tmpl ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.03)',
                  color: selectedTemplate === tmpl ? '#06b6d4' : '#9ca3af',
                  border: selectedTemplate === tmpl ? '1px solid #06b6d4' : '1px solid transparent',
                  fontWeight: selectedTemplate === tmpl ? 'bold' : 'normal'
                }}
              >
                {tmpl} {selectedTemplate === tmpl && '✓'}
              </div>
            ))}
          </div>

          <button style={{ padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Generate with AI →
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COLUMN 7: PHASE 7 — HUMAN DEVELOPER SUPPORT */}
        {/* ------------------------------------------------------------- */}
        <div className="phase-column phase-7-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="num-badge" style={{ background: '#d946ef' }}>7</div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff' }}>Human Developer Support</h3>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Get expert help when you need it.</p>
            </div>
          </div>

          {/* Book a Developer Card */}
          <div style={{ background: 'rgba(217, 70, 239, 0.15)', border: '1px solid #d946ef', borderRadius: '8px', padding: '8px', fontSize: '0.7rem' }}>
            <div style={{ color: '#d946ef', fontWeight: 'bold' }}>Book a Developer</div>
            <div style={{ color: '#9ca3af', marginTop: '2px' }}>1-hour guided session with our experts.</div>
            <button style={{ marginTop: '6px', width: '100%', padding: '4px', borderRadius: '4px', background: '#d946ef', color: '#fff', border: 'none', fontSize: '0.65rem', fontWeight: 'bold' }}>
              Schedule a Session →
            </button>
          </div>

          {/* Support Areas List */}
          <div style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>• API Keys & Integrations</div>
            <div>• WhatsApp / Razorpay</div>
            <div>• Domain & DNS</div>
            <div>• Server & Deployment</div>
            <div>• Database Setup</div>
            <div>• BYOK Migration</div>
          </div>

          <div style={{ fontSize: '0.62rem', color: '#d946ef', textAlign: 'center', fontStyle: 'italic' }}>
            AI-first. Human-assisted when needed.
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ENGINEERING EXECUTION PIPELINE BAR */}
      {/* ========================================================================= */}
      <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', background: 'rgba(13, 17, 30, 0.95)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        
        {/* Step Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleExecutePrompt()}
            style={{ padding: '8px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileCode size={15} /> Generate Code
          </button>
          <span style={{ color: '#6b7280' }}>→</span>

          <button
            onClick={() => handleExecutePrompt()}
            style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Cpu size={15} color="#10b981" /> Test in Sandbox
          </button>
          <span style={{ color: '#6b7280' }}>→</span>

          <button
            onClick={() => { setShowWorkspaceModal(true); setWorkspaceTab('preview'); }}
            style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Globe size={15} color="#06b6d4" /> Preview Application
          </button>
          <span style={{ color: '#6b7280' }}>→</span>

          <button
            onClick={() => handleRunQuickDemo()}
            style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Rocket size={15} color="#f59e0b" /> Deploy to Cloud
          </button>
          <span style={{ color: '#6b7280' }}>→</span>

          <button
            onClick={handleInjectBug}
            style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', fontSize: '0.78rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Simulate 500 error to demonstrate AI self-healing"
          >
            <AlertTriangle size={15} /> Inject Bug & Self-Heal
          </button>
        </div>

        {/* Big Start Building Button */}
        <button
          onClick={handleRunQuickDemo}
          style={{ padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #d946ef, #ec4899)', color: '#fff', border: 'none', fontSize: '0.88rem', fontWeight: '800', boxShadow: '0 0 20px rgba(217, 70, 239, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Start Building with LAL →
        </button>
      </div>

      {/* Footer Branding Bar */}
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.75rem', padding: '0 8px' }}>
        <span style={{ fontFamily: 'var(--font-script)', color: '#ec4899', fontSize: '1.1rem' }}>Ideas Today. Impact Tomorrow.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>13 Industries (One Platform)</span>
          <span>7 AI Engines (End-to-End Intelligence)</span>
          <span>130 PPT Templates (Ready to Use)</span>
          <span>Unlimited Possibilities</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* WORKSPACE / CODE / LOGS MODAL */}
      {/* ========================================================================= */}
      {showWorkspaceModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '95%', maxWidth: '1400px', height: '88vh', display: 'flex', flexDirection: 'column', background: '#0a0d18', borderColor: '#06b6d4' }}>
            {/* Modal Header */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>Sandbox Code Workspace & Live Execution</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['code', 'feed', 'terminal', 'preview', 'infra'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setWorkspaceTab(t)}
                      style={{
                        padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600',
                        background: workspaceTab === t ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                        color: workspaceTab === t ? '#06b6d4' : '#9ca3af', border: 'none'
                      }}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={fetchBrain} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>Project Brain</button>
                <button onClick={() => setShowWorkspaceModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
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

      {/* Project Brain Inspector Modal */}
      <ProjectBrainModal
        isOpen={isBrainOpen}
        onClose={() => setIsBrainOpen(false)}
        brainData={brainData}
      />
    </div>
  );
}
