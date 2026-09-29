import React from 'react';
import { Trophy, Award, Flame, Shield, Target, Eye, Crosshair, Zap, Star } from 'lucide-react';
import { GridCriterion } from '../data/gridPuzzles';
import { TeamLogo } from './TeamLogo';

interface GridVisualBadgeProps {
  criterion: GridCriterion;
  size?: 'sm' | 'md' | 'lg';
}

export const GridVisualBadge: React.FC<GridVisualBadgeProps> = ({ criterion, size = 'md' }) => {
  const { type, value, label } = criterion;
  const val = value.toLowerCase();

  const iconDimensions = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7 sm:w-8 sm:h-8';

  // 1. NATIONALITY / COUNTRY FLAGS (Vector SVG)
  if (type === 'nationality') {
    if (val === 'frança' || val === 'franca' || val === 'france') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md flex border border-white/20 shrink-0`}>
          <div className="w-1/3 h-full bg-[#002654]" />
          <div className="w-1/3 h-full bg-[#FFFFFF]" />
          <div className="w-1/3 h-full bg-[#CE1126]" />
        </div>
      );
    }

    if (val === 'brasil' || val === 'brazil') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md bg-[#009c3b] flex items-center justify-center p-0.5 border border-white/20 shrink-0`}>
          <svg viewBox="0 0 100 70" className="w-full h-full">
            <polygon points="50,6 93,35 50,64 7,35" fill="#ffdf00" />
            <circle cx="50" cy="35" r="16" fill="#002776" />
            <path d="M35,36 Q50,30 65,36" stroke="#ffffff" strokeWidth="2.5" fill="none" />
          </svg>
        </div>
      );
    }

    if (val === 'estados unidos' || val === 'eua' || val === 'usa') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md bg-[#b22234] border border-white/20 shrink-0 relative flex flex-col justify-between`}>
          <div className="w-full h-[14%] bg-white" />
          <div className="w-full h-[14%] bg-white" />
          <div className="w-full h-[14%] bg-white" />
          {/* Blue canton */}
          <div className="absolute top-0 left-0 w-[45%] h-[55%] bg-[#3c3b6e] flex items-center justify-center">
            <span className="text-[7px] text-white leading-none font-bold">★</span>
          </div>
        </div>
      );
    }

    if (val === 'canadá' || val === 'canada') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md flex border border-white/20 shrink-0`}>
          <div className="w-[26%] h-full bg-[#ff0000]" />
          <div className="w-[48%] h-full bg-[#ffffff] flex items-center justify-center text-[#ff0000]">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2l1.2 3.8 2.8-1-1.3 3.6 3.5.5-2.2 2.8 3.5 2-3.7 1.4.7 3.9-3.5-2.1L12 22l-1-4.1-3.5 2.1.7-3.9-3.7-1.4 3.5-2-2.2-2.8 3.5-.5-1.3-3.6 2.8 1z"/>
            </svg>
          </div>
          <div className="w-[26%] h-full bg-[#ff0000]" />
        </div>
      );
    }

    if (val === 'turquia' || val === 'turkey') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md bg-[#e30a17] flex items-center justify-center border border-white/20 shrink-0 relative`}>
          <svg viewBox="0 0 36 24" className="w-full h-full">
            <circle cx="16" cy="12" r="7" fill="#ffffff" />
            <circle cx="18" cy="12" r="5.6" fill="#e30a17" />
            <polygon points="23,12 20.2,12.8 22,14.8 21.2,12 19,10.6 21.8,11.2" fill="#ffffff" />
          </svg>
        </div>
      );
    }

    if (val === 'coreia do sul' || val === 'south korea' || val === 'korea') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md bg-white border border-slate-300 flex items-center justify-center shrink-0 relative`}>
          <svg viewBox="0 0 36 24" className="w-full h-full">
            <path d="M18,7 A5,5 0 0,1 18,17 A2.5,2.5 0 0,1 18,12 A2.5,2.5 0 0,0 18,7" fill="#cd2e3a" />
            <path d="M18,17 A5,5 0 0,1 18,7 A2.5,2.5 0 0,1 18,12 A2.5,2.5 0 0,0 18,17" fill="#0047a0" />
            <line x1="8" y1="7" x2="11" y2="10" stroke="#000" strokeWidth="1.2" />
            <line x1="25" y1="14" x2="28" y2="17" stroke="#000" strokeWidth="1.2" />
          </svg>
        </div>
      );
    }

    if (val === 'rússia' || val === 'russia') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md flex flex-col border border-white/20 shrink-0`}>
          <div className="w-full h-1/3 bg-white" />
          <div className="w-full h-1/3 bg-[#0039a6]" />
          <div className="w-full h-1/3 bg-[#d52b1e]" />
        </div>
      );
    }

    if (val === 'chile') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md flex flex-col border border-white/20 shrink-0`}>
          <div className="w-full h-1/2 flex">
            <div className="w-1/3 h-full bg-[#0039a6] flex items-center justify-center text-white text-[8px]">★</div>
            <div className="w-2/3 h-full bg-white" />
          </div>
          <div className="w-full h-1/2 bg-[#d52b1e]" />
        </div>
      );
    }

    if (val === 'argentina') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md flex flex-col border border-white/20 shrink-0`}>
          <div className="w-full h-1/3 bg-[#74acdf]" />
          <div className="w-full h-1/3 bg-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#f6b40e]" />
          </div>
          <div className="w-full h-1/3 bg-[#74acdf]" />
        </div>
      );
    }

    if (val === 'reino unido' || val === 'uk' || val === 'great britain') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md bg-[#012169] border border-white/20 shrink-0 relative flex items-center justify-center`}>
          <svg viewBox="0 0 60 36" className="w-full h-full">
            <path d="M0,0 L60,36 M60,0 L0,36" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,36 M60,0 L0,36" stroke="#c8102e" strokeWidth="2.5" />
            <path d="M30,0 V36 M0,18 H60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 V36 M0,18 H60" stroke="#c8102e" strokeWidth="6" />
          </svg>
        </div>
      );
    }

    if (val === 'finlândia' || val === 'finlandia' || val === 'finland') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md bg-white border border-slate-300 shrink-0 relative`}>
          <svg viewBox="0 0 36 24" className="w-full h-full">
            <rect x="10" y="0" width="5" height="24" fill="#003580" />
            <rect x="0" y="9.5" width="36" height="5" fill="#003580" />
          </svg>
        </div>
      );
    }

    if (val === 'espanha' || val === 'spain') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md flex flex-col border border-white/20 shrink-0`}>
          <div className="w-full h-1/4 bg-[#aa151b]" />
          <div className="w-full h-2/4 bg-[#f1bf00] flex items-center px-1">
            <div className="w-1.5 h-2 bg-[#aa151b] rounded-sm" />
          </div>
          <div className="w-full h-1/4 bg-[#aa151b]" />
        </div>
      );
    }

    if (val === 'japão' || val === 'japan') {
      return (
        <div className={`${iconDimensions} rounded-md overflow-hidden shadow-md bg-white border border-slate-300 flex items-center justify-center shrink-0`}>
          <div className="w-3.5 h-3.5 rounded-full bg-[#bc002d]" />
        </div>
      );
    }

    // Default flag badge
    return (
      <div className={`${iconDimensions} rounded-md bg-[#1e293b] border border-[#334155] flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
        {criterion.shortCode || label.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  // 2. TEAM LOGOS (High-impact esports identity icons with real logos & vector fallbacks)
  if (type === 'team') {
    return (
      <div className={`${iconDimensions} rounded-lg bg-[#070b12] border border-[#2b3a50] flex items-center justify-center shadow-lg p-0.5 overflow-hidden shrink-0`}>
        <TeamLogo
          teamName={label || value}
          size={size === 'sm' ? 20 : size === 'lg' ? 40 : 30}
          showGlow
        />
      </div>
    );
  }

  // 3. OCCASIONS & ACHIEVEMENTS
  if (type === 'achievement') {
    if (val === 'champions_winner') {
      return (
        <div className={`${iconDimensions} rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md`}>
          <Trophy className="w-5 h-5 text-amber-300 drop-shadow" />
        </div>
      );
    }
    if (val === 'international_trophy') {
      return (
        <div className={`${iconDimensions} rounded-lg bg-yellow-500/20 border border-yellow-400/50 flex items-center justify-center text-yellow-300 shadow-md`}>
          <Award className="w-5 h-5 text-yellow-300 drop-shadow" />
        </div>
      );
    }
    if (val.includes('rating')) {
      return (
        <div className={`${iconDimensions} rounded-lg bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-md`}>
          <Star className="w-5 h-5 text-purple-300 drop-shadow" />
        </div>
      );
    }
    return (
      <div className={`${iconDimensions} rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-md`}>
        <Zap className="w-5 h-5 text-emerald-300" />
      </div>
    );
  }

  // 4. ROLES
  if (type === 'role') {
    if (val === 'duelist') {
      return (
        <div className={`${iconDimensions} rounded-lg bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-400 shadow-md`}>
          <Crosshair className="w-5 h-5 text-rose-400" />
        </div>
      );
    }
    if (val === 'initiator') {
      return (
        <div className={`${iconDimensions} rounded-lg bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-400 shadow-md`}>
          <Eye className="w-5 h-5 text-purple-400" />
        </div>
      );
    }
    if (val === 'controller') {
      return (
        <div className={`${iconDimensions} rounded-lg bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 shadow-md`}>
          <Target className="w-5 h-5 text-sky-400" />
        </div>
      );
    }
    if (val === 'sentinel') {
      return (
        <div className={`${iconDimensions} rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-md`}>
          <Shield className="w-5 h-5 text-amber-400" />
        </div>
      );
    }
    // Flex
    return (
      <div className={`${iconDimensions} rounded-lg bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-400 shadow-md`}>
        <Flame className="w-5 h-5 text-teal-400" />
      </div>
    );
  }

  return (
    <div className={`${iconDimensions} rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-white`}>
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
};
