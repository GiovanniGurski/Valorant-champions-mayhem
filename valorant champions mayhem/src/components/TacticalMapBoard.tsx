import React from 'react';
import { Lineup, Role, Player } from '../types';
import { RoleEmblem } from './RoleEmblem';
import { ROLE_NAMES_PT, ROLE_COLORS } from '../data/roleIcons';
import { TeamLogo } from './TeamLogo';
import { calculateTeamStats } from '../utils/simulation';
import { playSelectSound } from '../utils/audio';
import { TraitBadge } from './TraitBadge';
import { Trophy, X, RotateCcw, Lock, Sparkles } from 'lucide-react';

interface TacticalMapBoardProps {
  lineup: Lineup;
  onRemovePlayer: (role: Role) => void;
  onInspectPlayer: (player: Player) => void;
  onClearLineup: () => void;
  onStartTournament: () => void;
}

interface NodePosition {
  role: Role;
  label: string;
  siteCallout: string;
  // Percentage coordinates relative to Ascent map
  style: React.CSSProperties;
}

// 5 tactical positions calibrated to Ascent map floorplan:
// - Duelist: Site A
// - Initiator: A Main
// - Controller: Mid Link
// - Sentinel: Site B
// - Flex: B Main
const MAP_POSITIONS: NodePosition[] = [
  {
    role: 'Duelist',
    label: 'Duelista',
    siteCallout: 'Site A',
    style: { top: '23%', left: '33%' },
  },
  {
    role: 'Initiator',
    label: 'Iniciador',
    siteCallout: 'A Main',
    style: { top: '27%', left: '73%' },
  },
  {
    role: 'Controller',
    label: 'Controlador',
    siteCallout: 'Mid Link',
    style: { top: '49%', left: '48%' },
  },
  {
    role: 'Sentinel',
    label: 'Sentinela',
    siteCallout: 'Site B',
    style: { top: '78%', left: '33%' },
  },
  {
    role: 'Flex',
    label: 'Flex',
    siteCallout: 'B Main',
    style: { top: '74%', left: '73%' },
  },
];

