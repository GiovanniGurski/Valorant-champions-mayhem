import React from 'react';
import { X, Shield, Sparkles, Trophy, Users, Zap, ShieldAlert } from 'lucide-react';
import { playSelectSound } from '../utils/audio';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative backdrop-blur-2xl bg-[#090d16]/95 border border-white/10 rounded w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 text-white shadow-2xl shadow-black/80 animate-fadeIn vct-glow-cyan">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Close */}
        <button
          onClick={() => {
            playSelectSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-sm text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all duration-150"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-sm bg-[#ff4655]/20 border border-[#ff4655]/40 flex items-center justify-center text-[#ff4655] shadow-lg shadow-[#ff4655]/20 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono-vct text-[#e2b714] font-semibold tracking-wider uppercase">
              GUIA DO JOGADOR
            </span>
            <h3 className="text-2xl sm:text-3xl font-vct text-white tracking-wider leading-none mt-0.5">
              COMO JOGAR O VCT MAYHEM
            </h3>
          </div>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm font-mono-vct text-slate-300">
          {/* Rule 1 */}
          <div className="bg-[#0f172a]/70 p-4 rounded-sm border border-white/10 shadow-sm">
            <h4 className="text-white font-bold flex items-center gap-2 text-sm mb-1.5">
              <Users className="w-4 h-4 text-[#ff4655]" />
              1. Composição de 5 Funções Obrigatórias
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Você deve escalar exatamente 5 jogadores nas posições:
              <strong className="text-slate-200"> 1 Duelista, 1 Controlador, 1 Iniciador, 1 Sentinela e 1 Flex</strong>. Jogadores só podem ser alocados em posições compatíveis com suas funções registradas.
            </p>
          </div>

          {/* Rule 2: Difficulty, Rerolls & Bans */}
          <div className="bg-[#0f172a]/70 p-4 rounded-sm border border-white/10 shadow-sm">
            <h4 className="text-white font-bold flex items-center gap-2 text-sm mb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              2. Dificuldade, Vetos de Adversários & Rerolls
            </h4>
            <div className="text-slate-400 leading-relaxed text-xs space-y-1.5">
              <div>
                <strong className="text-emerald-400">Modo Normal:</strong> 3 Rerolls de equipes, 0 jogadores banidos pelo adversário.
              </div>
              <div>
                <strong className="text-amber-400">Modo Difícil:</strong> 2 Rerolls de equipes, 3 jogadores banidos pelo adversário.
              </div>
              <div>
                <strong className="text-[#ff4655]">Modo Master:</strong> 1 Reroll apenas, 6 jogadores banidos pelo adversário.
              </div>
              <p className="text-slate-500 pt-1 text-[11px]">
                Os atletas banidos pelo adversário ficam bloqueados durante toda a campanha, exigindo adaptação tática no elenco.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-[#0f172a]/70 p-4 rounded-sm border border-white/10 shadow-sm">
            <h4 className="text-white font-bold flex items-center gap-2 text-sm mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              3. Bônus de Sinergia e Química Real
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Juntar jogadores que foram companheiros de equipe na vida real (ex: Aspas + Less da LOUD, Boaster + Alfajer da Fnatic, ou KangKang + CHICHOO da EDG) confere <strong className="text-emerald-300">+Química de Elenco</strong>, elevando a consistência e bônus táticos nas rodadas decisivas!
            </p>
          </div>

          {/* Rule 4 */}
          <div className="bg-[#0f172a]/70 p-4 rounded-sm border border-white/10 shadow-sm">
            <h4 className="text-white font-bold flex items-center gap-2 text-sm mb-1.5">
              <Trophy className="w-4 h-4 text-[#e2b714]" />
              4. Simulação do Campeonato em Ascent
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Após completar os 5 jogadores, dispute o Champions: Fase de Grupos, Quartas, Semifinais e Grande Final. O confronto é equilibrado entre o poder de clutch, sinergia tática e a emoção de viradas competitivas!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSelectSound();
            onClose();
          }}
          className="w-full mt-6 py-2.5 rounded-sm bg-[#ff4655] hover:bg-[#ff5e6c] text-white font-vct text-lg tracking-wider uppercase transition-all duration-150 shadow-xl shadow-[#ff4655]/25 hover:scale-[1.02] active:scale-95"
        >
          ENTENDI, VAMOS AO DRAFT!
        </button>
      </div>
    </div>
  );
};
