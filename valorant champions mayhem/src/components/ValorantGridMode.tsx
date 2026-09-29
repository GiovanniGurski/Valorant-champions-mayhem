import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, HelpCircle, RotateCcw, ChevronRight, ChevronLeft, Check, Sparkles, AlertCircle, Info, Eye, Layers, Flame, Dices, Zap } from 'lucide-react';
import { GridCellState, Player } from '../types';
import { GRID_PUZZLES, GridPuzzle, GridCriterion, playerMatchesCriterion } from '../data/gridPuzzles';
import { generateInfiniteGridPuzzle } from '../data/infiniteGridGenerator';
import { PLAYERS_DATABASE } from '../data/teamsAndPlayers';
import { GridPlayerSearchModal } from './GridPlayerSearchModal';
import { GridResultModal } from './GridResultModal';
import { GridVisualBadge } from './GridVisualBadge';
import { PlayerAvatar } from './PlayerAvatar';
import { TeamLogo } from './TeamLogo';
import { playSelectSound } from '../utils/audio';

export const ValorantGridMode: React.FC = () => {
  const [gameMode, setGameMode] = useState<'infinite' | 'classic'>('infinite');

  // Classic mode index
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  // Infinite mode state
  const [infiniteRound, setInfiniteRound] = useState(1);
  const [infiniteStreak, setInfiniteStreak] = useState<number>(() => {
    const saved = localStorage.getItem('vct_grid_infinite_streak');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [bestStreak, setBestStreak] = useState<number>(() => {
    const saved = localStorage.getItem('vct_grid_best_streak');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [infinitePuzzle, setInfinitePuzzle] = useState<GridPuzzle>(() => generateInfiniteGridPuzzle(1));

  // Current active puzzle based on mode
  const puzzle: GridPuzzle = gameMode === 'infinite'
    ? infinitePuzzle
    : (GRID_PUZZLES[currentPuzzleIndex] || GRID_PUZZLES[0]);

  // Helper to create empty 3x3 cells
  const createEmptyCells = (): GridCellState[][] =>
    Array(3)
      .fill(null)
      .map((_, r) =>
        Array(3)
          .fill(null)
          .map((_, c) => ({
            row: r,
            col: c,
            player: null,
            isSolved: false,
            points: 60,
            wrongGuessesCount: 0,
          }))
      );

  // 3x3 cells state
  const [cells, setCells] = useState<GridCellState[][]>(createEmptyCells);

  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [showRulesInfo, setShowRulesInfo] = useState(false);
  const [showGridPicker, setShowGridPicker] = useState(false);
  const [showSolutionsModal, setShowSolutionsModal] = useState(false);

  // Calculate solved cells and total score
  const solvedCount = useMemo(() => {
    return cells.reduce((acc, row) => acc + row.filter(c => c.isSolved).length, 0);
  }, [cells]);

  const totalScore = useMemo(() => {
    return cells.reduce(
      (acc, row) => acc + row.filter(c => c.isSolved).reduce((sum, c) => sum + c.points, 0),
      0
    );
  }, [cells]);

  const usedPlayerIds = useMemo(() => {
    const ids: string[] = [];
    cells.forEach(row => {
      row.forEach(cell => {
        if (cell.player) ids.push(cell.player.id);
      });
    });
    return ids;
  }, [cells]);

  // Compute all valid solutions for each of the 9 cells of the current grid
  const cellSolutions = useMemo(() => {
    const sol: Record<string, string[]> = {};
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const rowCrit = puzzle.rows[r];
        const colCrit = puzzle.cols[c];
        const valid = [
          ...new Set(
            PLAYERS_DATABASE.filter(
              p => playerMatchesCriterion(p, rowCrit) && playerMatchesCriterion(p, colCrit)
            ).map(p => p.ign)
          ),
        ];
        sol[`${r}-${c}`] = valid;
      }
    }
    return sol;
  }, [puzzle]);

  // Open result modal once all 9 cells are solved
  useEffect(() => {
    if (solvedCount === 9) {
      const timer = setTimeout(() => {
        setIsResultModalOpen(true);

        if (gameMode === 'infinite') {
          const nextStreak = infiniteStreak + 1;
          setInfiniteStreak(nextStreak);
          localStorage.setItem('vct_grid_infinite_streak', nextStreak.toString());

          if (nextStreak > bestStreak) {
            setBestStreak(nextStreak);
            localStorage.setItem('vct_grid_best_streak', nextStreak.toString());
          }
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [solvedCount, gameMode, infiniteStreak, bestStreak]);

  // Navigation handlers for Classic mode
  const handlePrevPuzzle = () => {
    playSelectSound();
    const prev = (currentPuzzleIndex - 1 + GRID_PUZZLES.length) % GRID_PUZZLES.length;
    setCurrentPuzzleIndex(prev);
    setCells(createEmptyCells());
    setIsResultModalOpen(false);
  };

  const handleNextPuzzle = () => {
    playSelectSound();
    if (gameMode === 'infinite') {
      handleGenerateNextInfinite();
    } else {
      const next = (currentPuzzleIndex + 1) % GRID_PUZZLES.length;
      setCurrentPuzzleIndex(next);
      setCells(createEmptyCells());
      setIsResultModalOpen(false);
    }
  };

  const handleGenerateNextInfinite = () => {
    playSelectSound();
    const nextRound = infiniteRound + 1;
    setInfiniteRound(nextRound);
    setInfinitePuzzle(generateInfiniteGridPuzzle(nextRound));
    setCells(createEmptyCells());
    setIsResultModalOpen(false);
  };

  const selectPuzzle = (index: number) => {
    playSelectSound();
    setCurrentPuzzleIndex(index);
    setCells(createEmptyCells());
    setShowGridPicker(false);
    setIsResultModalOpen(false);
  };

  const handleRestart = () => {
    playSelectSound();
    setCells(createEmptyCells());
    setIsResultModalOpen(false);
  };

  const handleCellClick = (row: number, col: number) => {
    playSelectSound();
    if (cells[row][col].isSolved) return;
    setActiveCell({ row, col });
  };

  const handleSelectCorrectPlayer = (player: Player) => {
    if (!activeCell) return;
    const { row, col } = activeCell;
    setCells(prev => {
      const copy = prev.map(r => [...r]);
      copy[row][col] = {
        ...copy[row][col],
        player,
        isSolved: true,
      };
      return copy;
    });
    setActiveCell(null);
  };

  const handleWrongGuess = () => {
    if (!activeCell) return;
    const { row, col } = activeCell;
    setCells(prev => {
      const copy = prev.map(r => [...r]);
      const cur = copy[row][col];
      const newWrong = cur.wrongGuessesCount + 1;
      const newPts = Math.max(10, 60 - newWrong * 15);
      copy[row][col] = {
        ...cur,
        wrongGuessesCount: newWrong,
        points: newPts,
      };
      return copy;
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 space-y-5">
      {/* Mode Selection Segmented Control */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 rounded-sm bg-[#0b121d] border border-white/10 shadow-lg">
          <button
            id="mode-infinite-tab"
            type="button"
            onClick={() => {
              playSelectSound();
              setGameMode('infinite');
              setCells(createEmptyCells());
              setIsResultModalOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-vct font-bold tracking-wider transition-all duration-150 ${
              gameMode === 'infinite'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>MODO INFINITO</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-sm font-mono-vct font-bold ${
              gameMode === 'infinite' ? 'bg-black/30 text-white' : 'bg-white/10 text-amber-300'
            }`}>
              ILIMITADO
            </span>
          </button>

          <button
            id="mode-classic-tab"
            type="button"
            onClick={() => {
              playSelectSound();
              setGameMode('classic');
              setCells(createEmptyCells());
              setIsResultModalOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-vct font-bold tracking-wider transition-all duration-150 ${
              gameMode === 'classic'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CLÁSSICO ({GRID_PUZZLES.length} GRIDS)</span>
          </button>
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#212f45] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-vct text-white tracking-wider flex items-center gap-2">
              <span>Grid · Valorant</span>
            </h2>
            <span className="text-sm font-mono-vct text-slate-300 bg-[#162234] px-2.5 py-0.5 rounded-sm border border-[#2b3d56]">
              {solvedCount} / 9 células
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {gameMode === 'infinite' ? (
              <span className="text-amber-300 font-mono-vct font-semibold">
                Desafio Dinâmico #{infiniteRound} · Gerado proceduralmente e 100% solúvel
              </span>
            ) : (
              <span>
                {puzzle.title} · #{puzzle.number} de {GRID_PUZZLES.length}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Trophy score badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#e2b714]/15 border border-[#e2b714]/30 text-xs font-mono-vct font-bold text-[#e2b714]">
            <Trophy className="w-3.5 h-3.5" />
            <span>{totalScore} pts</span>
          </div>

          {/* Infinite Mode Streak Badges & Reroll */}
          {gameMode === 'infinite' ? (
            <>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono-vct font-bold border transition-all ${
                  infiniteStreak > 0
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                    : 'bg-white/[0.04] border-white/10 text-slate-400'
                }`}
                title="Sequência de grids consecutivos completados"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Sequência: {infiniteStreak}</span>
                {bestStreak > 0 && (
                  <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                    (Rec: {bestStreak})
                  </span>
                )}
              </div>

              <button
                id="infinite-reroll-btn"
                type="button"
                onClick={handleGenerateNextInfinite}
                title="Gerar outro tabuleiro dinâmico aleatório"
                className="px-3 py-1 rounded-sm bg-white/[0.06] hover:bg-white/[0.12] text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all text-xs font-semibold flex items-center gap-1.5"
              >
                <Dices className="w-3.5 h-3.5 text-amber-400" />
                <span>Novo Grid 🎲</span>
              </button>
            </>
          ) : (
            <>
              {/* Classic Grid selector pill */}
              <button
                id="open-grid-picker-btn"
                onClick={() => setShowGridPicker(prev => !prev)}
                title="Escolher Tabuleiro"
                className="px-2.5 py-1 rounded-sm bg-[#162234] hover:bg-[#20314a] text-slate-300 hover:text-white border border-[#26374d] transition-all text-xs font-semibold flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Grids ({puzzle.number}/{GRID_PUZZLES.length})</span>
              </button>

              {/* Previous / Next buttons */}
              <button
                id="prev-grid-puzzle-btn"
                onClick={handlePrevPuzzle}
                title="Grid Anterior"
                className="p-1.5 rounded-sm bg-[#162234] hover:bg-[#20314a] text-slate-300 hover:text-white border border-[#26374d] transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="switch-grid-puzzle-btn"
                onClick={handleNextPuzzle}
                title="Próximo Grid"
                className="p-1.5 rounded-sm bg-[#162234] hover:bg-[#20314a] text-slate-300 hover:text-white border border-[#26374d] transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid Picker Dropdown Bar */}
      {showGridPicker && (
        <div className="p-4 rounded-sm bg-[#0f1724] border border-[#25354a] shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-vct font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              Selecione um dos 12 Tabuleiros Disponíveis:
            </span>
            <span className="text-[11px] font-mono-vct text-emerald-400">
              100% testados e solúveis
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {GRID_PUZZLES.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => selectPuzzle(idx)}
                className={`p-2 rounded-sm text-left border transition-all text-xs flex flex-col justify-between ${
                  idx === currentPuzzleIndex
                    ? 'bg-[#ff4655]/15 border-[#ff4655] text-white shadow-md'
                    : 'bg-[#141d2b] border-[#223145] text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-mono-vct font-bold text-[10px] text-amber-400">
                    Grid #{g.number}
                  </span>
                  {idx === currentPuzzleIndex && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655]" />
                  )}
                </div>
                <span className="font-vct font-bold leading-tight line-clamp-2">
                  {g.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4x4 Grid Board */}
      <div className="w-full bg-[#0d1420] border border-[#1e2c3f] rounded p-3 sm:p-5 shadow-2xl overflow-x-auto">
        <div className="min-w-[340px] max-w-xl mx-auto grid grid-cols-4 gap-2 sm:gap-3 aspect-square">
          {/* Top-Left Corner: GRID Brand */}
          <div className="rounded-sm bg-[#111a28] border border-[#1c2a3d] flex flex-col items-center justify-center p-2 text-center select-none shadow-inner">
            <span className="font-vct text-sm sm:text-base text-slate-300 tracking-widest font-bold">
              GRID
            </span>
            <span className="text-[9px] font-mono-vct text-[#ff4655] font-bold uppercase tracking-wider">
              VCT
            </span>
          </div>

          {/* Column Headers (Top Row: cols 0, 1, 2) */}
          {puzzle.cols.map(colCrit => (
            <div
              key={colCrit.id}
              className="rounded-sm bg-[#121c2c] border border-[#202f45] p-2 sm:p-2.5 flex flex-col items-center justify-center text-center transition-all select-none hover:border-[#2f425c] shadow-sm"
            >
              <div className="mb-1.5">
                <GridVisualBadge criterion={colCrit} size="md" />
              </div>
              <span className="text-[11px] sm:text-xs font-vct font-bold text-white leading-tight line-clamp-1">
                {colCrit.label}
              </span>
              <span className="text-[9px] text-slate-400 font-mono-vct line-clamp-1 mt-0.5">
                {colCrit.subLabel || colCrit.type}
              </span>
            </div>
          ))}

          {/* 3 Rows with Left Header + 3 Cells */}
          {puzzle.rows.map((rowCrit, rIdx) => (
            <React.Fragment key={rowCrit.id}>
              {/* Row Header (Left Column) */}
              <div className="rounded-sm bg-[#121c2c] border border-[#202f45] p-2 sm:p-2.5 flex flex-col items-center justify-center text-center select-none hover:border-[#2f425c] transition-all shadow-sm">
                <div className="mb-1.5">
                  <GridVisualBadge criterion={rowCrit} size="md" />
                </div>
                <span className="text-[11px] sm:text-xs font-vct font-bold text-white leading-tight line-clamp-1">
                  {rowCrit.label}
                </span>
                <span className="text-[9px] text-slate-400 font-mono-vct line-clamp-1 mt-0.5">
                  {rowCrit.subLabel || rowCrit.type}
                </span>
              </div>

              {/* 3 Interactive Cells in this row */}
              {cells[rIdx].map((cell, cIdx) => {
                const isSolved = cell.isSolved;
                const player = cell.player;

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    id={`grid-cell-${rIdx}-${cIdx}`}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    disabled={isSolved}
                    className={`relative rounded-sm border transition-all flex flex-col items-center justify-center p-2 text-center select-none ${
                      isSolved
                        ? 'bg-[#101b2a] border-emerald-500/50 shadow-md shadow-emerald-500/10 cursor-default'
                        : 'bg-[#141d2b] hover:bg-[#1a2638] border-[#223145] hover:border-[#384e6d] active:scale-95 cursor-pointer group'
                    }`}
                  >
                    {isSolved && player ? (
                      <div className="w-full flex flex-col items-center justify-center">
                        {/* Solved check & points */}
                        <div className="absolute top-1.5 right-1.5">
                          <span className="text-[9px] font-mono-vct font-bold px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            +{cell.points}
                          </span>
                        </div>

                        {/* Player Avatar */}
                        <div className="mb-1">
                          <PlayerAvatar player={player} size="sm" showAgentBadge />
                        </div>
                        <span className="font-vct text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-full">
                          {player.ign}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono-vct truncate max-w-full justify-center mt-0.5">
                          <TeamLogo teamName={player.team} size="xs" />
                          <span className="truncate">{player.team} · {player.signatureAgent}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm sm:text-base font-vct text-slate-400 group-hover:text-white transition-colors tracking-wide">
                          Tap
                        </span>
                        {cell.wrongGuessesCount > 0 && (
                          <span className="text-[9px] font-mono-vct text-rose-400 mt-1">
                            {cell.points} pts
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Grid Action Controls Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            id="grid-rules-toggle-btn"
            onClick={() => setShowRulesInfo(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#141e2e] hover:bg-[#1a283e] border border-[#25364c] text-slate-300 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Como Jogar</span>
          </button>

          <button
            id="grid-show-solutions-btn"
            onClick={() => setShowSolutionsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#141e2e] hover:bg-[#1a283e] border border-[#25364c] text-amber-300 transition-colors"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Ver Gabarito</span>
          </button>
        </div>

        <button
          id="restart-grid-btn"
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#141e2e] hover:bg-[#1a283e] border border-[#25364c] text-rose-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>Reiniciar Tabuleiro</span>
        </button>
      </div>

      {/* Rules Explanations Drawer */}
      {showRulesInfo && (
        <div className="p-4 rounded-sm bg-[#111c2a] border border-[#213247] space-y-2 text-xs text-slate-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-white font-vct font-bold text-sm">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Regras do Grid Valorant (Immaculate Grid)</span>
          </div>
          <p>
            1. Cada uma das 9 células requer um jogador profissional que cumpra <strong className="text-amber-300">simultaneamente</strong> os dois critérios correspondentes (linha e coluna).
          </p>
          <p>
            2. Critérios de <strong>Times</strong> aceitam o time atual ou equipes anteriores onde o atleta jogou profissionalmente no circuito VCT (ex: transferências da NRG, LOUD, Leviatán, Sentinels, G2, etc.).
          </p>
          <p>
            3. Critérios de <strong>Nacionalidades</strong> reconhecem o país de origem do jogador (ex: França 🇫🇷, Turquia 🇹🇷, Brasil 🇧🇷, EUA 🇺🇸, Coreia 🇰🇷, etc.).
          </p>
          <p>
            4. Cada acerto garante 60 pontos na célula. Erros descontam 15 pontos da célula, e nenhum jogador pode ser repetido no mesmo tabuleiro!
          </p>
        </div>
      )}

      {/* Solutions / Answers Modal */}
      {showSolutionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0f1724] border border-[#26354a] rounded shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-5 border-b border-[#202d3f] bg-[#131d2e] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-vct uppercase tracking-widest text-amber-400 font-bold">
                  GABARITO DE JOGADORES VÁLIDOS
                </span>
                <h3 className="text-lg sm:text-xl font-vct text-white tracking-wide">
                  {puzzle.title} (#{puzzle.number})
                </h3>
              </div>
              <button
                id="close-solutions-modal-btn"
                onClick={() => setShowSolutionsModal(false)}
                className="px-3 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Fechar
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {puzzle.rows.map((rowCrit, rIdx) =>
                  puzzle.cols.map((colCrit, cIdx) => {
                    const sol = cellSolutions[`${rIdx}-${cIdx}`] || [];
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className="p-3 rounded-sm bg-[#141e2e] border border-[#233349] flex flex-col"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-white">
                          <span className="text-slate-400 font-normal">Célula ({rIdx + 1},{cIdx + 1}):</span>
                        </div>
                        <div className="text-[11px] text-amber-300 font-vct font-medium mb-2 leading-tight">
                          {rowCrit.label} ✕ {colCrit.label}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {sol.length > 0 ? (
                            sol.map(ign => (
                              <span
                                key={ign}
                                className="px-2 py-0.5 rounded-sm bg-[#1d2a3d] border border-white/10 text-[11px] font-mono-vct font-semibold text-slate-200"
                              >
                                {ign}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-rose-400">Nenhum</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Search Modal */}
      {activeCell && (
        <GridPlayerSearchModal
          isOpen={true}
          onClose={() => setActiveCell(null)}
          rowCriterion={puzzle.rows[activeCell.row]}
          colCriterion={puzzle.cols[activeCell.col]}
          currentPoints={cells[activeCell.row][activeCell.col].points}
          onSelectCorrectPlayer={handleSelectCorrectPlayer}
          onWrongGuess={handleWrongGuess}
          usedPlayerIds={usedPlayerIds}
        />
      )}

      {/* Result Modal */}
      <GridResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        puzzle={puzzle}
        cells={cells}
        totalScore={totalScore}
        solvedCount={solvedCount}
        onRestart={handleRestart}
        onNextPuzzle={handleNextPuzzle}
        hasNextPuzzle={true}
        isInfiniteMode={gameMode === 'infinite'}
        streak={infiniteStreak}
      />
    </div>
  );
};
