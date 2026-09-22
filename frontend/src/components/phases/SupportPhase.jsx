import React, { useState } from 'react';
import { UserCheck, Calendar, Clock, CheckCircle2, Shield } from 'lucide-react';

const CATEGORIES = [
  "API keys & Third-party Integrations",
  "WhatsApp & Messaging Setup",
  "Razorpay / Stripe Payments",
  "Custom Domain & DNS Setup",
  "Production Server & Database Hardening",
  "BYOK Credentials Migration",
  "Production Deployment & SSL"
];

export default function SupportPhase() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [userName, setUserName] = useState('Developer');
  const [description, setDescription] = useState('Need assistance connecting custom domain and configuring payment webhook.');
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
          category,
          description,
          preferred_time: preferredTime
        })
      });
      const data = await res.json();
      setBookedRequest(data.request);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(139,92,246,0.1))' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck color="#10b981" /> Phase 7: Human Developer Support Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          Book a 1-hour 1-on-1 session with a senior developer for production API keys, WhatsApp setup, Razorpay, DNS, or BYOK migration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {/* Booking Form */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '14px' }}>
            Book 1-Hour Senior Support Session
          </h3>
          <form onSubmit={handleBookSession} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Your Name:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Support Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: '#121824', color: '#fff' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Preferred Time Slot:</label>
              <input
                type="text"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Issue Description:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '8px', background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
              Confirm Developer Session Booking
            </button>
          </form>
        </div>

        {/* Booking Confirmation / Active Requests */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '14px' }}>
            Active Support Session Status
          </h3>

          {bookedRequest ? (
            <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
                <CheckCircle2 size={18} /> SESSION SCHEDULED (ID: {bookedRequest.request_id})
              </div>
              <div style={{ fontSize: '0.82rem', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Category:</strong> {bookedRequest.category}</div>
                <div><strong>Scheduled Time:</strong> {bookedRequest.preferred_time}</div>
                <div><strong>Status:</strong> <span style={{ padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 'bold' }}>{bookedRequest.status}</span></div>
                <div style={{ marginTop: '6px', color: '#9ca3af' }}>A senior engineer will join your session link at the scheduled time.</div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0', fontSize: '0.85rem' }}>
              No active support bookings. Fill out the form to request a 1-hour session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
