import React from 'react';

interface KestrelLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  withSlogan?: boolean;
  lang?: 'ar' | 'en';
  className?: string;
  glow?: boolean;
}

export const KestrelLogo: React.FC<KestrelLogoProps> = ({
  size = 'md',
  withText = false,
  withSlogan = false,
  lang = 'ar',
  className = '',
  glow = true
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-lg', sub: 'text-xs' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 'w-20 h-20', text: 'text-3xl', sub: 'text-base' }
  };

  const { icon: iconClass, text: textClass, sub: subClass } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} id="kestrel-brand-emblem">
      {/* KESTREL Master Emblem: The Falcon Aegis (Shield + Falcon + Quantum Eye + Sovereign Star) */}
      <div className={`relative ${iconClass} flex-shrink-0 flex items-center justify-center`}>
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-amber-500/20 rounded-xl blur-md -z-10 animate-pulse-subtle" />
        )}

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Holographic Gradients */}
            <linearGradient id="kestrelShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="40%" stopColor="#082f49" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>

            <linearGradient id="kestrelBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <linearGradient id="kestrelFalconGrad" x1="20%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="kestrelGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <filter id="kestrelGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Sovereign Hexagonal Shield Matrix */}
          <polygon
            points="50,4 88,22 88,68 50,96 12,68 12,22"
            fill="url(#kestrelShieldGrad)"
            stroke="url(#kestrelBorderGrad)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Cybernetic Wireframe Grid Inside Shield */}
          <line x1="50" y1="4" x2="50" y2="96" stroke="#06b6d4" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="2 3" />
          <line x1="12" y1="45" x2="88" y2="45" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="2 3" />
          <polygon
            points="50,14 80,28 80,63 50,86 20,63 20,28"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="0.8"
            strokeOpacity="0.35"
          />

          {/* KESTREL Falcon Head & Wings (Aerodynamic Kinetic Strike Silhouette) */}
          {/* Left Wing (Defense sweep) */}
          <path
            d="M 50,30 L 26,44 L 32,56 L 42,48 L 38,64 L 50,56 Z"
            fill="url(#kestrelFalconGrad)"
            fillOpacity="0.85"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Right Wing (Offense/Interception sweep) */}
          <path
            d="M 50,30 L 74,44 L 68,56 L 58,48 L 62,64 L 50,56 Z"
            fill="url(#kestrelFalconGrad)"
            fillOpacity="0.85"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Falcon Crest & Crown Apex */}
          <path
            d="M 50,18 L 56,28 L 50,26 L 44,28 Z"
            fill="url(#kestrelGoldGrad)"
            stroke="#f59e0b"
            strokeWidth="1"
          />

          {/* Falcon Sharp Beak (Sub-millisecond Intercepting Point) */}
          <path
            d="M 47,38 L 53,38 L 50,47 Z"
            fill="url(#kestrelGoldGrad)"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Center Moroccan Sovereign Pentagram / Quantum Lattice Heart */}
          <path
            d="M 50,66 L 53,74 L 61,74 L 55,79 L 57,87 L 50,82 L 43,87 L 45,79 L 39,74 L 47,74 Z"
            fill="url(#kestrelGoldGrad)"
            stroke="#f59e0b"
            strokeWidth="0.9"
            strokeLinejoin="round"
            filter="url(#kestrelGlow)"
          />

          {/* The Kestrel Quantum Radar Eye (Pulsing Center of Vigilance) */}
          <circle cx="50" cy="34" r="3.2" fill="#020617" stroke="#22d3ee" strokeWidth="1.2" />
          <circle cx="50" cy="34" r="1.6" fill="#38bdf8" className="animate-ping origin-center" />
          <circle cx="50" cy="34" r="1.2" fill="#ffffff" />
        </svg>
      </div>

      {/* Typography & Slogan Block */}
      {withText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-wider text-white font-mono ${textClass} flex items-center gap-1.5`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                KESTREL
              </span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold tracking-tight">
                ACDC
              </span>
            </span>
            <span className="text-xs">🇲🇦</span>
          </div>

          <div className={`text-slate-300 font-mono tracking-wide ${subClass} flex items-center gap-1.5`}>
            <span className="text-emerald-400 font-bold">
              {lang === 'ar' ? 'منظومة كستريل للدفاع السيبراني الذاتي' : 'AUTONOMOUS CYBER DEFENSE'}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-amber-400/90 hidden sm:inline text-[10px] font-semibold">
              {lang === 'ar' ? 'بسرعة السلك ⚡' : 'Wire-Speed'}
            </span>
          </div>

          {withSlogan && (
            <div className="text-[10px] text-cyan-200/80 font-mono italic mt-0.5">
              {lang === 'ar' 
                ? '« يقظةٌ ثابتة.. وانقضاضٌ لحظي في سرعة النبض »' 
                : '“Steadfast Vigilance. Sub-Millisecond Strike.”'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
