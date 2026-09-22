import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const PRESENTATION_TYPES = [
  "Investor Pitch", "Hackathon Presentation", "Business Proposal",
  "Product Demo", "Technical Architecture", "Market Research",
  "College Project", "Project Report", "Marketing Presentation", "Training Presentation"
];

export default function DocumentPage({ projectBrain }) {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('Hackathon Presentation');
  const [deck, setDeck] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDeck = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/api/projects/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'hackathon-demo-1',
          industry: projectBrain?.industry || 'Tourism & Travel',
          presentation_type: selectedType,
          title: `Nithya Platform — ${selectedType}`
        })
      });
      const data = await res.json();
      setDeck(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))', borderColor: '#06b6d4' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText color="#06b6d4" /> Phase 6: PPT & Document Engine
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px' }}>
          13 Industries × 10 Presentation Types = 130 Automated Template Configurations.
        </p>
      </div>

      {/* Presentation Controls */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
            Select Presentation Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.3)', background: '#121824', color: '#fff', fontSize: '0.9rem' }}
          >
            {PRESENTATION_TYPES.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
          </select>
        </div>

        <button
          onClick={handleGenerateDeck}
          disabled={isGenerating}
          className="btn-primary"
          style={{ height: '44px', marginTop: '20px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isGenerating ? <><Loader2 size={18} className="spin" /> Generating Deck...</> : <><Sparkles size={18} /> Generate Presentation Deck</>}
        </button>
      </div>

      {/* Generated Deck Viewer */}
      {deck && !isGenerating && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
              Generated Slide Deck ({deck.total_slides} Slides)
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(deck, null, 2))}`}
                download={deck.download_filename}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Download PPTX / JSON
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {deck.slides.map((s) => (
              <div key={s.slide_number} style={{ padding: '18px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 'bold' }}>SLIDE {s.slide_number}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>{s.title}</h4>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '10px' }}>{s.subtitle}</div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: '#e5e7eb' }}>
                  {s.bullet_points.map((bp, i) => <li key={i}>{bp}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <button onClick={() => navigate('/competitors')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Competitors
        </button>
        <button onClick={() => navigate('/support')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #06b6d4, #d946ef)' }}>
          Continue to Human Developer Support → <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
