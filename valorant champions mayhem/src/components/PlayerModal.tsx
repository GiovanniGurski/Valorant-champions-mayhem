import React from 'react';
import { X, Award, Crosshair, CheckCircle, Zap, Sparkles } from 'lucide-react';
import { Player, Lineup, Role } from '../types';
import { playLockSound, playSelectSound } from '../utils/audio';
import { TeamLogo } from './TeamLogo';
import { RoleEmblem } from './RoleEmblem';
import { TraitBadge } from './TraitBadge';
import { ROLE_NAMES_PT } from '../data/roleIcons';

interface PlayerModalProps {
  player: Player | null;
  lineup: Lineup;
  onClose: () => void;
  onAssignToRole: (player: Player, role: Role) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  lineup,
  onClose,
  onAssignToRole,
}) => {
  if (!player) return null;

  // Determine which roles this player can fit into
  const availableSlots: Role[] = [];
  const isCurrentlyIn = Object.entries(lineup).find(([_, p]) => p?.id === player.id)?.[0] as Role | undefined;

  if (!isCurrentlyIn) {
    if (!lineup[player.primaryRole]) availableSlots.push(player.primaryRole);
    if (!lineup.Flex) availableSlots.push('Flex');
    for (const sec of player.secondaryRoles) {
      if (!lineup[sec] && !availableSlots.includes(sec)) availableSlots.push(sec);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative rounded backdrop-blur-2xl bg-[#090d16]/95 border border-white/10 w-full max-w-lg p-6 sm:p-7 shadow-2xl shadow-black/90 text-white animate-fadeIn overflow-hidden vct-glow-red">
        {/* Subtle glass line at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => {
            playSelectSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-sm text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all duration-150"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="shrink-0">
            <RoleEmblem role={player.primaryRole} size="xl" glow showBackground />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-vct px-2.5 py-0.5 rounded-sm bg-white/[0.06] text-amber-300 font-semibold border border-white/10">
                {player.country} ({player.countryCode})
              </span>
              {player.isChampionsWinner && (
                <span className="text-xs font-mono-vct px-2.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold">
                  <Award className="w-3.5 h-3.5" /> Campeão VCT
                </span>
              )}
            </div>
            <h3 className="text-3xl sm:text-4xl font-vct text-white tracking-wider leading-none mt-1">
              {player.ign}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono-vct">
              <span>{player.name}</span>
              <span className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 text-slate-300">
                <TeamLogo teamName={player.team} size="xs" />
                {player.team} ({player.year})
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-amber-300 font-semibold">
                {ROLE_NAMES_PT[player.primaryRole] || player.primaryRole}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Attributes Bar Grid with Hidden Rating */}
        <div className="bg-[#0f172a]/70 rounded-sm p-4 sm:p-5 border border-white/10 mb-5 space-y-3 shadow-inner">
          <div className="flex justify-between items-center text-xs font-mono-vct">
            <span className="text-slate-400">Rating Geral:</span>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-sm border border-amber-400/25">
              ?? OVR (Oculto no Draft)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-2 text-xs font-mono-vct">
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Consistência:</span>
                <span className="text-white font-bold">{player.consistency}</span>
              </div>
              <div className="w-full bg-white/10 rounded-sm h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-sky-400 h-full rounded-sm transition-all duration-500" style={{ width: `${player.consistency}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400">
                <span>Clutch (Sangue Frio):</span>
                <span className="text-amber-300 font-bold">{player.clutch}</span>
              </div>
              <div className="w-full bg-white/10 rounded-sm h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-sm transition-all duration-500" style={{ width: `${player.clutch}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400">
                <span>Sinergia de Equipe:</span>
                <span className="text-emerald-300 font-bold">{player.synergy}</span>
              </div>
              <div className="w-full bg-white/10 rounded-sm h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-sm transition-all duration-500" style={{ width: `${player.synergy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400">
                <span>Flexibilidade:</span>
                <span className="text-purple-300 font-bold">{player.flexibility}</span>
              </div>
              <div className="w-full bg-white/10 rounded-sm h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-purple-400 h-full rounded-sm transition-all duration-500" style={{ width: `${player.flexibility}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Special Player Trait Display */}
        {player.trait ? (
          <div className="mb-5 bg-[#0e1625] p-4 rounded-sm border border-white/10 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono-vct font-bold text-slate-300 uppercase tracking-wider">
                  Trait Especial
                </span>
              </div>
              <span
                className="text-[10px] font-mono-vct uppercase px-2 py-0.5 rounded-sm font-bold"
                style={{
                  color: player.trait.color,
                  backgroundColor: player.trait.badgeBg,
                  border: `1px solid ${player.trait.badgeBorder}`,
                }}
              >
                Raridade: {player.trait.rarity.toUpperCase()}
              </span>
            </div>
            <TraitBadge trait={player.trait} size="md" showDescription={true} />
          </div>
        ) : (
          <div className="mb-5 px-3.5 py-2.5 rounded-sm bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono-vct text-slate-400">
            <span>Trait de Jogador:</span>
            <span className="text-slate-500 italic">Padrão do Cenário (Sem Bônus/Penalidade)</span>
          </div>
        )}

        {/* Roles & Agents metadata */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono-vct mb-6">
          <div className="bg-[#0f172a]/70 p-3.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block mb-1">Função Principal:</span>
            <span className="text-white font-bold text-sm flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-[#ff4655]" />
              {player.primaryRole}
            </span>
            {player.secondaryRoles.length > 0 && (
              <span className="text-[11px] text-slate-400 block mt-1">
                Secundárias: {player.secondaryRoles.join(', ')}
              </span>
            )}
          </div>

          <div className="bg-[#0f172a]/70 p-3.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block mb-1">Agente Assinatura:</span>
            <span className="text-amber-300 font-bold text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              {player.signatureAgent}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Champions: {player.championsYears.join(', ')}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isCurrentlyIn ? (
            <div className="w-full py-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-mono-vct text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Já escalado na posição: {isCurrentlyIn}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="space-y-2">
              <span className="text-xs font-mono-vct text-slate-400 block">
                Selecione uma vaga disponível para recrutar {player.ign}:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => {
                      playLockSound();
                      onAssignToRole(player, slot);
                      onClose();
                    }}
                    className="flex-1 py-2.5 px-4 rounded-sm bg-[#ff4655] hover:bg-[#ff5e6c] text-white font-vct text-lg tracking-wider transition-all duration-150 text-center shadow-lg shadow-[#ff4655]/30 hover:scale-105 active:scale-95"
                  >
                    Escalar como {slot}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full py-3 rounded-sm bg-[#0f172a] border border-white/10 text-slate-400 text-center font-mono-vct text-xs">
              Todas as funções compatíveis com este jogador já estão preenchidas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
