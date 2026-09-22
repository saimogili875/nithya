import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FolderCheck, GitBranch, ArrowRight, CheckCircle2, Bot, Layers, Loader2 } from 'lucide-react';

const INDUSTRIES = [
  "AgriTech", "HealthTech", "EdTech", "Retail / E-Commerce", "FinTech",
  "Manufacturing", "Logistics & Supply Chain", "Real Estate / PropTech",
  "Hospitality", "Energy & Utilities", "Government / CivicTech",
  "Biotech / Research", "Tourism & Travel"
];

export default function IdeaPage({ projectBrain, updateBrain }) {
  const navigate = useNavigate();

  const [startOption, setStartOption] = useState('new');
  const [selectedIndustry, setSelectedIndustry] = useState(projectBrain?.industry || 'Tourism & Travel');
  
  const [idea, setIdea] = useState('Build an AI-powered tourism platform for Hyderabad offering local trips and health checks...');
  const [targetUsers, setTargetUsers] = useState('Tourists, Local Guides & Hotel Partners');
  const [location, setLocation] = useState('Hyderabad, Telangana, India');
  const [businessModel, setBusinessModel] = useState('SaaS Commission & Package Bookings');
  const [expectedUsers, setExpectedUsers] = useState('1,000 users/day');
  const [majorRequirements, setMajorRequirements] = useState('REST API, Health Endpoint, Live Application Preview, Automated Testing');

  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    setIsProcessing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('http://localhost:8000/api/projects/idea/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'hackathon-demo-1',
          prompt: `${idea} Target Users: ${targetUsers}. Location: ${location}. Business Model: ${businessModel}. Expected Users: ${expectedUsers}. Major Requirements: ${majorRequirements}.`,
          industry: selectedIndustry
        })
      });
      const data = await res.json();
      setAnalysisResult(data);
      if (updateBrain) {
        updateBrain({
          industry: selectedIndustry,
          purpose: idea,
          target_users: targetUsers,
          business_model: businessModel
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1))', borderColor: '#06b6d4' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="#06b6d4" /> Phase 1: Idea / Prompt Engine
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>
          Tell LAL what you want to build. Our AI analyzes domain requirements, target audience, and business model.
        </p>
      </div>

      {/* 1. Starting Options */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
          1. Choose Starting Option
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div
            onClick={() => setStartOption('new')}
            style={{
              padding: '16px', borderRadius: '10px', cursor: 'pointer',
              border: startOption === 'new' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
              background: startOption === 'new' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.3)'
            }}
          >
            <Sparkles size={22} color="#06b6d4" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>1. Start New Project</div>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '2px' }}>Build complete application from scratch using AI.</p>
          </div>

          <div
            onClick={() => setStartOption('existing')}
            style={{
              padding: '16px', borderRadius: '10px', cursor: 'pointer',
              border: startOption === 'existing' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
              background: startOption === 'existing' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.3)'
            }}
          >
            <FolderCheck size={22} color="#3b82f6" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>2. Existing Project / Folder</div>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '2px' }}>Connect local computer directory into sandbox.</p>
          </div>

          <div
            onClick={() => setStartOption('github')}
            style={{
              padding: '16px', borderRadius: '10px', cursor: 'pointer',
              border: startOption === 'github' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
              background: startOption === 'github' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.3)'
            }}
          >
            <GitBranch size={22} color="#8b5cf6" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>3. GitHub Repository</div>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '2px' }}>Import git repository into project context.</p>
          </div>
        </div>
      </div>

      {/* 2. Industry Selection */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
          2. Select Industry Domain
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              style={{
                padding: '9px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
                border: selectedIndustry === ind ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                background: selectedIndustry === ind ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.03)',
                color: selectedIndustry === ind ? '#06b6d4' : '#9ca3af', textAlign: 'center'
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Detailed Business Inputs */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>
          3. Describe What You Want to Build
        </h3>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Idea Description:</label>
          <textarea
            rows={3}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.3)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Target Users:</label>
            <input
              type="text"
              value={targetUsers}
              onChange={(e) => setTargetUsers(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Target Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Business Model:</label>
            <input
              type="text"
              value={businessModel}
              onChange={(e) => setBusinessModel(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Expected Scale:</label>
            <input
              type="text"
              value={expectedUsers}
              onChange={(e) => setExpectedUsers(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isProcessing}
          className="btn-primary"
          style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
        >
          {isProcessing ? <><Loader2 size={18} className="spin" /> LAL is analyzing your business idea...</> : <><Bot size={18} /> Ask LAL to Analyze Idea</>}
        </button>
      </div>

      {/* Analysis Output Results */}
      {analysisResult && (
        <div className="glass-panel" style={{ padding: '24px', borderColor: '#06b6d4', background: 'rgba(6, 182, 212, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 color="#10b981" /> AI Business Understanding & PRD
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 'bold' }}>Industry: {analysisResult.industry}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>BUSINESS SUMMARY:</span>
              <p style={{ color: '#e5e7eb', marginTop: '4px' }}>{analysisResult.business_summary}</p>
            </div>

            <div>
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>TARGET USERS:</span>
              <p style={{ color: '#e5e7eb', marginTop: '4px' }}>{analysisResult.target_users}</p>
            </div>

            <div>
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>MAJOR REQUIREMENTS:</span>
              <ul style={{ paddingLeft: '18px', color: '#9ca3af', marginTop: '4px' }}>
                {analysisResult.prd.core_requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              onClick={() => navigate('/tech-stack')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              Continue to Tech Stack →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
