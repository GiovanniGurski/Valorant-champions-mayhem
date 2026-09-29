import React from 'react';
import { RotateCcw, Crosshair, Cloud, Eye, Shield, Sparkles, Check, AlertCircle, Info } from 'lucide-react';
import { Team, Player, Lineup, Role } from '../types';
import { playSelectSound, playRerollSound } from '../utils/audio';
import { TeamLogo } from './TeamLogo';
import { RoleEmblem } from './RoleEmblem';
import { ROLE_NAMES_PT, ROLE_COLORS } from '../data/roleIcons';

interface TeamCardsDraftProps {
  availableTeams: Team[];
  lineup: Lineup;
  rerollsLeft: number;
  onReroll: () => void;
  onSelectPlayer: (player: Player) => void;
  onInspectPlayer: (player: Player) => void;
  warningMessage: string | null;
}

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  Duelist: <Crosshair className="w-3 h-3 text-[#ff4655]" />,
  Controller: <Cloud className="w-3 h-3 text-[#38bdf8]" />,
  Initiator: <Eye className="w-3 h-3 text-[#a855f7]" />,
  Sentinel: <Shield className="w-3 h-3 text-[#eab308]" />,
  Flex: <Sparkles className="w-3 h-3 text-[#10b981]" />,
};

export const TeamCardsDraft: React.FC<TeamCardsDraftProps> = ({
  availableTeams,
  lineup,
  rerollsLeft,
  onReroll,
  onSelectPlayer,
  onInspectPlayer,
  warningMessage,
}) => {
  // Check if player is already selected in lineup
  const isPlayerDrafted = (playerId: string) => {
    return Object.values(lineup).some(p => p !== null && p.id === playerId);
  };

  // Check if there is an available slot for this player
  const canDraftPlayer = (player: Player) => {
    if (isPlayerDrafted(player.id)) return false;

    // Check primary role
    if (!lineup[player.primaryRole]) return true;

    // Check Flex slot
    if (!lineup.Flex) return true;

    // Check secondary roles
    for (const secRole of player.secondaryRoles) {
      if (!lineup[secRole]) return true;
    }

    return false;
  };

  const draftedCount = Object.values(lineup).filter(p => p !== null).length;

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto my-6 space-y-5">
      {/* Draft Guidance Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#ff4655] animate-pulse" />
          <span className="text-[11px] font-mono-vct text-slate-300 font-bold tracking-widest uppercase">
            {draftedCount < 5
              ? `RODADA DE DRAFT • ESCOLHA ${draftedCount + 1} DE 5`
              : 'ELENCO COMPLETO • 5 DE 5 ESCALADOS'}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-vct text-white tracking-wide">
          {draftedCount < 5
            ? 'ESCOLHA 1 JOGADOR ENTRE AS 3 EQUIPES'
            : 'EQUIPE COMPLETA PRONTA PARA O CHAMPIONS'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {draftedCount < 5
            ? 'Ratings ocultos para o desafio tático. Avalie os jogadores pelo seu conhecimento e sinergia de elenco!'
            : 'Seus 5 titulares estão definidos. Clique em "Iniciar Simulação" acima para disputar o troféu mundial!'}
        </p>
      </div>

      {/* Warning Alert if player click is blocked */}
      {warningMessage && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono-vct animate-pulse">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* 3 Team Cards Stack with Ambient Glow and Glassmorphism */}
      <div className="w-full space-y-5">
        {availableTeams.map((team, tIdx) => {
          const teamColor = team.primaryColor || '#ff4655';

          return (
            <div key={`${team.id}-${tIdx}`} className="relative group">
              {/* Diffuse Ambient Glow using team primary color */}
              <div
                className="absolute -inset-1.5 rounded-3xl opacity-25 blur-2xl pointer-events-none transition-all duration-500 group-hover:opacity-40"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${teamColor} 0%, transparent 75%)`,
                }}
              />

              {/* Glassmorphic Team Card */}
              <div
                id={`team-card-${team.id}`}
                className="relative rounded-2xl backdrop-blur-xl bg-[#0b101c]/80 border border-white/10 p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:border-white/20"
                style={{
                  boxShadow: `0 12px 36px -12px ${teamColor}33, 0 0 0 1px rgba(255, 255, 255, 0.08)`,
                }}
              >
                {/* Subtle top edge glass shine */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {/* Team Header: Logo, Name, Year, Tag */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    {/* Glassmorphic Logo Container */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/10 shadow-inner shrink-0 overflow-hidden"
                      style={{
                        boxShadow: `inset 0 0 16px ${teamColor}22`,
                      }}
                    >
                      <TeamLogo
                        teamName={team.name}
                        shortName={team.shortName}
                        logoUrl={team.logoUrl}
                        primaryColor={team.primaryColor}
                        size="lg"
                        showGlow
                      />
                    </div>

                    {/* Name & Region */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-2xl sm:text-3xl font-vct text-white tracking-wider leading-none">
                          {team.name.toUpperCase()}
                        </h4>
                        <span className="text-[10px] font-mono-vct px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/10">
                          {team.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs font-mono-vct font-bold"
                          style={{ color: teamColor }}
                        >
                          {team.year}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          • {team.editionLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Color Indicator Dot */}
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: teamColor, boxShadow: `0 0 8px ${teamColor}` }}
                    />
                    <span className="text-[10px] font-mono-vct text-slate-400 uppercase">
                      {team.shortName}
                    </span>
                  </div>
                </div>

                {/* 5 Players Roster: Role-focused with official tactical emblems */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-3 border-t border-white/[0.06]">
                  {team.roster.map(player => {
                    const drafted = isPlayerDrafted(player.id);
                    const draftable = canDraftPlayer(player);
                    const roleColor = ROLE_COLORS[player.primaryRole] || '#ff4655';

                    return (
                      <div
                        key={player.id}
                        id={`player-chip-${player.id}`}
                        className={`group/player relative p-2.5 rounded-xl border transition-all duration-200 flex sm:flex-col items-center sm:items-stretch gap-2.5 ${
                          drafted
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-65'
                            : draftable
                            ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/25 hover:shadow-lg cursor-pointer'
                            : 'bg-black/30 border-white/[0.04] opacity-35 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (drafted) return;
                          if (!draftable) {
                            onInspectPlayer(player);
                            return;
                          }
                          playSelectSound();
                          onSelectPlayer(player);
                        }}
                      >
                        {/* Role Function Emblem */}
                        <div className="relative shrink-0 self-center">
                          <RoleEmblem
                            role={player.primaryRole}
                            size="lg"
                            showBackground={true}
                            glow={draftable}
                            className="group-hover/player:scale-110 transition-transform"
                          />
                        </div>

                        {/* Player Details: Name and Role */}
                        <div className="min-w-0 flex-1 sm:text-center">
                          <div className="flex items-center sm:justify-center gap-1">
                            <span className="text-sm font-bold text-white group-hover/player:text-amber-300 transition-colors truncate">
                              {player.ign}
                            </span>
                            {player.isChampionsWinner && (
                              <span title="Campeão do Champions" className="text-xs">🏆</span>
                            )}
                            {drafted && (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-auto sm:ml-0" />
                            )}
                          </div>

                          <div className="flex items-center justify-between sm:justify-center gap-1.5 text-[11px] mt-1">
                            <span
                              className="truncate font-semibold text-[11px] uppercase tracking-wider font-mono-vct"
                              style={{ color: roleColor }}
                            >
                              {ROLE_NAMES_PT[player.primaryRole] || player.primaryRole}
                            </span>
                            <span
                              className="text-[9px] font-mono-vct px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-400 border border-white/[0.08]"
                              title="Rating oculto para modo desafiante"
                            >
                              ??
                            </span>
                          </div>
                        </div>

                        {/* Info trigger */}
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            playSelectSound();
                            onInspectPlayer(player);
                          }}
                          className="text-slate-500 hover:text-white p-1 transition-colors self-center sm:self-center shrink-0"
                          title="Ver Detalhes do Jogador"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* REROLL Button Area */}
      <div className="flex flex-col items-center pt-2">
        <button
          id="reroll-teams-btn"
          disabled={rerollsLeft <= 0}
          onClick={() => {
            playRerollSound();
            onReroll();
          }}
          className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-vct text-xl tracking-widest uppercase transition-all shadow-lg ${
            rerollsLeft > 0
              ? 'bg-gradient-to-b from-[#ff4655] to-[#c21a28] hover:from-[#ff5e6c] hover:to-[#e02434] text-white border border-white/20 shadow-[#ff4655]/25 transform active:scale-95'
              : 'bg-white/[0.04] text-slate-500 border border-white/[0.06] cursor-not-allowed'
          }`}
        >
          <RotateCcw className={`w-4 h-4 ${rerollsLeft > 0 ? 'text-white' : 'text-slate-500'}`} />
          <span>REROLL</span>
        </button>
        <span className="text-xs font-mono-vct font-semibold text-slate-400 mt-1.5 tracking-wider">
          {rerollsLeft} restantes
        </span>
      </div>
    </div>
  );
};

