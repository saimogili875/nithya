import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoldCard from '../components/ui/GoldCard';
import { Cpu, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Server, Database, Layers, ShieldCheck, DollarSign, Zap } from 'lucide-react';

export default function TechStackPage({ projectBrain, updateBrain }) {
  const navigate = useNavigate();

  // Interactive Form Inputs
  const [expectedUsers, setExpectedUsers] = useState('1,000');
  const [expectedTraffic, setExpectedTraffic] = useState('Medium');
  const [isRealtime, setIsRealtime] = useState('Yes');
  const [isMobile, setIsMobile] = useState('Yes');
  const [isAi, setIsAi] = useState('Yes');
  const [database, setDatabase] = useState('PostgreSQL');
  const [budget, setBudget] = useState('Medium');
  const [deployment, setDeployment] = useState('Cloud Container');
  const [security, setSecurity] = useState('Standard');

  // Loading & Processing state (deterministic demo mode)
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(60);

  // Results state
  const [stackResults, setStackResults] = useState(null);
  const [selectedStackId, setSelectedStackId] = useState(projectBrain?.selected_stack_id || 'opt-1');

  const stepsList = [
    "0–10s: Understanding project requirements & prompt context",
    "10–20s: Analyzing expected users & concurrency traffic thresholds",
    "20–30s: Evaluating backend frameworks (FastAPI, Express, Go, Spring)",
    "30–40s: Evaluating databases (PostgreSQL, Supabase, MongoDB, Redis)",
    "40–50s: Evaluating infrastructure, containerization & deployment",
    "50–60s: Preparing 5 recommended technology architectures"
  ];

  const handleGenerateArchitectures = () => {
    setIsGenerating(true);
    setProgressPercent(0);
    setCurrentStepIndex(0);
    setRemainingSeconds(12); // Crisp 12-second progress animation for fast UX testing

    const totalDuration = 12000;
    const intervalTime = 300;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
      setProgressPercent(pct);
      setRemainingSeconds(Math.max(Math.ceil((totalDuration - elapsed) / 1000), 0));

      if (pct < 18) setCurrentStepIndex(0);
      else if (pct < 35) setCurrentStepIndex(1);
      else if (pct < 52) setCurrentStepIndex(2);
      else if (pct < 70) setCurrentStepIndex(3);
      else if (pct < 88) setCurrentStepIndex(4);
      else setCurrentStepIndex(5);

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        setIsGenerating(false);
        fetchBackendResults();
      }
    }, intervalTime);
  };

  const fetchBackendResults = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/projects/tech-stack/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'hackathon-demo-1',
          industry: projectBrain?.industry || 'Tourism & Travel',
          user_scale: expectedUsers
        })
      });
      const data = await res.json();
      setStackResults(data);
    } catch (e) {
      // Fallback 5 default architecture options if backend endpoint is offline
      setStackResults({
        all_options: [
          {
            id: 'opt-1',
            name: 'FastAPI + React + PostgreSQL + Docker (Production Standard)',
            is_recommended: true,
            why: 'Optimal high-performance asynchronous API tier with relational data integrity and Docker deployment.',
            estimated_cost_impact: '$25 - $60 / mo',
            scalability: 'Very High',
            complexity: 'Low-Medium',
            advantages: ['Asynchronous non-blocking Python', 'Automatic Swagger documentation', 'Isolated Docker sandbox'],
            disadvantages: ['Requires ORM setup for complex joins']
          },
          {
            id: 'opt-2',
            name: 'Next.js 14 + Node.js + Supabase + Tailwind (Serverless Stack)',
            is_recommended: true,
            why: 'Fastest fullstack development lifecycle with built-in auth, real-time subscriptions, and serverless edge APIs.',
            estimated_cost_impact: '$15 - $40 / mo',
            scalability: 'High',
            complexity: 'Low',
            advantages: ['Serverless auto-scaling', 'Built-in real-time WebSocket subscriptions', 'Zero server management'],
            disadvantages: ['Vendor lock-in on Supabase BaaS']
          },
          {
            id: 'opt-3',
            name: 'Go (Gin) + React + Redis + PostgreSQL (High Concurrency)',
            is_recommended: true,
            why: 'Ultra low-latency compiled backend execution handling 50k+ concurrent requests/sec.',
            estimated_cost_impact: '$40 - $120 / mo',
            scalability: 'Extreme',
            complexity: 'High',
            advantages: ['Sub-millisecond API response times', 'Minimal CPU & memory consumption'],
            disadvantages: ['More verbose boilerplate code']
          },
          {
            id: 'opt-4',
            name: 'Python (Django REST) + React + PostgreSQL + Celery (Enterprise Monolith)',
            is_recommended: false,
            why: 'Batteries-included framework for complex permissions, admin dashboard, and background job queues.',
            estimated_cost_impact: '$50 - $150 / mo',
            scalability: 'High',
            complexity: 'Medium',
            advantages: ['Built-in admin interface', 'Robust ORM and migrations'],
            disadvantages: ['Higher baseline RAM footprint']
          },
          {
            id: 'opt-5',
            name: 'Express.js + React + MongoDB + Docker (MERN Architecture)',
            is_recommended: false,
            why: 'Document-oriented JSON database stack ideal for unstructured catalog data.',
            estimated_cost_impact: '$20 - $50 / mo',
            scalability: 'Medium',
            complexity: 'Low',
            advantages: ['Single language (JavaScript/TypeScript) across stack', 'Flexible schema'],
            disadvantages: ['No native transactional integrity guarantees']
          }
        ]
      });
    }
  };

  const handleSelectArchitecture = (opt) => {
    setSelectedStackId(opt.id);
    if (updateBrain) {
      updateBrain({
        selected_stack: opt.name,
        selected_stack_id: opt.id
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Header Banner */}
      <GoldCard active={true} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gold-badge" style={{ marginBottom: '8px' }}>PHASE 2 ENGINE</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu color="#f59e0b" size={24} /> Tech Stack & Architecture Studio
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              Select operational scale, database concurrency, and infrastructure parameters to generate 5 gold-standard architectures.
            </p>
          </div>
        </div>
      </GoldCard>

      {/* Interactive Form Controls */}
      {!stackResults && !isGenerating && (
        <GoldCard title="Configure Technical Parameters" subtitle="Define scale, database, and concurrency expectations for LAL AI">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ color: '#fbbf24', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Expected User Scale:</label>
              <select value={expectedUsers} onChange={(e) => setExpectedUsers(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.9)', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <option value="100">100 active users</option>
                <option value="1,000">1,000 active users</option>
                <option value="10,000">10,000 active users</option>
                <option value="100,000+">100,000+ active users</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#fbbf24', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Traffic Concurrency:</label>
              <select value={expectedTraffic} onChange={(e) => setExpectedTraffic(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.9)', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <option value="Low">Low (&lt; 10 req/sec)</option>
                <option value="Medium">Medium (100 req/sec)</option>
                <option value="High">High (5,000+ req/sec)</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#fbbf24', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Real-time Messaging?:</label>
              <select value={isRealtime} onChange={(e) => setIsRealtime(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.9)', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <option value="Yes">Yes (WebSockets / SSE)</option>
                <option value="No">No (Standard REST)</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Mobile Native Target?:</label>
              <select value={isMobile} onChange={(e) => setIsMobile(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Yes">Yes (Responsive / React Native)</option>
                <option value="No">No (Desktop Only)</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>AI / LLM Orchestration?:</label>
              <select value={isAi} onChange={(e) => setIsAi(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Yes">Yes (Gemini / Claude APIs)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Preferred Database:</label>
              <select value={database} onChange={(e) => setDatabase(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="Supabase">Supabase</option>
                <option value="MongoDB">MongoDB</option>
                <option value="SQLite">SQLite (Lean Prototype)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateArchitectures}
            className="gold-btn"
            style={{ marginTop: '20px', height: '48px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}
          >
            <Cpu size={20} /> Generate 5 Gold Architecture Options
          </button>
        </GoldCard>
      )}

      {/* 60-SECOND STAGED PROCESSING SCREEN */}
      {isGenerating && (
        <GoldCard style={{ background: 'rgba(12, 14, 22, 0.95)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <Loader2 size={32} color="#f59e0b" className="spin" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>LAL is evaluating backend & database architectures...</h3>
              <p style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '2px' }}>{stepsList[currentStepIndex]}</p>
            </div>
          </div>

          {/* Progress Bar & Percentage */}
          <div style={{ margin: '20px 0 10px', height: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', transition: 'width 0.3s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#fbbf24', fontWeight: '800', fontFamily: 'monospace' }}>
            <span>[{'█'.repeat(Math.floor(progressPercent / 6))}{'░'.repeat(16 - Math.floor(progressPercent / 6))}] {progressPercent}%</span>
            <span>Est. Time Remaining: {remainingSeconds}s</span>
          </div>

          {/* Checklist */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            {stepsList.map((st, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: i < currentStepIndex ? '#10b981' : i === currentStepIndex ? '#fbbf24' : '#64748b', fontWeight: i === currentStepIndex ? '800' : '500' }}>
                <span>{i < currentStepIndex ? '✓' : i === currentStepIndex ? '●' : '○'}</span>
                <span>{st}</span>
              </div>
            ))}
          </div>
        </GoldCard>
      )}

      {/* 5 GOLD-BORDERED ARCHITECTURE CARDS */}
      {stackResults && !isGenerating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc' }}>
              Select Recommended Architecture (5 Options)
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Architecture Selected
            </span>
          </div>

          {stackResults.all_options.map((opt, idx) => {
            const isSelected = selectedStackId === opt.id;
            return (
              <GoldCard
                key={opt.id}
                active={isSelected}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectArchitecture(opt)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc' }}>OPTION {idx + 1}: {opt.name}</h4>
                      {opt.is_recommended && <span className="gold-badge">TOP RECOMMENDATION</span>}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px', lineHeight: '1.4' }}>{opt.why}</p>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {opt.estimated_cost_impact}
                  </span>
                </div>

                {/* Metrics Progress Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '14px 0', padding: '10px 14px', background: 'rgba(8, 10, 16, 0.8)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>Scalability:</span> <span style={{ color: '#10b981', fontWeight: '800' }}>{opt.scalability}</span>
                    </div>
                    <div style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: '800' }}>
                      [████████░░] High Performance
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>Complexity:</span> <span style={{ color: '#06b6d4', fontWeight: '800' }}>{opt.complexity}</span>
                    </div>
                    <div style={{ color: '#06b6d4', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: '800' }}>
                      [██████░░░░] Medium Operational Complexity
                    </div>
                  </div>
                </div>

                {/* Advantages & Trade-offs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.8rem', marginBottom: '14px' }}>
                  <div>
                    <span style={{ color: '#10b981', fontWeight: '800' }}>ADVANTAGES:</span>
                    <ul style={{ paddingLeft: '18px', color: '#f8fafc', marginTop: '4px', lineHeight: '1.5' }}>
                      {opt.advantages?.map((adv, i) => <li key={i}>{adv}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span style={{ color: '#f59e0b', fontWeight: '800' }}>TRADE-OFFS:</span>
                    <ul style={{ paddingLeft: '18px', color: '#f8fafc', marginTop: '4px', lineHeight: '1.5' }}>
                      {opt.disadvantages?.map((dis, i) => <li key={i}>{dis}</li>)}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelectArchitecture(opt); }}
                    className={isSelected ? "gold-btn" : "btn-secondary"}
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                  >
                    {isSelected ? '✓ Architecture Selected' : 'Select Architecture'}
                  </button>
                </div>
              </GoldCard>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button onClick={() => navigate('/idea')} className="gold-btn" style={{ background: 'transparent', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Back to Idea
            </button>
            <button onClick={() => navigate('/design')} className="gold-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px' }}>
              Continue to UI/UX Design → <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
