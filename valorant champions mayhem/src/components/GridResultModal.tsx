import React from 'react';
import { Trophy, CheckCircle, X, Share2, RotateCcw, ArrowRight, Award, Sparkles } from 'lucide-react';
import { GridCellState } from '../types';
import { GridPuzzle } from '../data/gridPuzzles';

interface GridResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzle: GridPuzzle;
  cells: GridCellState[][];
  totalScore: number;
  solvedCount: number;
  onRestart: () => void;
  onNextPuzzle: () => void;
  hasNextPuzzle: boolean;
  isInfiniteMode?: boolean;
  streak?: number;
}

export const GridResultModal: React.FC<GridResultModalProps> = ({
  isOpen,
  onClose,
  puzzle,
  cells,
  totalScore,
  solvedCount,
  onRestart,
  onNextPuzzle,
  hasNextPuzzle,
  isInfiniteMode = false,
  streak = 0,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const maxPossible = 540;
  const isPerfect = solvedCount === 9 && totalScore === maxPossible;

  const getRankBadge = () => {
    if (isPerfect) return { title: 'IMMACULATE GRID · RADIANTE', color: '#e2b714', desc: 'Perfeito! 9 de 9 acertos de primeira!' };
    if (totalScore >= 450) return { title: 'IMORTAL DO VCT', color: '#ff4655', desc: 'Conhecimento absurdo do cenário competitivo!' };
    if (totalScore >= 300) return { title: 'ASCENDENTE / DIAMANTE', color: '#a855f7', desc: 'Ótima leitura dos times e jogadores!' };
    if (solvedCount >= 5) return { title: 'OURO / PLATINA', color: '#38bdf8', desc: 'Bom desempenho nas principais conexões!' };
    return { title: 'PRATA / FERRO', color: '#94a3b8', desc: 'Continue praticando para dominar o VCT!' };
  };

  const rank = getRankBadge();

  const handleShare = () => {
    const text = `VCT GRID #${puzzle.number} (${puzzle.title})
Resultado: ${solvedCount}/9 células
Pontuação: ${totalScore}/${maxPossible} pts 🏆
${rank.title}
Jogue também no VALORANT Mayhem!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1624] border border-[#26374d] rounded shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-6 text-center bg-gradient-to-b from-[#162338] to-[#0e1624] border-b border-[#202f45] relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-sm hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-sm bg-gradient-to-tr from-[#e2b714] to-[#ff4655] p-0.5 shadow-xl shadow-[#e2b714]/20 mb-3 flex items-center justify-center">
            <div className="w-full h-full rounded-sm bg-[#0e1624] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-[#e2b714]" />
            </div>
          </div>

          <span
            className="text-[11px] font-mono-vct font-extrabold uppercase tracking-widest px-3 py-1 rounded-sm border inline-block mb-1"
            style={{ color: rank.color, borderColor: `${rank.color}40`, backgroundColor: `${rank.color}15` }}
          >
            {rank.title}
          </span>

          <h3 className="text-2xl font-vct text-white tracking-wide mt-1">
            Resumo do Desafio
          </h3>
          <p className="text-xs text-slate-400 mt-1">{rank.desc}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 bg-[#0a101b] border-b border-[#1b2738] text-center">
          <div className="bg-[#121c2c] p-3 rounded-sm border border-[#202d40]">
            <div className="text-2xl font-vct text-[#e2b714] font-bold">
              {totalScore} <span className="text-xs text-slate-500 font-mono-vct">/ {maxPossible}</span>
            </div>
            <div className="text-[11px] font-mono-vct text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Pontuação
            </div>
          </div>

          <div className="bg-[#121c2c] p-3 rounded-sm border border-[#202d40]">
            <div className="text-2xl font-vct text-white font-bold">
              {solvedCount} <span className="text-xs text-slate-500 font-mono-vct">/ 9</span>
            </div>
            <div className="text-[11px] font-mono-vct text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Células
            </div>
          </div>

          {isInfiniteMode && (
            <div className="bg-[#121c2c] p-3 rounded-sm border border-amber-500/30 col-span-2 sm:col-span-1 flex flex-col justify-center">
              <div className="text-2xl font-vct text-amber-400 font-bold flex items-center justify-center gap-1">
                <span>🔥</span> {streak}
              </div>
              <div className="text-[11px] font-mono-vct text-amber-300 font-semibold uppercase tracking-wider mt-0.5">
                Sequência
              </div>
            </div>
          )}
        </div>

        {/* Mini 3x3 Visual Matrix */}
        <div className="p-4 bg-[#0e1624] space-y-2">
          <span className="text-[11px] font-mono-vct text-slate-400 font-semibold tracking-wider uppercase block text-center">
            Gabarito do Seu Grid
          </span>

          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {cells.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`p-2 rounded-sm text-center border transition-all flex flex-col items-center justify-center min-h-[54px] ${
                    cell.isSolved
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#141e2e] border-[#223145] text-slate-600'
                  }`}
                >
                  {cell.isSolved && cell.player ? (
                    <>
                      <span className="text-xs font-vct font-bold text-white tracking-wide truncate max-w-full">
                        {cell.player.ign}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono-vct font-semibold">
                        +{cell.points} pts
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono-vct">—</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-5 bg-[#0a101b] border-t border-[#1b2738] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-[#1b2637] hover:bg-[#25354c] text-white text-xs font-bold transition-all border border-[#2f425c]"
            >
              <Share2 className="w-4 h-4 text-[#e2b714]" />
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-[#1b2637] hover:bg-[#25354c] text-slate-300 hover:text-white text-xs font-bold transition-all border border-[#2f425c]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar</span>
            </button>
          </div>

          {hasNextPuzzle && (
            <button
              onClick={onNextPuzzle}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-sm bg-gradient-to-r from-[#ff4655] to-[#e2b714] hover:opacity-95 text-slate-950 font-vct text-sm font-bold tracking-wider shadow-lg shadow-[#ff4655]/20 transition-all"
            >
              <span>{isInfiniteMode ? 'Continuar Sequência Infinita 🔥' : 'Jogar Próximo Grid'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
