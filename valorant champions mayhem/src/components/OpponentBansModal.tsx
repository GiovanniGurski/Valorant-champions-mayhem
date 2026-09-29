import React from 'react';
import { ShieldAlert, X, Check, Lock, AlertTriangle } from 'lucide-react';
import { Player, Difficulty } from '../types';
import { RoleEmblem } from './RoleEmblem';
import { TeamLogo } from './TeamLogo';
import { ROLE_NAMES_PT } from '../data/roleIcons';
import { playSelectSound } from '../utils/audio';

interface OpponentBansModalProps {
  bannedPlayers: Player[];
  difficulty: Difficulty;
  onClose: () => void;
}

export const OpponentBansModal: React.FC<OpponentBansModalProps> = ({
  bannedPlayers,
  difficulty,
  onClose,
}) => {
  if (bannedPlayers.length === 0) return null;

  const count = bannedPlayers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded backdrop-blur-2xl bg-[#090d16]/95 border border-white/10 p-6 sm:p-8 shadow-2xl shadow-rose-950/40 overflow-hidden vct-glow-red">
        {/* Top edge illumination */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            playSelectSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-sm bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-white transition-all duration-150 border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-rose-600 to-red-500 flex items-center justify-center text-white shadow-xl shadow-rose-600/30 shrink-0 border border-white/20">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-vct text-rose-400 font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-sm bg-rose-500/10 border border-rose-500/30">
                FASE DE VETOS TÁTICOS
              </span>
              <span className="text-xs font-mono-vct text-slate-400">
                Modo {difficulty === 'master' ? 'Mestre' : difficulty === 'hard' ? 'Difícil' : 'Normal'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-vct text-white tracking-wider mt-1">
              JOGADORES BANIDOS PELO ADVERSÁRIO
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono-vct mt-1">
              O adversário analisou o meta e vetou <strong className="text-rose-400">{count} jogadores</strong>. 
              Eles <span className="underline decoration-rose-500 font-bold">não poderão</span> ser contratados nesta campanha!
            </p>
          </div>
        </div>

        {/* Banned Players Grid */}
        <div className={`grid gap-3 mb-6 ${count <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {bannedPlayers.map(p => (
            <div
              key={p.id}
              className="relative p-3.5 rounded-sm bg-[#0f172a]/70 border border-rose-500/30 shadow-inner flex flex-col justify-between overflow-hidden group hover:border-rose-400/50 transition-all"
            >
              {/* Top Ban Badge */}
              <div className="absolute top-0 right-0 bg-rose-600 text-white font-mono-vct text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-sm shadow-sm flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> BANIDO
              </div>

              <div className="flex items-center gap-2.5 mb-2 mt-1">
                <div className="w-10 h-10 rounded-sm bg-[#090d16] border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                  <TeamLogo teamName={p.team} size="sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-vct font-extrabold text-lg text-rose-200 truncate">
                    {p.ign}
                  </h4>
                  <span className="text-[10px] font-mono-vct text-slate-400 block truncate">
                    {p.name}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-vct">
                <div className="flex items-center gap-1.5">
                  <RoleEmblem role={p.primaryRole} size="xs" />
                  <span className="text-slate-300 text-[11px] font-bold">
                    {ROLE_NAMES_PT[p.primaryRole]}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {p.team} '{p.year.toString().slice(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Advice Note */}
        <div className="mb-6 p-3.5 rounded-sm bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-xs font-mono-vct text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>
            Adapte sua tática! Busque atletas alternativos com alta consistência ou traits especiais para suprir essas ausências.
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              playSelectSound();
              onClose();
            }}
            className="w-full sm:w-auto px-7 py-2.5 rounded-sm bg-gradient-to-r from-amber-500 to-[#e2b714] text-slate-950 font-vct font-extrabold text-sm tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>ENTENDIDO, INICIAR SELEÇÃO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
