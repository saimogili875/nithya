import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoldCard from '../components/ui/GoldCard';
import { Palette, ArrowRight, ArrowLeft, Loader2, Smartphone, Layout, CheckCircle2, Layers, Sparkles, Eye, Check, Cpu } from 'lucide-react';

const DESIGN_DIRECTIONS = [
  { id: 'lux-dark', name: '1. Luxury Dark', bestFor: 'High-end SaaS & AI Platforms', colors: ['#07080e', '#f59e0b', '#1e293b'], font: 'Inter / Outfit', style: 'Restrained gold borders, obsidian panels, subtle glow' },
  { id: 'min-saas', name: '2. Minimal SaaS', bestFor: 'B2B Productivity Apps', colors: ['#0f172a', '#3b82f6', '#f8fafc'], font: 'Inter', style: 'Clean grid, sharp contrast, subtle borders' },
  { id: 'enterprise', name: '3. Enterprise', bestFor: 'Financial & Corporate Systems', colors: ['#090d16', '#0284c7', '#64748b'], font: 'Roboto / Inter', style: 'Structured tables, dense data, high security' },
  { id: 'futuristic-ai', name: '4. Futuristic AI', bestFor: 'Next-gen AI & Neural Tools', colors: ['#05050a', '#8b5cf6', '#06b6d4'], font: 'Fira Code / Inter', style: 'Neon glow lines, neural network overlays' },
  { id: 'glassmorphism', name: '5. Glassmorphism', bestFor: 'Modern Creative Web Apps', colors: ['#0c0e17', 'rgba(255,255,255,0.1)', '#ec4899'], font: 'Inter', style: 'Frosted blur backdrops, translucent glass layers' },
  { id: 'neumorphism', name: '6. Neumorphism', bestFor: 'Tactile Mobile & Dashboard Interfaces', colors: ['#1e2330', '#2d3446', '#f59e0b'], font: 'Inter', style: 'Soft drop shadows, inset embossed controls' },
  { id: 'editorial', name: '7. Editorial', bestFor: 'Content, Publishing & Media', colors: ['#0a0a0c', '#f5f5f7', '#d97706'], font: 'Playfair / Georgia', style: 'Serif headings, asymmetric magazine layout' },
  { id: 'material', name: '8. Material Pro', bestFor: 'Google-standard Web Apps', colors: ['#121212', '#bb86fc', '#03dac6'], font: 'Roboto', style: 'Elevated surface cards, ripple feedback' },
  { id: 'fintech', name: '9. Modern FinTech', bestFor: 'Banking & Investment Dashboards', colors: ['#080e1a', '#10b981', '#3b82f6'], font: 'Inter', style: 'Emerald green indicators, ticker animations' },
  { id: 'healthcare', name: '10. Healthcare', bestFor: 'Medical & Telehealth Portals', colors: ['#06111e', '#0ea5e9', '#14b8a6'], font: 'System Sans', style: 'Clean accessible spacing, high contrast alerts' },
  { id: 'edtech', name: '11. EdTech', bestFor: 'Learning Systems & Courses', colors: ['#0f172a', '#f59e0b', '#8b5cf6'], font: 'Outfit', style: 'Gamified progress bars, vibrant course cards' },
  { id: 'ecommerce', name: '12. E-Commerce', bestFor: 'Stores & Marketplaces', colors: ['#09090b', '#f97316', '#f43f5e'], font: 'Inter', style: 'Grid product showcases, quick add drawers' },
  { id: 'tourism', name: '13. Tourism & Travel', bestFor: 'Travel Platforms & Guide Portals', colors: ['#06131d', '#f59e0b', '#06b6d4'], font: 'Outfit / Inter', style: 'Hero immersive imagery, interactive booking maps' },
  { id: 'government', name: '14. Government', bestFor: 'Public Services & Civic Apps', colors: ['#0a1120', '#2563eb', '#64748b'], font: 'Inter', style: 'Strict WCAG AAA compliance, multi-lingual support' },
  { id: 'startup', name: '15. Startup YC Style', bestFor: 'Pitch-ready Launchpads', colors: ['#0d0e12', '#ff5100', '#f8fafc'], font: 'Inter', style: 'Bold typography, high-velocity CTA buttons' },
  { id: 'corporate', name: '16. Premium Corporate', bestFor: 'Fortune 500 Enterprise', colors: ['#0b0f19', '#d97706', '#94a3b8'], font: 'Inter', style: 'Polished executive hierarchy, quiet luxury' },
  { id: 'brutalist', name: '17. Neo-Brutalist', bestFor: 'Web3 & Avant-garde Products', colors: ['#000000', '#fbbf24', '#000000'], font: 'Fira Code', style: 'Heavy black borders, stark contrast, retro buttons' },
  { id: 'soft-minimal', name: '18. Soft Minimal', bestFor: 'Wellness & Mindfulness Apps', colors: ['#12131a', '#e2e8f0', '#94a3b8'], font: 'Inter Light', style: 'Subtle borders, generous white space' },
  { id: 'cyber-ai', name: '19. Cyber AI', bestFor: 'Security & Developer Tooling', colors: ['#030712', '#22c55e', '#06b6d4'], font: 'Fira Code', style: 'Matrix green terminal accents, glowing status dots' },
  { id: 'apple-minimal', name: '20. Apple-like Minimal', bestFor: 'Consumer Hardware & Cloud SaaS', colors: ['#000000', '#f5f5f7', '#86868b'], font: 'SF Pro / Inter', style: 'Subtle rounded corners, smooth micro-interactions' },
  { id: 'dashboard-pro', name: '21. Dashboard Pro', bestFor: 'Analytics & Data Monitoring', colors: ['#090b14', '#f59e0b', '#3b82f6'], font: 'Inter', style: 'Multi-widget grid, customizable charts' },
  { id: '3d-interactive', name: '22. 3D Interactive', bestFor: 'Spatial & Product Preview Apps', colors: ['#050814', '#a855f7', '#f59e0b'], font: 'Outfit', style: 'Depth layers, 3D card tilt effects' },
  { id: 'motion-first', name: '23. Motion First', bestFor: 'Interactive Storytelling Apps', colors: ['#0a0c16', '#f43f5e', '#f59e0b'], font: 'Inter', style: 'Fluid page transitions, scroll animations' },
  { id: 'data-dense', name: '24. Data Dense', bestFor: 'Trading & Command Centers', colors: ['#05070f', '#06b6d4', '#10b981'], font: 'Fira Code', style: 'High density metrics, split paned layout' },
  { id: 'custom-ai', name: '25. Custom AI Design', bestFor: 'Prompt-Driven UI Generation', colors: ['#080a14', '#f59e0b', '#8b5cf6'], font: 'Dynamic AI Font', style: 'Adaptive UI generated in real-time by LAL' }
];

