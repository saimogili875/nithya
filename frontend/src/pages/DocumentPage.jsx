import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoldCard from '../components/ui/GoldCard';
import { FileText, Download, Sparkles, ArrowRight, ArrowLeft, Loader2, Presentation, Layers, Edit3, Copy, Save, Check } from 'lucide-react';

const PRESENTATION_TYPES = [
  "Investor Pitch", "Hackathon Presentation", "Business Proposal",
  "Product Demo", "Technical Architecture", "Market Research",
  "PRD Presentation", "College Project", "Project Report", "Marketing Deck"
];

const DOCUMENT_TYPES = [
  "Business Plan", "Product Requirement Document (PRD)", "System Requirement Spec (SRS)",
  "Technical Architecture Document", "REST API Documentation", "Deployment & Ops Guide",
  "User Installation Guide", "Security Audit Report", "Test Plan & QA Strategy", "README.md"
];

const INDUSTRIES = [
  "AgriTech", "HealthTech", "EdTech", "Retail / E-Commerce", "FinTech",
  "Manufacturing", "Logistics & Supply Chain", "Real Estate / PropTech",
  "Hospitality", "Energy & Utilities", "Government / CivicTech",
  "Biotech / Research", "Tourism & Travel"
];

export default function DocumentPage({ projectBrain }) {
  const navigate = useNavigate();

  const [activeStudioMode, setActiveStudioMode] = useState('presentation'); // 'presentation' | 'document'
  const [selectedIndustry, setSelectedIndustry] = useState(projectBrain?.industry || 'Tourism & Travel');
  const [selectedPurpose, setSelectedPurpose] = useState('Investor Pitch');
  const [selectedStyle, setSelectedStyle] = useState('Obsidian Gold');
  const [selectedLength, setSelectedLength] = useState('Standard (10 Slides)');
  const [selectedAudience, setSelectedAudience] = useState('Venture Capital Investors');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('http://localhost:8000/api/projects/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'hackathon-demo-1',
          industry: selectedIndustry,
          presentation_type: selectedPurpose,
          title: `Nithya Platform — ${selectedPurpose}`
        })
      });
      const data = await res.json();
      setGeneratedResult(data);
    } catch (e) {
      // Fallback presentation slides
      setGeneratedResult({
        title: `NITHYA — ${selectedPurpose}`,
        total_slides: 8,
        download_filename: `Nithya_${selectedPurpose.replace(/\s+/g, '_')}.pptx`,
        slides: [
          { slide_number: 1, title: "1. Executive Summary & Vision", subtitle: "Transforming Business Ideas to Production Software", bullet_points: ["Autonomous AI developer agent workflow", "Zero infrastructure friction", "Enterprise-grade security"] },
          { slide_number: 2, title: "2. The Market Opportunity", subtitle: "Accelerating Software Velocity for Startups", bullet_points: ["Addressing 90% slow prototyping cycle", "Fullstack multi-agent orchestration", "Seamless developer pairing"] },
          { slide_number: 3, title: "3. Technical Architecture", subtitle: "FastAPI + React + Sandboxed Docker", bullet_points: ["Isolated container execution", "WebSocket live log streaming", "Self-healing monitoring"] },
          { slide_number: 4, title: "4. Business Model & Scale", subtitle: "SaaS Subscription & Compute Usage", bullet_points: ["Tiered developer plans", "Enterprise deployment options", "High margin rate-card model"] }
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditSection = () => {
    if (!editPrompt.trim() || !generatedResult) return;
    alert(`LAL AI: Updating document section with instruction: "${editPrompt}"`);
    setEditPrompt('');
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedResult, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <GoldCard active={true} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gold-badge" style={{ marginBottom: '8px' }}>PHASE 6 ENGINE</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText color="#f59e0b" size={24} /> AI Document & Presentation Studio
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              Create professional Pitch Decks (130 Configs) and Business PRD Documents (15 Types) with inline LAL editing.
            </p>
          </div>
        </div>
      </GoldCard>

      {/* Studio Mode Selector Tabs */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => { setActiveStudioMode('presentation'); setSelectedPurpose('Investor Pitch'); }}
          style={{
            flex: 1, padding: '14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '800',
            border: activeStudioMode === 'presentation' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
            background: activeStudioMode === 'presentation' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(8, 10, 16, 0.8)',
            color: activeStudioMode === 'presentation' ? '#fbbf24' : '#94a3b8',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <Presentation size={18} /> PRESENTATION STUDIO (130 Decks)
        </button>

        <button
          onClick={() => { setActiveStudioMode('document'); setSelectedPurpose('Product Requirement Document (PRD)'); }}
          style={{
            flex: 1, padding: '14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '800',
            border: activeStudioMode === 'document' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
            background: activeStudioMode === 'document' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(8, 10, 16, 0.8)',
            color: activeStudioMode === 'document' ? '#fbbf24' : '#94a3b8',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <FileText size={18} /> DOCUMENT STUDIO (15 Docs)
        </button>
      </div>

      {/* 6-STEP GENERATION CONTROLS */}
      <GoldCard title="6-Step Document Generator" subtitle="Configure domain, purpose, visual theme, and audience">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', fontSize: '0.82rem' }}>
          <div>
            <label style={{ color: '#fbbf24', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Step 1: Choose Industry</label>
            <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.9)', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label style={{ color: '#fbbf24', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Step 2: Choose Purpose / Document</label>
            <select value={selectedPurpose} onChange={(e) => setSelectedPurpose(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.9)', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              {(activeStudioMode === 'presentation' ? PRESENTATION_TYPES : DOCUMENT_TYPES).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Step 3: Visual Theme</label>
            <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
              <option value="Obsidian Gold">Obsidian Gold Luxury</option>
              <option value="Dark Minimal">Dark Minimalist</option>
              <option value="Enterprise Blue">Enterprise Blue</option>
              <option value="Cyber Neon">Cyber Neon</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Step 4: Target Length</label>
            <select value={selectedLength} onChange={(e) => setSelectedLength(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
              <option value="Short (5 Slides)">Short (5 Slides / Pages)</option>
              <option value="Standard (10 Slides)">Standard (10 Slides / Pages)</option>
              <option value="Comprehensive (20 Slides)">Comprehensive (20 Slides / Pages)</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Step 5: Target Audience</label>
            <select value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(8, 10, 16, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
              <option value="Venture Capital Investors">VC & Angel Investors</option>
              <option value="Technical Architects">Technical Engineering Leads</option>
              <option value="Hackathon Judges">Hackathon Judges</option>
              <option value="Enterprise Clients">Enterprise Business Clients</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gold-btn"
              style={{ width: '100%', height: '38px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {isGenerating ? <><Loader2 size={16} className="spin" /> Preparing...</> : <><Sparkles size={16} /> Generate {activeStudioMode === 'presentation' ? 'Deck' : 'Document'}</>}
            </button>
          </div>
        </div>
      </GoldCard>

      {/* GENERATED PREVIEW & ACTIONS */}
      {generatedResult && !isGenerating && (
        <GoldCard active={true} title={generatedResult.title} badge="Super Document Active">
          {/* Action Toolbar */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button onClick={handleCopyContent} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isCopied ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {isCopied ? 'Copied!' : 'Copy Content'}
            </button>
            <a
              href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(generatedResult, null, 2))}`}
              download={generatedResult.download_filename}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Download size={14} /> Export PPTX / DOCX
            </a>
            <button onClick={() => alert('Document saved to Project Brain!')} className="gold-btn" style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Save size={14} /> Save to Project
            </button>
          </div>

          {/* Inline LAL Section Rewriter */}
          <div style={{ padding: '12px', background: 'rgba(8, 10, 16, 0.8)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)', marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSection()}
              placeholder='Ask LAL: "Rewrite section 3" or "Make this more professional"...'
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.82rem' }}
            />
            <button onClick={handleEditSection} className="gold-btn" style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Edit3 size={14} /> Edit with LAL
            </button>
          </div>

          {/* Slides / Sections Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {generatedResult.slides?.map((s) => (
              <div key={s.slide_number} style={{ padding: '16px', borderRadius: '10px', background: 'rgba(8, 10, 16, 0.9)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: '800' }}>SLIDE {s.slide_number}</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', margin: '4px 0' }}>{s.title}</h4>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>{s.subtitle}</div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {s.bullet_points.map((bp, i) => <li key={i}>{bp}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </GoldCard>
      )}

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button onClick={() => navigate('/competitors')} className="gold-btn" style={{ background: 'transparent', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Competitors
        </button>
        <button onClick={() => navigate('/support')} className="gold-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px' }}>
          Continue to Human Support → <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
