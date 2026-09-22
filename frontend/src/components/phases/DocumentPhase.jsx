import React, { useState } from 'react';
import { FileText, Download, Sparkles, Presentation } from 'lucide-react';

const PRESENTATION_TYPES = [
  "Investor Pitch", "Hackathon Presentation", "Business Proposal",
  "Product Demo", "Technical Architecture", "Market Research",
  "College Project", "Project Report", "Marketing Presentation", "Training Presentation"
];

export default function DocumentPhase({ industry = "Tourism & Travel" }) {
  const [selectedType, setSelectedType] = useState('Hackathon Presentation');
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateDeck = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/projects/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'hackathon-demo-1',
          industry,
          presentation_type: selectedType,
          title: `Nithya Platform — ${selectedType}`
        })
      });
      const data = await res.json();
      setDeck(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(6,182,212,0.1))' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText color="#ec4899" /> Phase 6: PPT & Document Generation Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          AI presentation generator supporting 13 Industries × 10 Presentation Types with a modular PresentationProvider interface.
        </p>
      </div>

      {/* Presentation Type Dropdown & Generator */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
            Select Presentation Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.3)',
              background: '#121824', color: '#fff', fontSize: '0.9rem'
            }}
          >
            {PRESENTATION_TYPES.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateDeck}
          disabled={loading}
          className="btn-primary"
          style={{ height: '42px', marginTop: '20px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={16} /> Generate Presentation Deck
        </button>
      </div>

      {/* Slide Deck Inspector */}
      {deck && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>
              Generated Slide Deck ({deck.total_slides} Slides)
            </h3>
            <a
              href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(deck, null, 2))}`}
              download={deck.download_filename}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Download Slide Deck JSON
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {deck.slides.map((s) => (
              <div key={s.slide_number} style={{ padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 'bold' }}>SLIDE {s.slide_number}</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>{s.title}</h4>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '8px' }}>{s.subtitle}</div>
                <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: '#e5e7eb' }}>
                  {s.bullet_points.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
