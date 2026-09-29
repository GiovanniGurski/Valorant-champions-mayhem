import React, { useState, useMemo } from 'react';
import { Search, X, AlertCircle, CheckCircle, Trophy, User, Shield, Sparkles } from 'lucide-react';
import { Player, Role } from '../types';
import { GridCriterion, playerMatchesCriterion, PLAYER_TEAM_HISTORY } from '../data/gridPuzzles';
import { PLAYERS_DATABASE } from '../data/teamsAndPlayers';
import { playLockSound } from '../utils/audio';
import { GridVisualBadge } from './GridVisualBadge';
import { PlayerAvatar } from './PlayerAvatar';
import { TeamLogo } from './TeamLogo';

interface GridPlayerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowCriterion: GridCriterion;
  colCriterion: GridCriterion;
  currentPoints: number;
  usedPlayerIds: string[];
  onSelectCorrectPlayer: (player: Player, pointsEarned: number) => void;
  onWrongGuess: () => void;
}

export const GridPlayerSearchModal: React.FC<GridPlayerSearchModalProps> = ({
  isOpen,
  onClose,
  rowCriterion,
  colCriterion,
  currentPoints,
  usedPlayerIds,
  onSelectCorrectPlayer,
  onWrongGuess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Deduplicate players by IGN from the database
  const allUniquePlayers = useMemo(() => {
    const map = new Map<string, Player>();
    PLAYERS_DATABASE.forEach(p => {
      if (!map.has(p.ign)) {
        map.set(p.ign, p);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.rating - a.rating);
  }, []);

  // Filtered players
  const filteredPlayers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allUniquePlayers.filter(p => {
      const pastTeams = PLAYER_TEAM_HISTORY[p.ign] || [];
      const matchesSearch =
        p.ign.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        p.team.toLowerCase().includes(term) ||
        pastTeams.some(t => t.toLowerCase().includes(term)) ||
        p.signatureAgent.toLowerCase().includes(term) ||
        p.country.toLowerCase().includes(term);

      const matchesRole =
        selectedRoleFilter === 'ALL' ||
        p.primaryRole === selectedRoleFilter ||
        p.secondaryRoles.includes(selectedRoleFilter);

      return matchesSearch && matchesRole;
    });
  }, [allUniquePlayers, searchTerm, selectedRoleFilter]);

  if (!isOpen) return null;

  const handlePlayerClick = (player: Player) => {
    // Check if already used
    if (usedPlayerIds.includes(player.id)) {
      setFeedback({
        type: 'error',
        message: `${player.ign} já foi escalado em outra célula deste Grid! Escolha outro pro player.`,
      });
      return;
    }

    const matchesRow = playerMatchesCriterion(player, rowCriterion);
    const matchesCol = playerMatchesCriterion(player, colCriterion);

    if (matchesRow && matchesCol) {
      playLockSound();
      setFeedback({
        type: 'success',
        message: `Acertou! ${player.ign} cumpre ambos os critérios! (+${currentPoints} pts)`,
      });
      setTimeout(() => {
        onSelectCorrectPlayer(player, currentPoints);
        setFeedback(null);
        setSearchTerm('');
        onClose();
      }, 700);
    } else {
      onWrongGuess();
      let hint = '';
      if (!matchesRow && !matchesCol) {
        hint = `${player.ign} não cumpre nenhum dos dois critérios!`;
      } else if (!matchesRow) {
        hint = `${player.ign} não cumpre o critério da linha ("${rowCriterion.label}")!`;
      } else {
        hint = `${player.ign} não cumpre o critério da coluna ("${colCriterion.label}")!`;
      }
      setFeedback({
        type: 'error',
        message: `Incorreto! ${hint} (-15 pts na célula)`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0f1724] border border-[#26354a] rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#202d3f] bg-[#131d2e] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-vct uppercase tracking-widest text-[#e2b714] font-bold">
                GRID · ESCOLHA DE JOGADOR
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-[#e2b714]/20 text-[#e2b714] text-[10px] font-mono-vct font-bold">
                Vale {currentPoints} pts
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-vct text-white tracking-wide">
              Selecione o Pro Player Correspondente
            </h3>
          </div>
          <button
            id="close-grid-search-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-sm hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clues Banner */}
        <div className="px-4 py-3 bg-[#162234] border-b border-[#233349] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Linha:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#1e2c3f] border border-white/10 shadow-sm">
              <GridVisualBadge criterion={rowCriterion} size="sm" />
              <span className="font-bold text-white">{rowCriterion.label}</span>
            </div>
          </div>

          <div className="text-slate-500 font-bold">✕</div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Coluna:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#1e2c3f] border border-white/10 shadow-sm">
              <GridVisualBadge criterion={colCriterion} size="sm" />
              <span className="font-bold text-white">{colCriterion.label}</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/80 border-b border-rose-500/30 text-rose-300 animate-pulse'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Search & Filters */}
        <div className="p-4 border-b border-[#202d3f] space-y-3 bg-[#0d1420]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="grid-player-search-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Digite o nick do jogador (ex: aspas, TenZ, Derke, Chronicle)..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-[#172233] border border-[#2b3d56] rounded-sm text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#e2b714] focus:ring-1 focus:ring-[#e2b714]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Role Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['ALL', 'Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'] as const).map(role => (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role)}
                className={`px-2.5 py-1 rounded-sm font-mono-vct font-medium transition-all ${
                  selectedRoleFilter === role
                    ? 'bg-[#ff4655] text-white shadow-sm'
                    : 'bg-[#151f2e] text-slate-400 hover:bg-[#1f2e42] hover:text-slate-200'
                }`}
              >
                {role === 'ALL' ? 'Todos' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-[#172233]">
          {filteredPlayers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <User className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
              <p className="text-sm font-medium">Nenhum jogador encontrado com "{searchTerm}"</p>
              <p className="text-xs text-slate-500">Tente buscar por outro nick ou altere o filtro de função.</p>
            </div>
          ) : (
            filteredPlayers.map(player => {
              const isUsed = usedPlayerIds.includes(player.id);
              return (
                <div
                  key={player.id}
                  onClick={() => !isUsed && handlePlayerClick(player)}
                  className={`pt-2 first:pt-0 flex items-center justify-between p-2.5 rounded-sm transition-all ${
                    isUsed
                      ? 'opacity-40 cursor-not-allowed bg-slate-900/40'
                      : 'cursor-pointer hover:bg-[#182538] active:scale-[0.99] border border-transparent hover:border-[#2a3c54]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Player Avatar */}
                    <PlayerAvatar player={player} size="md" showAgentBadge />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-vct text-base text-white font-semibold tracking-wide">
                          {player.ign}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-300 font-mono-vct">
                          {player.country}
                        </span>
                        {player.isChampionsWinner && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            <Trophy className="w-2.5 h-2.5" /> Campeão
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                        <span className="text-slate-300 font-medium inline-flex items-center gap-1.5">
                          <TeamLogo teamName={player.team} size="sm" />
                          {player.team}
                        </span>
                        {PLAYER_TEAM_HISTORY[player.ign] && (
                          <span className="text-[10px] text-slate-400 font-mono-vct">
                            (ex: {PLAYER_TEAM_HISTORY[player.ign].filter(t => !player.team.includes(t)).slice(0, 2).join(', ')})
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-slate-400">{player.primaryRole}</span>
                        <span>•</span>
                        <span className="text-slate-500">{player.signatureAgent}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-mono-vct font-bold text-[#e2b714]">
                        {player.rating} OVR
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono-vct">
                        {player.clutch} CLUTCH
                      </div>
                    </div>

                    <button
                      disabled={isUsed}
                      className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                        isUsed
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-[#e2b714] hover:bg-[#f3c92a] text-slate-950 shadow-md shadow-[#e2b714]/10'
                      }`}
                    >
                      {isUsed ? 'Já Escalado' : 'Selecionar'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0d1420] border-t border-[#1c2838] flex items-center justify-between text-[11px] text-slate-400">
          <span>Escolha com sabedoria: palpites incorretos descontam 15 pts nesta célula.</span>
          <span className="font-mono-vct text-slate-300 font-bold">{filteredPlayers.length} disponíveis</span>
        </div>
      </div>
    </div>
  );
};
