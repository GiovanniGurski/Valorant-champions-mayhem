import React from 'react';
import { PlayerTrait } from '../types';
import { Sparkles, Shield, Zap, Flame, AlertTriangle, Snowflake, Shuffle } from 'lucide-react';

interface TraitBadgeProps {
  trait?: PlayerTrait;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  showDescription?: boolean;
  showShortEffect?: boolean;
}

export const TraitBadge: React.FC<TraitBadgeProps> = ({
  trait,
  size = 'sm',
  iconOnly = false,
  showDescription = false,
  showShortEffect = false,
}) => {
  if (!trait) return null;

  const isLegendary = trait.rarity === 'legendary';
  const isEpic = trait.rarity === 'epic';

  const getIcon = (iconClass: string) => {
    switch (trait.id) {
      case 'final_boss':
        return <Sparkles className={`${iconClass} text-amber-300 animate-spin-slow`} />;
      case 'ice_in_the_veins':
        return <Snowflake className={`${iconClass} text-sky-300`} />;
      case 'first_blood_king':
        return <Zap className={`${iconClass} text-rose-400`} />;
      case 'natural_synergy':
        return <Shield className={`${iconClass} text-emerald-300`} />;
      case 'clutch_master':
        return <Flame className={`${iconClass} text-purple-300`} />;
      case 'choke_artist':
        return <AlertTriangle className={`${iconClass} text-orange-400`} />;
      case 'tilted':
        return <AlertTriangle className={`${iconClass} text-rose-400`} />;
      case 'inconsistent':
        return <Shuffle className={`${iconClass} text-slate-300`} />;
      default:
        return <Sparkles className={`${iconClass} text-amber-300`} />;
    }
  };

  // If iconOnly mode is requested, render just the clean icon badge
  if (iconOnly) {
    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    }[size];

    const containerSizes = {
      xs: 'w-5 h-5 p-0.5',
      sm: 'w-6 h-6 p-1',
      md: 'w-7 h-7 p-1.5',
      lg: 'w-8 h-8 p-1.5',
    }[size];

    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg border transition-all shrink-0 cursor-help ${containerSizes} ${
          isLegendary
            ? 'animate-pulse shadow-sm shadow-amber-400/40 ring-1 ring-amber-400/50'
            : isEpic
            ? 'shadow-sm shadow-sky-400/30 ring-1 ring-sky-400/30'
            : ''
        }`}
        style={{
          color: trait.color,
          backgroundColor: trait.badgeBg,
          borderColor: trait.badgeBorder,
        }}
        title={`${trait.name} (${trait.rarity.toUpperCase()}): Clique no botão de Info (i) para ver os detalhes completos.`}
      >
        {getIcon(iconSizes)}
      </span>
    );
  }

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1 font-bold',
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 font-bold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-extrabold',
  }[size];

  const iconSizeClass = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center rounded-full font-mono-vct tracking-wider uppercase border transition-all ${sizeClasses} ${
          isLegendary ? 'animate-pulse shadow-sm shadow-amber-400/30' : ''
        }`}
        style={{
          color: trait.color,
          backgroundColor: trait.badgeBg,
          borderColor: trait.badgeBorder,
        }}
        title={`${trait.name}: ${trait.description}`}
      >
        {getIcon(iconSizeClass)}
        <span>{trait.badgeLabel}</span>
      </span>

      {showShortEffect && trait.shortEffect && (
        <span
          className="text-[10px] font-mono-vct font-semibold px-1.5 py-0.5 rounded border bg-white/[0.04]"
          style={{ color: trait.color, borderColor: `${trait.color}40` }}
        >
          {trait.shortEffect}
        </span>
      )}

      {showDescription && (
        <div className="w-full text-[11px] font-mono-vct text-slate-300 bg-white/[0.04] p-3 rounded-lg border border-white/10 space-y-1.5 mt-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs" style={{ color: trait.color }}>
              {trait.name}
            </span>
            {trait.shortEffect && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/[0.08]" style={{ color: trait.color }}>
                {trait.shortEffect}
              </span>
            )}
          </div>
          <p className="font-medium text-slate-200">
            {trait.description}
          </p>
          <p className="text-[10px] text-slate-400 italic pt-0.5 border-t border-white/[0.06]">
            "{trait.flavorText}"
          </p>
        </div>
      )}
    </div>
  );
};
