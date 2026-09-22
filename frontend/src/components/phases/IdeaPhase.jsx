import React, { useState } from 'react';
import { Sparkles, FolderCheck, GitBranch, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

const INDUSTRIES = [
  "AgriTech", "HealthTech", "EdTech", "Retail / E-Commerce", "FinTech",
  "Manufacturing", "Logistics & Supply Chain", "Real Estate / PropTech",
  "Hospitality", "Energy & Utilities", "Government / CivicTech",
  "Biotech / Research", "Tourism & Travel"
];

export default function IdeaPhase({ onSubmitIdea, isAnalyzing }) {
  const [prompt, setPrompt] = useState('Build an AI-powered tourism platform for Hyderabad with real-time itinerary planning and health checks.');
  const [selectedIndustry, setSelectedIndustry] = useState('Tourism & Travel');
  const [startMode, setStartMode] = useState('zero'); // 'existing', 'zero', 'continue'
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/projects/idea/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, industry: selectedIndustry })
      });
      const data = await res.json();
      setAnalysisResult(data);
      if (onSubmitIdea) onSubmitIdea(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="#06b6d4" /> Phase 1: Idea & Prompt Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          Transform your raw business prompt into a structured Product Requirement Document (PRD), architecture blueprint, and module breakdown.
        </p>
      </div>

      {/* Step 1: Industry Selector & Mode */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f3f4f6', marginBottom: '12px' }}>
          1. Select Target Industry & Business Domain
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                border: selectedIndustry === ind ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                background: selectedIndustry === ind ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.03)',
                color: selectedIndustry === ind ? '#06b6d4' : '#9ca3af',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: How Do You Want To Start? */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f3f4f6', marginBottom: '12px' }}>
          2. How Do You Want To Start?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div
            onClick={() => setStartMode('existing')}
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: startMode === 'existing' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
              background: startMode === 'existing' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
          >
            <FolderCheck size={24} color="#06b6d4" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>OPTION A: Existing Project</div>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Connect local directory or GitHub repository into sandbox.</p>
          </div>

          <div
            onClick={() => setStartMode('zero')}
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: startMode === 'zero' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
              background: startMode === 'zero' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={24} color="#8b5cf6" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>OPTION B: Start From Zero</div>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>AI converts prompt into PRD, Architecture, and Code.</p>
          </div>

          <div
            onClick={() => setStartMode('continue')}
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: startMode === 'continue' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
              background: startMode === 'continue' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
          >
            <GitBranch size={24} color="#10b981" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>OPTION C: Continue / Modify</div>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Iteratively add features, fix bugs, or edit code directly.</p>
          </div>
        </div>
      </div>

      {/* Step 3: Prompt Text Input */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f3f4f6', marginBottom: '10px' }}>
          3. Describe What You Are Building
        </h3>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.3)',
            background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.9rem', outline: 'none'
          }}
        />
        <button
          onClick={handleAnalyze}
          className="btn-primary"
          style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Analyze Idea & Generate PRD <ArrowRight size={16} />
        </button>
      </div>

      {/* Generated PRD & Analysis Output */}
      {analysisResult && (
        <div className="glass-panel" style={{ padding: '20px', borderColor: '#06b6d4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 color="#10b981" size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>AI Product Requirement Document (PRD)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>BUSINESS SUMMARY:</span>
              <p style={{ color: '#e5e7eb', marginTop: '2px' }}>{analysisResult.business_summary}</p>
            </div>
            <div>
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>CORE REQUIREMENTS:</span>
              <ul style={{ paddingLeft: '18px', marginTop: '4px', color: '#9ca3af' }}>
                {analysisResult.prd.core_requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