export default function DesignPage({ projectBrain, updateBrain }) {
  const navigate = useNavigate();

  const [selectedDirection, setSelectedDirection] = useState(projectBrain?.design_style_id || 'lux-dark');
  const [designIntelligence, setDesignIntelligence] = useState({
    model: 'Powered by Anthropic Claude 3.5 Sonnet',
    influences: [
      'User requirements & domain analysis',
      'Selected industry (Tourism & Travel)',
      'Selected architecture (FastAPI + React)',
      'WCAG AA accessibility guidelines',
      'Responsive mobile-first layout rules',
      'NITHYA Obsidian Gold Design System',
      'LAL AI recommendations'
    ]
  });

  const handleSelectDirection = (dir) => {
    setSelectedDirection(dir.id);
    if (updateBrain) {
      updateBrain({
        design_style: dir.name,
        design_style_id: dir.id
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <GoldCard active={true} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gold-badge" style={{ marginBottom: '8px' }}>PHASE 3 ENGINE</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Palette color="#f59e0b" size={24} /> UI/UX Design Directions Studio
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              Select from 25 visual design directions or refine styling interactively with LAL AI Assistant.
            </p>
          </div>
        </div>
      </GoldCard>

      {/* 25 UI/UX DESIGN DIRECTIONS GRID */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#f59e0b" /> Select UI/UX Design Direction (25 Directions)
          </h3>
          <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: '700' }}>
            Selected: {DESIGN_DIRECTIONS.find(d => d.id === selectedDirection)?.name}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
          {DESIGN_DIRECTIONS.map((dir) => {
            const isSelected = selectedDirection === dir.id;
            return (
              <GoldCard
                key={dir.id}
                active={isSelected}
                onClick={() => handleSelectDirection(dir)}
                style={{ padding: '16px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: isSelected ? '#fbbf24' : '#f8fafc' }}>
                    {dir.name}
                  </h4>
                  {isSelected && <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: '#10b981', color: '#fff', fontWeight: '800' }}>ACTIVE</span>}
                </div>

                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '10px' }}>
                  Best for: <strong>{dir.bestFor}</strong>
                </div>

                {/* Color Swatches */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  {dir.colors.map((c, i) => (
                    <div key={i} style={{ width: '22px', height: '18px', borderRadius: '4px', background: c, border: '1px solid rgba(255,255,255,0.2)' }} />
                  ))}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <div><strong>Font:</strong> {dir.font}</div>
                  <div><strong>Style:</strong> {dir.style}</div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleSelectDirection(dir); }}
                  className={isSelected ? "gold-btn" : "btn-secondary"}
                  style={{ width: '100%', marginTop: '12px', fontSize: '0.74rem', padding: '6px' }}
                >
                  {isSelected ? '✓ Selected Direction' : 'Select Direction'}
                </button>
              </GoldCard>
            );
          })}
        </div>
      </div>

      {/* DESIGN INTELLIGENCE USED */}
      <GoldCard title="Design Intelligence Used" subtitle="Architectural & AI influences active in this design system">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="gold-badge" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              <Cpu size={14} /> {designIntelligence.model}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.82rem', marginTop: '6px' }}>
            {designIntelligence.influences.map((inf, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
                <Check size={14} color="#10b981" />
                <span>{inf}</span>
              </div>
            ))}
          </div>
        </div>
      </GoldCard>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button onClick={() => navigate('/tech-stack')} className="gold-btn" style={{ background: 'transparent', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Tech Stack
        </button>
        <button onClick={() => navigate('/financial')} className="gold-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px' }}>
          Continue to Financial Estimation → <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
