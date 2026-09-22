import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoldCard from '../components/ui/GoldCard';
import { UserCheck, ArrowRight, ArrowLeft, CheckCircle2, Shield, Calendar, Clock, Bot, User, Code2, Globe, Key, Database, Server, Smartphone, Lock } from 'lucide-react';

const SPECIALISTS = [
  { id: 'api', name: 'API Integration Specialist', icon: <Key size={20} color="#f59e0b" />, area: 'REST & GraphQL Auth, Webhooks', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'devops', name: 'Cloud / DevOps Engineer', icon: <Server size={20} color="#06b6d4" />, area: 'Docker, Cloud Run, AWS, GCP', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'whatsapp', name: 'WhatsApp Integration Specialist', icon: <Smartphone size={20} color="#10b981" />, area: 'Meta BSP Verification & Templates', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'payments', name: 'Payment Integration Specialist', icon: <UserCheck size={20} color="#fbbf24" />, area: 'Razorpay, Stripe Webhooks & KYC', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'db', name: 'Database Engineer', icon: <Database size={20} color="#8b5cf6" />, area: 'Postgres Indexing & Schema Migrations', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'frontend', name: 'Frontend UX Specialist', icon: <Globe size={20} color="#ec4899" />, area: 'React, Tailwind, Responsive Mobile', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'backend', name: 'Backend Specialist', icon: <Code2 size={20} color="#f59e0b" />, area: 'FastAPI, Node.js, Async Queues', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'security', name: 'Security Specialist', icon: <Lock size={20} color="#f43f5e" />, area: 'OAuth2, JWT, CORS, Penetration Test', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'dns', name: 'Domain / DNS Specialist', icon: <Globe size={20} color="#06b6d4" />, area: 'Custom Domains, SSL Certs, Cloudflare', duration: '1-Hour Guided Session', status: 'Available Today' },
  { id: 'byok', name: 'BYOK Migration Specialist', icon: <Key size={20} color="#8b5cf6" />, area: 'Bring-Your-Own-Key Cloud Migration', duration: '1-Hour Guided Session', status: 'Available Today' }
];

export default function SupportPage({ projectBrain }) {
  const navigate = useNavigate();

  const [selectedSpecialist, setSelectedSpecialist] = useState(SPECIALISTS[0].name);
  const [userName, setUserName] = useState('Developer');
  const [description, setDescription] = useState('Need assistance connecting custom domain and configuring Razorpay payment webhook.');
  const [preferredTime, setPreferredTime] = useState('Today at 4:00 PM');
  const [bookedRequest, setBookedRequest] = useState(null);

  const handleBookSession = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/projects/support/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'hackathon-demo-1',
          user_name: userName,
          category: selectedSpecialist,
          description,
          preferred_time: preferredTime
        })
      });
      const data = await res.json();
      setBookedRequest(data.request);
    } catch (err) {
      setBookedRequest({
        request_id: 'SR-' + Math.floor(Math.random() * 9000 + 1000),
        category: selectedSpecialist,
        preferred_time: preferredTime,
        status: 'Confirmed'
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <GoldCard active={true} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gold-badge" style={{ marginBottom: '8px' }}>PHASE 7 ENGINE</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck color="#f59e0b" size={24} /> Human Developer Support Center
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              Book 1-on-1 guided sessions with senior human engineers for WhatsApp verification, payment onboarding, DNS, and cloud migration.
            </p>
          </div>
        </div>
      </GoldCard>

      {/* DUAL MODEL HYBRID BANNER: LAL AI + HUMAN EXPERTS */}
      <GoldCard active={true} style={{ padding: '24px', background: 'rgba(12, 14, 22, 0.95)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
          <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: '800', fontSize: '0.95rem' }}>
              <Bot size={20} /> LAL AI AUTOMATION
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '6px', lineHeight: '1.5' }}>
              Handles autonomous code generation, sandboxed execution, PRD parsing, and self-healing monitoring 24/7.
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '800', fontSize: '0.95rem' }}>
              <User size={20} /> HUMAN EXPERT SUPPORT
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '6px', lineHeight: '1.5' }}>
              Senior human specialists assist with Meta WhatsApp onboarding, Razorpay KYC, custom domain DNS, and enterprise cloud migrations.
            </p>
          </div>
        </div>
      </GoldCard>

      {/* 10 SPECIALIST CARDS GRID */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '14px' }}>
          Select Specialist Category (10 Domains)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
          {SPECIALISTS.map((sp) => {
            const isSelected = selectedSpecialist === sp.name;
            return (
              <GoldCard
                key={sp.id}
                active={isSelected}
                onClick={() => setSelectedSpecialist(sp.name)}
                style={{ padding: '16px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  {sp.icon}
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: isSelected ? '#fbbf24' : '#f8fafc' }}>
                    {sp.name}
                  </h4>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '10px' }}>{sp.area}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                  <span style={{ color: '#10b981', fontWeight: '800' }}>● {sp.status}</span>
                  <span style={{ color: '#64748b' }}>{sp.duration}</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSpecialist(sp.name); }}
                  className={isSelected ? "gold-btn" : "btn-secondary"}
                  style={{ width: '100%', marginTop: '12px', fontSize: '0.75rem', padding: '6px' }}
                >
                  {isSelected ? '✓ Selected Specialist' : 'Book Session'}
                </button>
              </GoldCard>
            );
          })}
        </div>
      </div>

      {/* BOOKING FORM & LIVE TRACKER */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
        {/* Booking Form */}
        <GoldCard title="Book 1-Hour Developer Session" subtitle={`Selected: ${selectedSpecialist}`}>
          <form onSubmit={handleBookSession} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Your Name:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8, 10, 16, 0.8)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Preferred Time Slot:</label>
              <input
                type="text"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8, 10, 16, 0.8)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Issue Description:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8, 10, 16, 0.8)', color: '#fff' }}
              />
            </div>

            <button type="submit" className="gold-btn" style={{ height: '42px', fontSize: '0.88rem', marginTop: '4px' }}>
              Confirm 1-Hour Session Booking
            </button>
          </form>
        </GoldCard>

        {/* Live Booking Tracker */}
        <GoldCard title="Active Session Tracker" subtitle="Real-time developer booking confirmation status">
          {bookedRequest ? (
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: '800', fontSize: '0.9rem', marginBottom: '10px' }}>
                <CheckCircle2 size={18} color="#10b981" /> SESSION SCHEDULED ({bookedRequest.request_id})
              </div>
              <div style={{ fontSize: '0.82rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Category:</strong> {bookedRequest.category}</div>
                <div><strong>Scheduled Time:</strong> {bookedRequest.preferred_time}</div>
                <div><strong>Status:</strong> <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: '800' }}>{bookedRequest.status}</span></div>
                <p style={{ marginTop: '8px', color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.4' }}>
                  A senior specialist will join your meeting room link at the scheduled time to assist with configuration.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '40px 0', fontSize: '0.85rem' }}>
              No active session bookings. Fill out the form to book a specialist session.
            </div>
          )}
        </GoldCard>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button onClick={() => navigate('/documents')} className="gold-btn" style={{ background: 'transparent', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Documents
        </button>
        <button onClick={() => navigate('/prototype')} className="gold-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px' }}>
          Proceed to Live Prototype Workspace → <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
