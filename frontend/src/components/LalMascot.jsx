import React from 'react';

export default function LalMascot({ width = 70, height = 70 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Robot Antenna */}
      <rect x="56" y="10" width="8" height="16" rx="4" fill="#3b82f6" />
      <circle cx="60" cy="8" r="7" fill="#06b6d4" />
      <circle cx="60" cy="8" r="3" fill="#fff" />

      {/* Head Outer */}
      <rect x="25" y="24" width="70" height="50" rx="16" fill="url(#headGrad)" stroke="#3b82f6" strokeWidth="2.5" />

      {/* Face Screen */}
      <rect x="33" y="32" width="54" height="34" rx="10" fill="#090d1a" stroke="#06b6d4" strokeWidth="1.5" />

      {/* Glowing Eyes */}
      <circle cx="48" cy="48" r="7" fill="#06b6d4" />
      <circle cx="48" cy="48" r="3" fill="#fff" />
      
      <circle cx="72" cy="48" r="7" fill="#06b6d4" />
      <circle cx="72" cy="48" r="3" fill="#fff" />

      {/* Cute Smile */}
      <path d="M54 58 Q60 63 66 58" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />

      {/* Body */}
      <path d="M35 78 C35 74, 85 74, 85 78 L80 108 C80 112, 40 112, 40 108 Z" fill="url(#bodyGrad)" stroke="#3b82f6" strokeWidth="2" />

      {/* Chest Badge LAL ❤️ */}
      <rect x="44" y="84" width="32" height="14" rx="5" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1" />
      <text x="60" y="94" fontSize="9" fontWeight="bold" fill="#ec4899" textAnchor="middle">LAL ❤️</text>

      {/* Robot Arms */}
      <path d="M26 80 L14 92" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="14" cy="92" r="4" fill="#06b6d4" />
      
      <path d="M94 80 L106 92" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="106" cy="92" r="4" fill="#06b6d4" />

      <defs>
        <linearGradient id="headGrad" x1="25" y1="24" x2="95" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="35" y1="78" x2="85" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
