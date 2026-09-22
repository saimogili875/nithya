import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoldCard from '../components/ui/GoldCard';
import { DollarSign, Server, Database, Cpu, MessageSquare, ArrowRight, ArrowLeft, ShieldCheck, Check, AlertCircle, CreditCard, ExternalLink } from 'lucide-react';

const SERVICE_CATEGORIES = [
  { id: 'compute', name: 'SERVER / COMPUTE', options: [
    { name: 'GCP Cloud Run', cost: 15, unit: '/mo' },
    { name: 'Railway App', cost: 10, unit: '/mo' },
    { name: 'AWS ECS Container', cost: 35, unit: '/mo' },
    { name: 'Render VPS', cost: 12, unit: '/mo' }
  ]},
  { id: 'db', name: 'DATABASE & CACHE', options: [
    { name: 'Managed PostgreSQL', cost: 25, unit: '/mo' },
    { name: 'Supabase Postgres', cost: 15, unit: '/mo' },
    { name: 'MongoDB Atlas', cost: 20, unit: '/mo' },
    { name: 'Redis Cache', cost: 10, unit: '/mo' }
  ]},
  { id: 'storage', name: 'STORAGE & ASSETS', options: [
    { name: 'Google Cloud Storage', cost: 8, unit: '/mo' },
    { name: 'AWS S3 Bucket', cost: 10, unit: '/mo' },
    { name: 'Cloudflare R2 (0 egress)', cost: 3, unit: '/mo' }
  ]},
  { id: 'ai', name: 'AI & LLM MODELS', options: [
    { name: 'Gemini 1.5 Flash / Pro', cost: 20, unit: '/mo' },
    { name: 'Anthropic Claude 3.5', cost: 35, unit: '/mo' },
    { name: 'Groq Llama 3 Hardware', cost: 15, unit: '/mo' }
  ]},
  { id: 'comm', name: 'COMMUNICATION APIs', options: [
    { name: 'WhatsApp Business API', cost: 25, unit: '/mo' },
    { name: 'Twilio SMS & OTP', cost: 15, unit: '/mo' },
    { name: 'Resend Transactional Email', cost: 10, unit: '/mo' }
  ]},
  { id: 'payments', name: 'PAYMENT GATEWAY', options: [
    { name: 'Razorpay India Gateway', cost: 15, unit: '/mo' },
    { name: 'Stripe Global Payments', cost: 20, unit: '/mo' },
    { name: 'Cashfree Payments', cost: 12, unit: '/mo' }
  ]},
  { id: 'maps', name: 'MAPS & LOCATION', options: [
    { name: 'Google Maps API', cost: 20, unit: '/mo' },
    { name: 'Mapbox Navigation', cost: 15, unit: '/mo' }
  ]},
  { id: 'monitoring', name: 'MONITORING & LOGS', options: [
    { name: 'Sentry Error Tracking', cost: 26, unit: '/mo' },
    { name: 'Better Stack Uptime', cost: 15, unit: '/mo' }
  ]}
];

