import React from 'react';

export default function GoldCard({ children, title, subtitle, badge, style, onClick, active = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active 
          ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.12), rgba(14, 16, 24, 0.95))' 
          : 'rgba(14, 16, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '14px',
        border: active 
          ? '1px solid rgba(245, 158, 11, 0.7)' 
          : '1px solid rgba(245, 158, 11, 0.25)',
        boxShadow: active
          ? '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(245, 158, 11, 0.35)'
          : '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 10px rgba(245, 158, 11, 0.12)',
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      className="gold-card-container"
    >
      {/* Subtle Gold Header Highlight Accent */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: active 
            ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)' 
            : 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), transparent)'
        }} 
      />

      {(title || badge) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: subtitle ? '4px' : '12px' }}>
          {title && <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.3px' }}>{title}</h3>}
          {badge && (
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              {badge}
            </span>
          )}
        </div>
      )}

      {subtitle && (
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px', lineHeight: '1.4' }}>{subtitle}</p>
      )}

      {children}
    </div>
  );
}