export const TacticalMapBoard: React.FC<TacticalMapBoardProps> = ({
  lineup,
  onRemovePlayer,
  onInspectPlayer,
  onClearLineup,
  onStartTournament,
}) => {
  const stats = calculateTeamStats(lineup);
  const filledCount = Object.values(lineup).filter(p => p !== null).length;
  const isComplete = filledCount === 5;

  return (
    <div className="w-full flex flex-col h-full rounded backdrop-blur-xl bg-[#0b101b]/90 border border-white/10 shadow-2xl shadow-black/80 overflow-hidden relative select-none vct-glow-cyan">
      {/* Subtle top edge illumination */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none" />

      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-[#090d16]/95 border-b border-white/[0.08] flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-vct font-extrabold text-sm sm:text-base uppercase tracking-widest text-white">
            MAPA TÁTICO · ASCENT
          </span>
          <span className="text-[10px] font-mono-vct px-2 py-0.5 rounded-sm bg-white/[0.06] text-cyan-300 border border-cyan-400/25 font-bold">
            5 POSIÇÕES
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono-vct text-slate-400">
            Escalação: <span className="text-amber-400 font-bold">{filledCount}/5</span>
          </div>
          {filledCount > 0 && (
            <button
              onClick={() => {
                playSelectSound();
                onClearLineup();
              }}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-all duration-150 px-2 py-1 rounded-sm hover:bg-white/[0.05] border border-transparent hover:border-white/10"
              title="Limpar todas as posições"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map Stage: Ascent Floorplan */}
      <div className="relative flex-1 min-h-[440px] sm:min-h-[480px] max-h-[520px] bg-[#070b14] overflow-hidden flex items-center justify-center">
        {/* Scenic Ascent Atmospheric Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-[2px] pointer-events-none scale-105"
          style={{ backgroundImage: 'url(/ascent-splash.png)' }}
        />

        {/* Dark Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(11,16,27,0.3)_0%,_#070b14_85%)] pointer-events-none" />

        {/* Map Header Title */}
        <div className="absolute top-3 inset-x-0 flex flex-col items-center pointer-events-none z-10">
          <div className="w-5 h-5 mb-0.5 text-cyan-400/90">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,15 90,85 10,85" fill="none" stroke="currentColor" strokeWidth="8" />
              <polygon points="50,32 75,76 25,76" fill="currentColor" opacity="0.4" />
              <circle cx="50" cy="60" r="10" fill="currentColor" />
            </svg>
          </div>

          <h3 className="text-xl sm:text-2xl font-vct font-black tracking-[0.25em] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            ASCENT
          </h3>
          <span className="text-[9px] font-mono-vct uppercase tracking-[0.3em] text-slate-400/80 -mt-0.5">
            COMPETITIVO · TÁTICO
          </span>
        </div>

        {/* Ascent Minimap Container */}
        <div className="relative w-[340px] h-[340px] sm:w-[390px] sm:h-[390px] flex items-center justify-center">
          {/* Minimap Image */}
          <img
            src="/ascent-minimap.png"
            alt="Ascent Minimap"
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,0,0,0.95)] opacity-85 select-none pointer-events-none"
            loading="eager"
          />

          {/* Site A Callout Badge */}
          <div className="absolute top-[17%] left-[30%] -translate-x-1/2 pointer-events-none">
            <div className="px-2 py-0.5 rounded-sm bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-mono-vct font-bold text-emerald-300 uppercase tracking-wider backdrop-blur-md shadow-md">
              Site A
            </div>
          </div>

          {/* Site B Callout Badge */}
          <div className="absolute top-[72%] left-[30%] -translate-x-1/2 pointer-events-none">
            <div className="px-2 py-0.5 rounded-sm bg-amber-500/20 border border-amber-400/40 text-[9px] font-mono-vct font-bold text-amber-300 uppercase tracking-wider backdrop-blur-md shadow-md">
              Site B
            </div>
          </div>

          {/* Mid Courtyard Badge */}
          <div className="absolute top-[43%] left-[48%] -translate-x-1/2 pointer-events-none">
            <div className="px-2 py-0.5 rounded-sm bg-sky-500/20 border border-sky-400/40 text-[8px] font-mono-vct font-semibold text-sky-300 uppercase tracking-wider backdrop-blur-md shadow-md">
              Mid
            </div>
          </div>

          {/* 5 Tactical Nodes */}
          {MAP_POSITIONS.map(({ role, label, siteCallout, style }) => {
            const player = lineup[role];
            const roleColor = ROLE_COLORS[role] || '#ff4655';

            return (
              <div
                key={role}
                style={style}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200"
              >
                {player ? (
                  /* Filled Node */
                  <div className="group relative flex flex-col items-center">
                    {/* Quick Remove Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        playSelectSound();
                        onRemovePlayer(role);
                      }}
                      title={`Remover ${player.ign}`}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-125 z-30"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>

                    {/* Circular Token with Glow Aura & Prominent Team Crest */}
                    <div
                      onClick={() => {
                        playSelectSound();
                        onInspectPlayer(player);
                      }}
                      className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-[#080e18] border-[2.5px] shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-200 group-hover:scale-115 relative p-2"
                      style={{
                        borderColor: roleColor,
                        boxShadow: `0 0 22px ${roleColor}80, inset 0 0 14px rgba(0,0,0,0.85)`,
                      }}
                    >
                      {/* Inner Team Logo (High impact, large & prominent) */}
                      <div className="w-full h-full flex items-center justify-center">
                        <TeamLogo teamName={player.team} size={42} showGlow className="w-full h-full" />
                      </div>

                      {/* Mini Role Emblem in Corner */}
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#060b13] border-2 flex items-center justify-center shadow-lg"
                        style={{ borderColor: roleColor }}
                      >
                        <RoleEmblem role={player.primaryRole} size="xs" />
                      </div>
                    </div>

                    {/* Compact Attached Straight Badge (IGN + Team + Role) */}
                    <div
                      onClick={() => {
                        playSelectSound();
                        onInspectPlayer(player);
                      }}
                      className="mt-1.5 px-2.5 py-1 rounded-sm backdrop-blur-md bg-[#09101b]/95 border border-white/20 text-center shadow-xl cursor-pointer group-hover:border-amber-400/80 transition-colors flex flex-col items-center min-w-[90px] max-w-[120px]"
                    >
                      <span className="text-xs font-vct font-extrabold text-white tracking-wide truncate max-w-[95px] group-hover:text-amber-300">
                        {player.ign}
                      </span>
                      {player.trait && (
                        <span
                          className="text-[7px] font-mono-vct font-black px-1 rounded-sm uppercase tracking-tighter my-0.5"
                          style={{
                            color: player.trait.color,
                            backgroundColor: player.trait.badgeBg,
                            border: `1px solid ${player.trait.badgeBorder}`,
                          }}
                        >
                          {player.trait.badgeLabel}
                        </span>
                      )}
                      <div className="flex items-center gap-1 my-0.5">
                        <TeamLogo teamName={player.team} size="xs" />
                        <span className="text-[8px] font-mono-vct font-semibold text-slate-300 uppercase tracking-tight truncate max-w-[70px]">
                          {player.team}
                        </span>
                      </div>
                      <span
                        className="text-[8px] font-mono-vct font-bold uppercase tracking-wider"
                        style={{ color: roleColor }}
                      >
                        {ROLE_NAMES_PT[role]}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Empty Node */
                  <div className="flex flex-col items-center group cursor-pointer">
                    {/* Pulsing Empty Circle */}
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#070d17]/85 border-2 border-dashed flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-[#0c1524] shadow-lg backdrop-blur-md"
                      style={{ borderColor: `${roleColor}99` }}
                      title={`Vaga Aberta: ${label} (${siteCallout})`}
                    >
                      <div className="opacity-75 group-hover:opacity-100 transition-opacity scale-110">
                        <RoleEmblem role={role} size="sm" />
                      </div>
                    </div>

                    {/* Compact Straight Label */}
                    <div className="mt-1 px-2 py-0.5 rounded-sm bg-[#070b13]/90 border border-white/10 text-center shadow-sm">
                      <span
                        className="text-[9px] font-mono-vct font-bold uppercase tracking-wider block"
                        style={{ color: roleColor }}
                      >
                        {ROLE_NAMES_PT[role]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Lineup Traits Bar */}
      {(() => {
        const draftedWithTraits = Object.values(lineup).filter((p): p is Player => !!p?.trait);
        if (draftedWithTraits.length === 0) return null;
        return (
          <div className="px-5 py-2 bg-[#09101b]/95 border-t border-white/[0.08] flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-vct font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Traits Ativos ({draftedWithTraits.length}):
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {draftedWithTraits.map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 bg-[#101927] px-2 py-0.5 rounded-sm border border-amber-400/30 shadow-md"
                  title={`${p.ign} (${p.team}): Trait ${p.trait?.name} (${p.trait?.rarity.toUpperCase()}) - ${p.trait?.description}`}
                >
                  <TeamLogo teamName={p.team} size="xs" />
                  <span className="text-xs font-vct font-bold text-white">{p.ign}</span>
                  <TraitBadge trait={p.trait} iconOnly size="xs" />
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Bottom Summary Bar & Start Tournament CTA with straight corners */}
      <div className="px-5 py-3.5 bg-[#09101a]/95 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-5 w-full sm:w-auto justify-around sm:justify-start">
          {/* Overall Rating is hidden during Draft */}
          <div>
            <div className="text-[10px] font-mono-vct text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Rating Geral</span>
            </div>
            <div className="text-sm font-vct font-bold text-amber-300/80 mt-0.5">
              <span>Oculto no Draft</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-white/10" />

          {/* Tactical Synergy */}
          <div>
            <div className="text-[10px] font-mono-vct text-slate-400 uppercase tracking-wider">
              Sinergia
            </div>
            <div className="text-lg font-vct font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="font-mono-vct">{stats.synergy ? `+${stats.synergy}` : '0'}</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          <div className="w-[1px] h-8 bg-white/10" />

          {/* Status */}
          <div>
            <div className="text-[10px] font-mono-vct text-slate-400 uppercase tracking-wider">
              Status
            </div>
            <div className="text-xs font-mono-vct font-bold text-slate-300 mt-1">
              {isComplete ? (
                <span className="text-emerald-400 flex items-center gap-1">5/5 Prontos</span>
              ) : (
                <span className="text-amber-400">{filledCount}/5 Escalados</span>
              )}
            </div>
          </div>
        </div>

        {/* Start Tournament Action Button with straight corners */}
        {isComplete ? (
          <button
            id="start-tournament-btn"
            onClick={() => {
              playSelectSound();
              onStartTournament();
            }}
            className="w-full sm:w-auto px-7 py-2.5 rounded-sm bg-gradient-to-r from-[#ff4655] to-[#f59e0b] hover:opacity-95 text-slate-950 font-vct font-black text-sm tracking-wider shadow-xl shadow-[#ff4655]/30 flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 animate-pulse"
          >
            <Trophy className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>INICIAR TORNEIO VCT</span>
          </button>
        ) : (
          <div className="text-xs font-mono-vct text-slate-400 text-center sm:text-right">
            Preencha os 5 agentes táticos em Ascent
          </div>
        )}
      </div>
    </div>
  );
};
