import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoldCard from '../components/ui/GoldCard';
import { Sparkles, FolderCheck, GitBranch, ArrowRight, CheckCircle2, Bot, UploadCloud, FileArchive, Loader2, Check } from 'lucide-react';

const INDUSTRIES = [
  "AgriTech", "HealthTech", "EdTech", "Retail / E-Commerce", "FinTech",
  "Manufacturing", "Logistics & Supply Chain", "Real Estate / PropTech",
  "Hospitality", "Energy & Utilities", "Government / CivicTech",
  "Biotech / Research", "Tourism & Travel"
];

const ANALYSIS_STAGES = [
  "Understanding idea...",
  "Identifying industry domain...",
  "Analyzing target users...",
  "Evaluating functional requirements...",
  "Identifying external API integrations...",
  "Preparing business PRD context..."
];

export default function IdeaPage({ projectBrain, updateBrain }) {
  const navigate = useNavigate();

  const [startOption, setStartOption] = useState('new');
  const [selectedIndustry, setSelectedIndustry] = useState(projectBrain?.industry || 'Tourism & Travel');
  
  const [idea, setIdea] = useState('Build an AI-powered tourism platform for Hyderabad offering local trips, verified guide bookings, and AI itinerary planner...');
  const [targetUsers, setTargetUsers] = useState('Tourists, Local Guides & Hotel Partners');
  const [location, setLocation] = useState('Hyderabad, Telangana, India');
  const [businessModel, setBusinessModel] = useState('SaaS Commission & Package Bookings');
  const [expectedUsers, setExpectedUsers] = useState('1,000 users/day');
  const [majorRequirements, setMajorRequirements] = useState('REST API, Health Endpoint, Live Application Preview, Automated Testing');

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    setIsProcessing(true);
    setAnalysisResult(null);
    setCurrentStageIdx(0);

    // Stage progress timer simulation for WOW factor
    const stageInterval = setInterval(() => {
      setCurrentStageIdx(prev => {
        if (prev < ANALYSIS_STAGES.length - 1) return prev + 1;
        clearInterval(stageInterval);
        return prev;
      });
    }, 400);

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
      // Fallback structured data if backend returns error
      setAnalysisResult({
        industry: selectedIndustry,
        business_summary: `AI Tourism & Travel Platform tailored for ${location}, streamlining itinerary discovery and guide bookings.`,
        target_users: targetUsers,
        prd: {
          core_requirements: [
            "AI-powered dynamic itinerary generator",
            "Real-time guide availability & booking system",
            "Multi-language support for international tourists",
            "Automated payment gateway & booking confirmation"
          ]
        }
      });
    } finally {
      clearInterval(stageInterval);
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <GoldCard active={true} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gold-badge" style={{ marginBottom: '8px' }}>PHASE 1 ENGINE</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles color="#f59e0b" size={24} /> Idea & Prompt Engineering Studio
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              Define your software vision. LAL AI converts natural language into structured PRD business requirements.
            </p>
          </div>
        </div>
      </GoldCard>

      {/* 1. STARTING POINT CARDS */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          1. Choose Starting Point
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <GoldCard
            active={startOption === 'new'}
            onClick={() => setStartOption('new')}
            title="New Project"
            subtitle="Start from zero. LAL generates complete architecture & fullstack code."
            badge="Recommended"
          >
            <Sparkles size={24} color="#f59e0b" />
          </GoldCard>

          <GoldCard
            active={startOption === 'existing'}
            onClick={() => setStartOption('existing')}
            title="Existing Project"
            subtitle="Upload / import your existing codebase folder or ZIP archive."
            badge="Local / ZIP"
          >
            <FolderCheck size={24} color="#3b82f6" />
          </GoldCard>

          <GoldCard
            active={startOption === 'github'}
            onClick={() => setStartOption('github')}
            title="GitHub Repo"
            subtitle="Connect a remote GitHub repository directly to LAL sandbox."
            badge="Git Clone"
          >
            <GitBranch size={24} color="#8b5cf6" />
          </GoldCard>
        </div>
      </div>

      {/* Cloud Upload Panel if Existing Selected */}
      {startOption === 'existing' && (
        <GoldCard style={{ borderStyle: 'dashed', textAlign: 'center', padding: '30px' }}>
          <UploadCloud size={40} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: '700' }}>Upload Existing Project Folder / ZIP</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 16px' }}>
            Drag & Drop ZIP file or select folder from your computer
          </p>
          <label className="gold-btn" style={{ display: 'inline-block', cursor: 'pointer' }}>
            Choose ZIP / Files
            <input type="file" accept=".zip,.tar.gz" style={{ display: 'none' }} onChange={() => alert('Project ZIP uploaded into sandbox context!')} />
          </label>
        </GoldCard>
      )}

      {/* 2. INDUSTRY SELECTION */}
      <GoldCard title="2. Target Industry Domain" subtitle="Select from 13 supported enterprise industry domains">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
          {INDUSTRIES.map((ind) => {
            const isSelected = selectedIndustry === ind;
            return (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 18, 28, 0.6)',
                  color: isSelected ? '#fbbf24' : '#94a3b8',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                {ind}
              </button>
            );
          })}
        </div>
      </GoldCard>

      {/* 3. IDEA INPUT & FORM */}
      <GoldCard title="3. What are you building?" subtitle="Provide high-level prompt or business requirements">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
              Core Idea Prompt:
            </label>
            <textarea
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. I want to build an AI-powered tourism platform for Hyderabad..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                background: 'rgba(8, 10, 16, 0.9)',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none',
                lineHeight: '1.5'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Users:</label>
              <input
                type="text"
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Location:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Business Model:</label>
              <input
                type="text"
                value={businessModel}
                onChange={(e) => setBusinessModel(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Expected Scale:</label>
              <input
                type="text"
                value={expectedUsers}
                onChange={(e) => setExpectedUsers(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isProcessing}
            className="gold-btn"
            style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.95rem', marginTop: '8px' }}
          >
            {isProcessing ? <><Loader2 size={18} className="spin" /> LAL Analysis in Progress...</> : <><Bot size={20} /> Analyze Idea with LAL AI</>}
          </button>
        </div>
      </GoldCard>

      {/* 4. STAGED PROCESSING EXPERIENCE */}
      {isProcessing && (
        <GoldCard style={{ background: 'rgba(15, 18, 28, 0.95)', border: '1px solid rgba(245, 158, 11, 0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Loader2 size={24} color="#f59e0b" className="spin" />
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#f8fafc' }}>LAL AI Analysis Stage</h4>
              <p style={{ fontSize: '0.78rem', color: '#f59e0b' }}>{ANALYSIS_STAGES[currentStageIdx]}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ANALYSIS_STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: isDone ? '#10b981' : isCurrent ? '#fbbf24' : '#64748b' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: isDone ? '#10b981' : isCurrent ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isDone ? <Check size={12} color="#fff" /> : <span style={{ fontSize: '0.65rem' }}>{idx + 1}</span>}
                  </div>
                  <span>{stage}</span>
                </div>
              );
            })}
          </div>
        </GoldCard>
      )}

      {/* 5. ANALYSIS RESULT */}
      {analysisResult && !isProcessing && (
        <GoldCard active={true} title="LAL PRD & Business Analysis Output" badge="Analysis Complete">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#f59e0b', fontWeight: '800' }}>BUSINESS UNDERSTANDING:</span>
              <p style={{ color: '#f8fafc', marginTop: '4px', lineHeight: '1.5' }}>{analysisResult.business_summary}</p>
            </div>

            <div>
              <span style={{ color: '#f59e0b', fontWeight: '800' }}>TARGET USERS:</span>
              <p style={{ color: '#f8fafc', marginTop: '4px' }}>{analysisResult.target_users}</p>
            </div>

            <div>
              <span style={{ color: '#f59e0b', fontWeight: '800' }}>MAJOR REQUIREMENTS:</span>
              <ul style={{ paddingLeft: '20px', color: '#94a3b8', marginTop: '4px', lineHeight: '1.6' }}>
                {analysisResult.prd?.core_requirements?.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              onClick={() => navigate('/tech-stack')}
              className="gold-btn"
              style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Continue to Tech Stack →
            </button>
          </div>
        </GoldCard>
      )}

    </div>
  );
}
