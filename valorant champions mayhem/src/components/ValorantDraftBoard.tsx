import React, { useState } from 'react';
import { Team, Player, Lineup, Role } from '../types';
import { RoleEmblem } from './RoleEmblem';
import { ROLE_NAMES_PT, ROLE_COLORS } from '../data/roleIcons';
import { TeamLogo } from './TeamLogo';
import { TacticalMapBoard } from './TacticalMapBoard';
import { TraitBadge } from './TraitBadge';
import { isPlayerBanned } from '../utils/bans';
import { playSelectSound, playRerollSound } from '../utils/audio';
import { RotateCcw, ArrowLeft, Sparkles, AlertCircle, Info, ChevronRight, UserCheck, ShieldAlert, Lock, Ban } from 'lucide-react';

interface ValorantDraftBoardProps {
  availableTeams: Team[];
  lineup: Lineup;
  rerollsLeft: number;
  bannedPlayers?: Player[];
  onOpenBansModal?: () => void;
  onReroll: () => void;
  onSelectPlayer: (player: Player) => void;
  onInspectPlayer: (player: Player) => void;
  onRemovePlayer: (role: Role) => void;
  onClearLineup: () => void;
  onStartTournament: () => void;
  warningMessage: string | null;
}

export const ValorantDraftBoard: React.FC<ValorantDraftBoardProps> = ({
  availableTeams,
  lineup,
  rerollsLeft,
  bannedPlayers = [],
  onOpenBansModal,
  onReroll,
  onSelectPlayer,
  onInspectPlayer,
  onRemovePlayer,
  onClearLineup,
  onStartTournament,
  warningMessage,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [localWarning, setLocalWarning] = useState<string | null>(null);

  const filledCount = Object.values(lineup).filter(p => p !== null).length;
  const currentRound = Math.min(5, filledCount + 1);
  const isLineupFull = filledCount === 5;

  const isPlayerDrafted = (playerId: string) => {
    return Object.values(lineup).some(p => p?.id === playerId);
  };

  // Determine which slot a player would fill
  const getDestinationSlot = (player: Player): { role: Role | null; label: string; available: boolean } => {
    if (isPlayerBanned(player, bannedPlayers)) {
      return { role: null, label: 'Banido pelo Adversário', available: false };
    }
    if (isPlayerDrafted(player.id)) {
      return { role: null, label: 'Já Escalado', available: false };
    }
    if (!lineup[player.primaryRole]) {
      return { role: player.primaryRole, label: `Escalar ${ROLE_NAMES_PT[player.primaryRole]}`, available: true };
    }
    if (!lineup.Flex) {
      return { role: 'Flex', label: 'Escalar Flex', available: true };
    }
    for (const sec of player.secondaryRoles) {
      if (!lineup[sec]) {
        return { role: sec, label: `Escalar ${ROLE_NAMES_PT[sec]}`, available: true };
      }
    }
    return { role: null, label: 'Vaga Ocupada', available: false };
  };

  const handleChoosePlayer = (player: Player) => {
    if (isPlayerBanned(player, bannedPlayers)) {
      setLocalWarning(`🚫 ${player.ign} foi banido pelo adversário e não pode ser contratado nesta campanha!`);
      setTimeout(() => setLocalWarning(null), 3500);
      return;
    }
    onSelectPlayer(player);
    setSelectedTeam(null);
  };

  const activeWarning = warningMessage || localWarning;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Top Banner: Opponent Bans Active notification */}
      {bannedPlayers.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 rounded backdrop-blur-xl bg-gradient-to-r from-rose-950/40 via-[#0d1424]/80 to-rose-950/40 border border-rose-500/30 text-xs font-mono-vct shadow-2xl shadow-rose-950/20 relative overflow-hidden">
          {/* Subtle crimson corner glow */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2.5 flex-wrap z-10">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-rose-500/20 text-rose-300 font-extrabold uppercase tracking-wider border border-rose-500/40">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Vetos do Adversário ({bannedPlayers.length}):
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {bannedPlayers.map(bp => (
                <span
                  key={bp.id}
                  className="px-2 py-0.5 rounded-sm bg-[#090d16]/90 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1.5 line-through hover:border-rose-400 transition-colors"
                  title={`${bp.ign} (${bp.team}) - Vetado`}
                >
                  <Ban className="w-3 h-3 text-rose-400 shrink-0" />
                  <TeamLogo teamName={bp.team} size="xs" />
                  {bp.ign}
                  <span className="text-slate-500 text-[9px] no-underline font-normal">({bp.team})</span>
                </span>
              ))}
            </div>
          </div>

          {onOpenBansModal && (
            <button
              onClick={() => {
                playSelectSound();
                onOpenBansModal();
              }}
              className="px-3 py-1 rounded-sm bg-rose-500/15 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-bold text-xs self-end sm:self-auto transition-all duration-150 hover:scale-105 z-10"
            >
              Ver Detalhes dos Vetos
            </button>
          )}
        </div>
      )}

      {/* Warning notification */}
      {activeWarning && (
        <div className="flex items-center gap-2.5 p-3 rounded-sm backdrop-blur-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-vct shadow-xl animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{activeWarning}</span>
        </div>
      )}

      {/* Main Two-Column Layout (Dark Mode Glassmorphism with straight tactical corners) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Draft Selection Panel */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col rounded backdrop-blur-xl bg-[#0b101b]/80 border border-white/10 shadow-2xl shadow-black/70 p-5 sm:p-6 relative overflow-hidden vct-glow-red">
          {/* Subtle Top-edge light highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {/* Header Indicator */}
          <div className="text-center pb-4 mb-4 border-b border-white/[0.08] relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-xs font-mono-vct font-bold uppercase tracking-widest mb-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>ROUND {currentRound} / 5</span>
              {isLineupFull && <span className="text-emerald-400">· ELENCO COMPLETO</span>}
            </div>

            <h2 className="text-2xl sm:text-3xl font-vct font-black tracking-wider text-white uppercase mt-0.5">
              {selectedTeam ? 'ESCOLHA SEU JOGADOR' : 'SELECIONE UM TIME'}
            </h2>

            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {selectedTeam
                ? `Analise as traits, estatísticas e funções dos atletas da ${selectedTeam.name}`
                : 'Analise os elencos, traits e bônus táticos para montar seu time'}
            </p>
          </div>

          {/* Body Content: State 1 (Select a Team) vs State 2 (Choose Your Player) */}
          <div className="flex-1 flex flex-col justify-between relative z-10">
            {!selectedTeam ? (
              /* State 1: 3 Team Cards + REROLL Button */
              <div className="flex flex-col gap-4">
                <div className="space-y-3.5">
                  {availableTeams.map((team, idx) => {
                    const primaryColor = team.primaryColor || '#ff4655';
                    const traitsCount = team.roster.filter(p => !!p.trait).length;

                    return (
                      <div
                        key={`${team.id}-${idx}`}
                        onClick={() => {
                          playSelectSound();
                          setSelectedTeam(team);
                        }}
                        className="group relative rounded-sm backdrop-blur-md bg-[#0f172a]/60 hover:bg-[#131d33]/80 border border-white/10 hover:border-[#ff4655]/50 p-4 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-[0_10px_30px_-5px_rgba(255,70,85,0.15)] transform hover:-translate-y-0.5"
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: primaryColor,
                        }}
                      >
                        {/* Soft interior highlight */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Team Identity */}
                          <div className="flex items-center gap-3.5">
                            <div className="w-13 h-13 rounded-sm bg-[#090d16] border border-white/15 flex items-center justify-center p-2 shrink-0 group-hover:border-[#ff4655]/50 group-hover:scale-105 transition-all shadow-inner">
                              <TeamLogo teamName={team.name} size="md" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-vct font-extrabold text-white tracking-wide group-hover:text-amber-300 transition-colors">
                                  {team.name}
                                </h3>
                                <span className="text-[11px] font-mono-vct text-slate-300 bg-white/[0.06] px-2 py-0.5 rounded-sm border border-white/10 font-bold">
                                  {team.year}
                                </span>
                                {traitsCount > 0 && (
                                  <span className="text-[10px] font-mono-vct font-bold px-2 py-0.5 rounded-sm bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-sm">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    {traitsCount} Trait{traitsCount > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-vct mt-0.5">
                                <span>{team.region}</span>
                                <span className="text-slate-600">·</span>
                                <span>Champions {team.year}</span>
                              </div>
                            </div>
                          </div>

                          {/* 5 Roster Players Chips */}
                          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] text-xs">
                            {team.roster.map(player => {
                              const drafted = isPlayerDrafted(player.id);
                              const banned = isPlayerBanned(player, bannedPlayers);

                              return (
                                <div
                                  key={player.id}
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (banned) {
                                      setLocalWarning(`🚫 ${player.ign} foi banido pelo adversário nesta campanha!`);
                                      setTimeout(() => setLocalWarning(null), 3000);
                                      return;
                                    }
                                    handleChoosePlayer(player);
                                  }}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm transition-all duration-150 ${
                                    banned
                                      ? 'text-rose-400 bg-rose-950/40 border border-rose-500/30 line-through opacity-70 cursor-not-allowed'
                                      : drafted
                                      ? 'text-emerald-400 bg-emerald-500/10 line-through'
                                      : player.trait
                                      ? 'text-amber-200 bg-amber-500/15 border border-amber-400/40 shadow-sm hover:border-amber-300 hover:scale-[1.02]'
                                      : 'text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/5'
                                  }`}
                                  title={
                                    banned
                                      ? `${player.ign} - BANIDO PELO ADVERSÁRIO`
                                      : `${player.ign} (${ROLE_NAMES_PT[player.primaryRole]})${player.trait ? ` - Trait: ${player.trait.name}` : ''}`
                                  }
                                >
                                  <RoleEmblem role={player.primaryRole} size="xs" />
                                  <span className="font-semibold truncate max-w-[70px]">{player.ign}</span>
                                  {banned ? (
                                    <span className="text-[8px] font-mono-vct font-black text-rose-400 bg-rose-500/20 px-1 py-0.2 rounded-sm shrink-0">
                                      BAN
                                    </span>
                                  ) : player.trait ? (
                                    <TraitBadge trait={player.trait} iconOnly size="xs" />
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Subtle interactive indicator footer */}
                        <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono-vct text-slate-400 group-hover:text-amber-300 transition-colors">
                          <span>Ver traits e estatísticas dos atletas</span>
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform text-amber-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* LoLdle-Style Golden Reroll Button (Straight Edges) */}
                <div className="pt-2 flex flex-col items-center">
                  <button
                    id="draft-reroll-btn"
                    onClick={() => {
                      playRerollSound();
                      onReroll();
                    }}
                    disabled={rerollsLeft <= 0}
                    className={`px-7 py-2.5 rounded-sm font-vct font-extrabold text-sm tracking-widest uppercase transition-all duration-200 flex items-center gap-2.5 shadow-xl ${
                      rerollsLeft > 0
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-400/20 border border-amber-400/60 text-amber-300 hover:bg-amber-400 hover:text-slate-950 hover:shadow-amber-500/30 hover:scale-105 active:scale-95'
                        : 'bg-white/[0.03] border border-white/10 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className={`w-4 h-4 ${rerollsLeft > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
                    <span>REROLL TIMES ({rerollsLeft})</span>
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono-vct mt-2">
                    {rerollsLeft > 0
                      ? 'Sorteia 3 novos times caso nenhum atenda sua estratégia'
                      : 'Sem rerolls restantes nesta dificuldade'}
                  </span>
                </div>
              </div>
            ) : (
              /* State 2: Selected Team Roster (5 Players with straight cards) */
              <div className="flex flex-col gap-3.5">
                {/* Back to 3 Teams Navigation Button */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <button
                    onClick={() => {
                      playSelectSound();
                      setSelectedTeam(null);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono-vct text-slate-300 hover:text-white transition-all duration-150 border border-white/10"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar aos 3 times</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-sm bg-[#090d16] border border-white/15 flex items-center justify-center p-1 shadow-sm">
                      <TeamLogo teamName={selectedTeam.name} size="sm" />
                    </div>
                    <span className="text-sm sm:text-base font-vct font-bold text-amber-300 tracking-wider">
                      {selectedTeam.name} ({selectedTeam.year})
                    </span>
                  </div>
                </div>

                {/* 5 Players Detailed Selection List */}
                <div className="space-y-3">
                  {selectedTeam.roster.map(player => {
                    const drafted = isPlayerDrafted(player.id);
                    const banned = isPlayerBanned(player, bannedPlayers);
                    const slotInfo = getDestinationSlot(player);
                    const roleColor = ROLE_COLORS[player.primaryRole] || '#ff4655';

                    return (
                      <div
                        key={player.id}
                        onClick={() => {
                          if (banned) {
                            setLocalWarning(`🚫 ${player.ign} foi banido pelo adversário nesta campanha!`);
                            setTimeout(() => setLocalWarning(null), 3000);
                            return;
                          }
                          if (slotInfo.available) {
                            handleChoosePlayer(player);
                          }
                        }}
                        className={`group relative rounded-sm backdrop-blur-md p-3.5 flex flex-col gap-2 transition-all duration-200 border ${
                          banned
                            ? 'border-rose-500/40 bg-rose-950/20 opacity-80 cursor-not-allowed'
                            : drafted
                            ? 'opacity-60 border-emerald-500/30 bg-emerald-950/10 cursor-not-allowed'
                            : player.trait && slotInfo.available
                            ? 'border-amber-400/50 bg-gradient-to-r from-amber-500/[0.1] via-[#0f172a]/70 to-[#0b101b]/80 hover:border-amber-300 hover:bg-[#131d33] cursor-pointer hover:-translate-y-0.5 shadow-xl shadow-amber-500/10'
                            : slotInfo.available
                            ? 'border-white/10 hover:border-[#ff4655]/50 bg-[#0f172a]/60 hover:bg-[#131d33]/80 cursor-pointer hover:-translate-y-0.5 shadow-lg'
                            : 'border-white/[0.06] bg-white/[0.02] opacity-70 cursor-not-allowed'
                        }`}
                      >
                        {/* Top Row: Info + Action Button */}
                        <div className="flex items-center justify-between gap-3">
                          {/* Player Left Info: Role emblem + IGN */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="shrink-0">
                              <RoleEmblem role={player.primaryRole} size="lg" showBackground glow={slotInfo.available && !banned} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`text-lg font-vct font-extrabold truncate ${banned ? 'text-rose-300 line-through' : player.trait ? 'text-amber-200' : 'text-white group-hover:text-amber-300 transition-colors'}`}>
                                  {player.ign}
                                </h4>
                                {player.trait && !banned && (
                                  <TraitBadge trait={player.trait} iconOnly size="sm" />
                                )}
                                {banned && (
                                  <span className="flex items-center gap-1 text-[10px] font-mono-vct font-extrabold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-sm border border-rose-500/30">
                                    <Lock className="w-3 h-3" />
                                    BANIDO
                                  </span>
                                )}
                                {!banned && drafted && (
                                  <span className="flex items-center gap-1 text-[10px] font-mono-vct font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-sm border border-emerald-500/30">
                                    <UserCheck className="w-3 h-3" />
                                    ESCALADO
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-xs mt-0.5">
                                <span
                                  className="font-mono-vct font-bold text-[11px] uppercase tracking-wider"
                                  style={{ color: roleColor }}
                                >
                                  {ROLE_NAMES_PT[player.primaryRole]}
                                </span>
                                <span className="text-slate-600">·</span>
                                <span className="text-slate-400 font-mono-vct text-[11px] bg-white/[0.05] px-2 py-0.5 rounded-sm border border-white/10 inline-flex items-center gap-1.5">
                                  <TeamLogo teamName={player.team} size="xs" />
                                  <span>{player.team} · '{player.year.toString().slice(2)}</span>
                                </span>
                                <span className="text-slate-500 text-[11px] hidden sm:inline truncate">
                                  {player.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Player Right Action / Inspect */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                playSelectSound();
                                onInspectPlayer(player);
                              }}
                              title={player.trait ? `Trait Ativa: ${player.trait.name} (Clique para ver detalhes)` : 'Ver atributos e estatísticas'}
                              className={`p-2 rounded-sm transition-all duration-150 border ${
                                player.trait
                                  ? 'bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border-amber-400/50 shadow-sm'
                                  : 'bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border-white/10'
                              }`}
                            >
                              <Info className="w-4 h-4" />
                            </button>

                            {banned ? (
                              <span className="px-3 py-1 rounded-sm bg-rose-500/15 border border-rose-500/30 text-rose-400 font-vct font-bold text-xs uppercase tracking-wider">
                                BANIDO
                              </span>
                            ) : slotInfo.available ? (
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleChoosePlayer(player);
                                }}
                                className="px-3.5 py-1.5 rounded-sm bg-[#ff4655]/20 hover:bg-[#ff4655] hover:text-white border border-[#ff4655]/60 text-slate-100 font-vct font-extrabold text-xs tracking-wider uppercase transition-all duration-150 shadow-md hover:shadow-[#ff4655]/30 hover:scale-105 active:scale-95"
                              >
                                <span>{slotInfo.label}</span>
                              </button>
                            ) : (
                              <span className="text-xs font-mono-vct text-slate-500 px-2 py-1">
                                {slotInfo.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tactical Map Board (Lineup & Synergy) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col">
          <TacticalMapBoard
            lineup={lineup}
            onRemovePlayer={onRemovePlayer}
            onInspectPlayer={onInspectPlayer}
            onClearLineup={onClearLineup}
            onStartTournament={onStartTournament}
          />
        </div>
      </div>
    </div>
  );
};
