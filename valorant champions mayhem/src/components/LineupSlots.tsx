import React from 'react';
import { Crosshair, Cloud, Eye, Shield, Sparkles, X, UserCheck, Zap, Award } from 'lucide-react';
import { Lineup, Role, Player } from '../types';
import { calculateTeamStats } from '../utils/simulation';
import { playSelectSound } from '../utils/audio';
import { TeamLogo } from './TeamLogo';
import { RoleEmblem } from './RoleEmblem';
import { ROLE_NAMES_PT, ROLE_COLORS } from '../data/roleIcons';

interface LineupSlotsProps {
  lineup: Lineup;
  onRemovePlayer: (role: Role) => void;
  onInspectPlayer: (player: Player) => void;
  onClearLineup: () => void;
  onStartTournament: () => void;
}

const ROLE_METADATA: Record<Role, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
  Duelist: {
    label: 'Duelista',
    icon: <Crosshair className="w-3.5 h-3.5" />,
    color: '#ff4655',
    desc: 'Primeiro contato e aberturas agressivas',
  },
  Controller: {
    label: 'Controlador',
    icon: <Cloud className="w-3.5 h-3.5" />,
    color: '#38bdf8',
    desc: 'Visão de mapa, smokes e bloqueios',
  },
  Initiator: {
    label: 'Iniciador',
    icon: <Eye className="w-3.5 h-3.5" />,
    color: '#a855f7',
    desc: 'Informação, flashes e apoio tático',
  },
  Sentinel: {
    label: 'Sentinela',
    icon: <Shield className="w-3.5 h-3.5" />,
    color: '#eab308',
    desc: 'Ancoragem, armadilhas e travas defensivas',
  },
  Flex: {
    label: 'Flex',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: '#10b981',
    desc: 'Versatilidade total e adaptação',
  },
};

