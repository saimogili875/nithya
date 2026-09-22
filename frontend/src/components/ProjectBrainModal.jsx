import React from 'react';
import { X, Brain, Cpu, FileCode, CheckSquare, Layers } from 'lucide-react';

export default function ProjectBrainModal({ isOpen, onClose, brainData }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto', padding: '24px', background: '#121824', borderColor: 'rgba(6, 182, 212, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={20} color="#06b6d4" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>PROJECT BRAIN Inspector</h2>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Persistent project memory & context architecture</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {brainData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 'bold' }}>PROJECT PURPOSE</span>
              <p style={{ color: '#e5e7eb', marginTop: '4px' }}>{brainData.purpose || 'Autonomous AI Web Application'}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 'bold' }}>TECH STACK</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {(brainData.tech_stack || []).map((tech, i) => (
                  <span key={i} style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f3f4f6', fontSize: '0.78rem' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 'bold' }}>PROJECT FILES INDEX ({brainData.files?.length || 0})</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {(brainData.files || []).map((f, i) => (
                  <span key={i} style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.1)', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 'bold' }}>PROJECT RULES & CONSTRAINTS</span>
              <ul style={{ paddingLeft: '18px', marginTop: '4px', color: '#9ca3af' }}>
                {(brainData.project_rules || []).map((rule, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>Loading Project Brain context...</div>
        )}
      </div>
    </div>
  );
}