export default function FinancialPage({ projectBrain }) {
  const navigate = useNavigate();

  const [selectedServices, setSelectedServices] = useState({
    compute: 'GCP Cloud Run',
    db: 'Managed PostgreSQL',
    storage: 'Cloudflare R2 (0 egress)',
    ai: 'Anthropic Claude 3.5',
    comm: 'WhatsApp Business API',
    payments: 'Razorpay India Gateway',
    maps: 'Google Maps API',
    monitoring: 'Sentry Error Tracking'
  });

  const [scaleTier, setScaleTier] = useState('medium');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getScaleMultiplier = () => {
    if (scaleTier === 'small') return 0.6;
    if (scaleTier === 'large') return 2.8;
    return 1.0;
  };

  const calculateTotal = () => {
    let sum = 0;
    SERVICE_CATEGORIES.forEach(cat => {
      const activeOptionName = selectedServices[cat.id];
      const foundOpt = cat.options.find(o => o.name === activeOptionName);
      if (foundOpt) sum += foundOpt.cost;
    });
    return Math.round(sum * getScaleMultiplier());
  };

  const totalCost = calculateTotal();

  const handleSelectService = (catId, optName) => {
    setSelectedServices(prev => ({ ...prev, [catId]: optName }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Header Banner */}
      <GoldCard active={true} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(10, 12, 20, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gold-badge" style={{ marginBottom: '8px' }}>PHASE 4 ENGINE</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign color="#f59e0b" size={24} /> Financial & Infrastructure Service Center
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              Select cloud infrastructure, database, AI models, payment gateways, and monitoring providers for live cost estimation.
            </p>
          </div>
        </div>
      </GoldCard>

      {/* Scale Tier Selector & Total Card */}
      <GoldCard active={true} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Select User Scale Tier:</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['small', 'medium', 'large'].map((tier) => (
              <button
                key={tier}
                onClick={() => setScaleTier(tier)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  border: scaleTier === tier ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  background: scaleTier === tier ? 'rgba(245, 158, 11, 0.25)' : 'rgba(8, 10, 16, 0.8)',
                  color: scaleTier === tier ? '#fbbf24' : '#94a3b8'
                }}
              >
                {tier === 'small' ? 'Small Startup (~100 users)' : tier === 'medium' ? 'Medium Scale (~1,000 users)' : 'Enterprise (~100k users)'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total Estimated Monthly Cost</div>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fbbf24', fontFamily: 'monospace' }}>
            ${totalCost} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ mo</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '800' }}>
            Est. Annual: ${(totalCost * 12).toLocaleString()}
          </div>
        </div>
      </GoldCard>

      {/* SERVICE SELECTION CENTER GRID */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '14px' }}>
          Service Provider Selection (8 Categories)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {SERVICE_CATEGORIES.map((cat) => (
            <GoldCard key={cat.id} title={cat.name} style={{ padding: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {cat.options.map((opt) => {
                  const isSelected = selectedServices[cat.id] === opt.name;
                  return (
                    <div
                      key={opt.name}
                      onClick={() => handleSelectService(cat.id, opt.name)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                        background: isSelected ? 'rgba(245, 158, 11, 0.18)' : 'rgba(8, 10, 16, 0.7)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: isSelected ? '5px solid #f59e0b' : '1px solid #64748b' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? '800' : '500', color: isSelected ? '#f8fafc' : '#94a3b8' }}>
                          {opt.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'monospace' }}>
                        ${Math.round(opt.cost * getScaleMultiplier())} {opt.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GoldCard>
          ))}
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>
        "Estimates only. Actual provider pricing and usage bandwidth may vary based on deployment region."
      </div>

      {/* PAYMENT & PRODUCTION FLOW TRIGGER */}
      <GoldCard style={{ background: 'rgba(12, 14, 22, 0.95)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#f8fafc' }}>Ready to deploy to production?</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Configure payment gateway or proceed in sandboxed demo mode.</p>
        </div>
        <button onClick={() => setShowPaymentModal(true)} className="gold-btn" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
          Continue to Production →
        </button>
      </GoldCard>

      {/* PAYMENT NOT CONFIGURED MODAL */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <GoldCard active={true} style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '12px' }}>
              <AlertCircle size={24} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>Payment Gateway Status</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '20px' }}>
              Payment gateway is not currently configured for live billing. You can connect Razorpay credentials or proceed seamlessly in Demo Mode.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => alert('Razorpay Onboarding Portal opened in settings!')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                <CreditCard size={16} /> Configure Razorpay Gateway
              </button>
              <button onClick={() => { setShowPaymentModal(false); navigate('/competitors'); }} className="gold-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                Continue in Demo Mode →
              </button>
            </div>
          </GoldCard>
        </div>
      )}

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button onClick={() => navigate('/design')} className="gold-btn" style={{ background: 'transparent', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Design
        </button>
        <button onClick={() => navigate('/competitors')} className="gold-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px' }}>
          Continue to Competitor Intelligence → <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