export const LineupSlots: React.FC<LineupSlotsProps> = ({
  lineup,
  onRemovePlayer,
  onInspectPlayer,
  onClearLineup,
  onStartTournament,
}) => {
  const roles: Role[] = ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'];
  const filledCount = roles.filter(r => lineup[r] !== null).length;
  const isComplete = filledCount === 5;
  const stats = calculateTeamStats(lineup);

  return (
    <div className="backdrop-blur-xl bg-[#0b101c]/80 rounded-2xl border border-white/10 p-4 sm:p-5 shadow-2xl shadow-black/50 relative overflow-hidden">
      {/* Subtle top edge shine */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Header with Title and Synergy bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-vct text-[#ff4655] font-semibold uppercase tracking-wider">
              ESCALAÇÃO DO CHAMPIONS
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono-vct font-bold ${
                isComplete
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/[0.06] text-slate-300 border border-white/10'
              }`}
            >
              {filledCount}/5 JOGADORES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-vct text-white tracking-wide">
            SEU ELENCO DOS SONHOS
          </h2>
        </div>

        {/* Live stats with hidden overall rating for challenging gameplay */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10"
            title="Rating confidencial - Avalie jogadores pela experiência e sinergia!"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono-vct">Força Geral</span>
              <span className="text-sm font-bold font-mono-vct text-slate-300 tracking-wider">
                {filledCount > 0 ? '?? OVR' : '--'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
            <Award className="w-4 h-4 text-[#38bdf8]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono-vct">Sinergia</span>
              <span className="text-sm font-bold font-mono-vct text-sky-300">
                {stats.synergy > 0 ? stats.synergy : '--'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
            <UserCheck className="w-4 h-4 text-rose-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono-vct">Clutch</span>
              <span className="text-sm font-bold font-mono-vct text-rose-300">
                {stats.clutch > 0 ? stats.clutch : '--'}
              </span>
            </div>
          </div>

          {filledCount > 0 && (
            <button
              id="clear-roster-btn"
              onClick={() => {
                playSelectSound();
                onClearLineup();
              }}
              className="text-xs font-mono-vct text-slate-400 hover:text-rose-400 px-2 py-1 transition-colors rounded-lg hover:bg-rose-500/10"
              title="Limpar todos os jogadores"
            >
              Resetar
            </button>
          )}
        </div>
      </div>

      {/* Synergy badges alert */}
      {stats.synergyBonuses.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {stats.synergyBonuses.map((bonus, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 text-xs bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full font-mono-vct"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{bonus}</span>
            </div>
          ))}
        </div>
      )}

      {/* 5 Slots Grid - Solid Translucent Backgrounds with Agent Silhouettes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mt-4">
        {roles.map(role => {
          const player = lineup[role];
          const meta = ROLE_METADATA[role];

          return (
            <div
              key={role}
              id={`lineup-slot-${role.toLowerCase()}`}
              className={`relative rounded-xl p-3.5 transition-all duration-300 overflow-hidden ${
                player
                  ? 'backdrop-blur-md bg-white/[0.05] border border-white/15 shadow-xl shadow-black/40 hover:border-white/25'
                  : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/15 shadow-sm group'
              }`}
            >
              {/* Role Header */}
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-1.5">
                  <span
                    className="p-1 rounded-md text-white shadow-sm"
                    style={{ backgroundColor: meta.color }}
                  >
                    {meta.icon}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider font-mono-vct text-slate-200">
                    {meta.label}
                  </span>
                </div>
                {player && (
                  <button
                    id={`remove-${role.toLowerCase()}-btn`}
                    onClick={e => {
                      e.stopPropagation();
                      playSelectSound();
                      onRemovePlayer(role);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors"
                    title="Remover jogador da escalação"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Slot Content */}
              {player ? (
                <div
                  onClick={() => {
                    playSelectSound();
                    onInspectPlayer(player);
                  }}
                  className="cursor-pointer group/card relative z-10"
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    {/* Role Tactical Emblem */}
                    <div className="shrink-0">
                      <RoleEmblem role={player.primaryRole} size="md" glow showBackground />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 justify-between">
                        <div className="flex items-center gap-1 truncate">
                          <span className="font-bold text-white text-base truncate group-hover/card:text-amber-300 transition-colors">
                            {player.ign}
                          </span>
                          {player.isChampionsWinner && (
                            <span title="Campeão do Champions" className="text-xs">🏆</span>
                          )}
                        </div>
                        <TeamLogo teamName={player.team} size="xs" />
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {player.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono-vct pt-2 border-t border-white/[0.08]">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-400 text-[11px]">Equipe:</span>
                      <span className="font-semibold text-white inline-flex items-center gap-1.5 text-[11px]">
                        <TeamLogo teamName={player.team} size="sm" />
                        {player.team} ({player.year})
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span className="text-slate-400">Função:</span>
                      <span className="font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                        {ROLE_NAMES_PT[player.primaryRole] || player.primaryRole}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-slate-400 text-[11px]">Status:</span>
                      <span className="px-2 py-0.5 bg-white/[0.06] text-slate-300 border border-white/10 rounded text-[10px] font-bold tracking-wider">
                        TITULAR
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Open Slot with Solid Translucent Background and Tactical Role Icon */
                <div className="h-28 flex flex-col justify-between p-2 relative">
                  {/* Subtle Top Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-amber-400 transition-colors" />
                    <span className="text-[9px] font-mono-vct text-slate-500 uppercase tracking-wider">
                      DISPONÍVEL
                    </span>
                  </div>

                  {/* Foreground Content */}
                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono-vct text-slate-200 font-bold tracking-wide">
                        Vaga Aberta
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {meta.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Launch Button if full */}
      {isComplete && (
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div>
            <p className="text-xs font-mono-vct text-emerald-400 font-semibold">
              ✓ ESCALAÇÃO COMPLETA & HOMOLOGADA
            </p>
            <p className="text-xs text-slate-400">
              Sua equipe possui elenco pronto com sinergias táticas homologadas para a disputa do Champions.
            </p>
          </div>
          <button
            id="start-championship-btn"
            onClick={() => {
              playSelectSound();
              onStartTournament();
            }}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#ff4655] to-[#e62234] hover:from-[#ff5e6c] hover:to-[#ff3b4e] text-white font-vct text-2xl tracking-wider rounded-xl shadow-lg shadow-[#ff4655]/40 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>INICIAR CAMPEONATO CHAMPIONS</span>
            <Award className="w-6 h-6 text-[#e2b714]" />
          </button>
        </div>
      )}
    </div>
  );
};

