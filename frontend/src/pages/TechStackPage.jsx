import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Server, Database, Layers, ShieldCheck, DollarSign } from 'lucide-react';

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

  // Loading & Processing state (60-second demo mode or fast execution)
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(60);

  // Results state
  const [stackResults, setStackResults] = useState(null);
  const [selectedStackId, setSelectedStackId] = useState(projectBrain?.selected_stack_id || 'opt-1');

  const stepsList = [
    "Analyzing expected user scale & traffic thresholds",
    "Evaluating frontend web & mobile frameworks",
    "Evaluating backend frameworks & API concurrency",
    "Comparing databases (PostgreSQL, SQLite, MongoDB) & caching",
    "Calculating infrastructure costs and scalability metrics"
  ];

  const handleGenerateArchitectures = () => {
    setIsGenerating(true);
    setProgressPercent(0);
    setCurrentStepIndex(0);
    setRemainingSeconds(15); // 15-second crisp demo duration for smooth testing

    const totalDuration = 15000;
    const intervalTime = 300;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
      setProgressPercent(pct);
      setRemainingSeconds(Math.max(Math.ceil((totalDuration - elapsed) / 1000), 0));

      if (pct < 20) setCurrentStepIndex(0);
      else if (pct < 40) setCurrentStepIndex(1);
      else if (pct < 60) setCurrentStepIndex(2);
      else if (pct < 80) setCurrentStepIndex(3);
      else setCurrentStepIndex(4);

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
      console.error(e);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', borderColor: '#10b981' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu color="#10b981" /> Phase 2: Tech Stack Engine
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>
          Configure your operational scale, real-time, AI, and security preferences to generate 5 tailored technology architectures.
        </p>
      </div>

      {/* Interactive Requirements Collector Form */}
      {!stackResults && !isGenerating && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
            Configure Project Technical Requirements
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', fontSize: '0.85rem' }}>
            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Expected Users:</label>
              <select value={expectedUsers} onChange={(e) => setExpectedUsers(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="100">100 users</option>
                <option value="1,000">1,000 users</option>
                <option value="10,000">10,000 users</option>
                <option value="100,000+">100,000+ users</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Expected Traffic:</label>
              <select value={expectedTraffic} onChange={(e) => setExpectedTraffic(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Real-time Requirement?:</label>
              <select value={isRealtime} onChange={(e) => setIsRealtime(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Yes">Yes (WebSockets / Server-Sent Events)</option>
                <option value="No">No (Standard REST)</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Mobile App Needed?:</label>
              <select value={isMobile} onChange={(e) => setIsMobile(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Yes">Yes (Responsive / React Native)</option>
                <option value="No">No (Desktop Only)</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>AI / ML Features?:</label>
              <select value={isAi} onChange={(e) => setIsAi(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Yes">Yes (LLM APIs, Prompt Orchestration)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Preferred Database:</label>
              <select value={database} onChange={(e) => setDatabase(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="MySQL">MySQL</option>
                <option value="MongoDB">MongoDB</option>
                <option value="SQLite">SQLite (Lean Prototyping)</option>
                <option value="Let LAL Decide">Let LAL Decide</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Budget Tier:</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Low">Low ($15 - $50/mo)</option>
                <option value="Medium">Medium ($50 - $200/mo)</option>
                <option value="High">High ($200+/mo)</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Deployment Target:</label>
              <select value={deployment} onChange={(e) => setDeployment(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Cloud Container">Docker Cloud Container</option>
                <option value="VPS">VPS (Ubuntu)</option>
                <option value="Serverless">Serverless</option>
                <option value="Let LAL Decide">Let LAL Decide</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Security Level:</label>
              <select value={security} onChange={(e) => setSecurity(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#121824', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="Standard">Standard (HTTPS, CORS)</option>
                <option value="High">High (Sanitized Sandbox, Role Auth)</option>
                <option value="Enterprise">Enterprise Compliance</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateArchitectures}
            className="btn-primary"
            style={{ marginTop: '12px', height: '44px', fontSize: '0.9rem', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Cpu size={18} /> Generate 5 Technology Architectures
          </button>
        </div>
      )}

      {/* 60-SECOND REALISTIC PROCESSING SCREEN */}
      {isGenerating && (
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', borderColor: '#10b981', background: 'rgba(16, 185, 129, 0.08)' }}>
          <Loader2 size={36} color="#10b981" className="spin" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>LAL is designing your technology architectures...</h3>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>Evaluating framework concurrency, database indexing, and infrastructure cost impact.</p>

          {/* Progress Bar */}
          <div style={{ width: '80%', margin: '20px auto 10px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4)', transition: 'width 0.3s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', margin: '0 auto', fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>
            <span>[{'█'.repeat(Math.floor(progressPercent / 6))}{'░'.repeat(16 - Math.floor(progressPercent / 6))}] {progressPercent}%</span>
            <span>Approximately {remainingSeconds} seconds remaining</span>
          </div>

          {/* Staged Checklist */}
          <div style={{ width: '80%', margin: '20px auto 0', textAlign: 'left', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stepsList.map((st, i) => (
              <div key={i} style={{ color: i < currentStepIndex ? '#10b981' : i === currentStepIndex ? '#fff' : '#6b7280', fontWeight: i === currentStepIndex ? 'bold' : 'normal' }}>
                {i < currentStepIndex ? `✓ ${st}` : i === currentStepIndex ? `● ${st}` : `○ ${st}`}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 2 RESULTS: 5 GENERATED ARCHITECTURES */}
      {stackResults && !isGenerating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
              Your Technology Architecture Options (5 Generated)
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>
              ✓ Architecture Selected: {stackResults.all_options.find(o => o.id === selectedStackId)?.name}
            </span>
          </div>

          {stackResults.all_options.map((opt, idx) => {
            const isSelected = selectedStackId === opt.id;
            return (
              <div
                key={opt.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderColor: isSelected ? '#10b981' : 'rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(18, 24, 36, 0.8)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>OPTION {idx + 1}: {opt.name}</h4>
                    {opt.is_recommended && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid #10b981' }}>
                        TOP 3 RECOMMENDATION
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' }}>
                    Est. {opt.estimated_cost_impact}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '12px' }}>{opt.why}</p>

                {/* Progress bars for Scalability & Complexity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', marginBottom: '2px' }}>
                      <span>Scalability:</span> <span>{opt.scalability}</span>
                    </div>
                    <div style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: 'bold' }}>[████████░░] High</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', marginBottom: '2px' }}>
                      <span>Complexity:</span> <span>{opt.complexity}</span>
                    </div>
                    <div style={{ color: '#06b6d4', fontFamily: 'monospace', fontWeight: 'bold' }}>[██████░░░░] Medium</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.82rem', marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>ADVANTAGES:</span>
                    <ul style={{ paddingLeft: '18px', color: '#e5e7eb', marginTop: '2px' }}>
                      {opt.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>TRADE-OFFS:</span>
                    <ul style={{ paddingLeft: '18px', color: '#e5e7eb', marginTop: '2px' }}>
                      {opt.disadvantages.map((dis, i) => <li key={i}>{dis}</li>)}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectArchitecture(opt)}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 'bold', border: 'none',
                    background: isSelected ? '#10b981' : 'rgba(255,255,255,0.08)',
                    color: '#fff'
                  }}
                >
                  {isSelected ? '✓ Architecture Selected' : 'Select This Architecture'}
                </button>
              </div>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button onClick={() => navigate('/idea')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Back to Idea
            </button>
            <button onClick={() => navigate('/design')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
              Continue to UI/UX Design → <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
