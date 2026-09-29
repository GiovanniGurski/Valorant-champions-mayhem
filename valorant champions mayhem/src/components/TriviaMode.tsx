import React, { useState, useEffect } from 'react';
import { Search, Check, X, ArrowUp, ArrowDown, HelpCircle, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { Player, TriviaGuess } from '../types';
import { PLAYERS_DATABASE } from '../data/teamsAndPlayers';
import { playRoundWinSound, playRoundLossSound, playSelectSound } from '../utils/audio';
import { TeamLogo } from './TeamLogo';

export const TriviaMode: React.FC = () => {
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [guesses, setGuesses] = useState<TriviaGuess[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [mode, setMode] = useState<'daily' | 'practice'>('daily');
  const [streak, setStreak] = useState<number>(0);

  // Load target player on mount or mode switch
  useEffect(() => {
    initRound(mode);
    const savedStreak = localStorage.getItem('vct_trivia_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10) || 0);
    }
  }, [mode]);

  const initRound = (gameMode: 'daily' | 'practice') => {
    let chosen: Player;
    if (gameMode === 'daily') {
      // Deterministic daily player based on day string
      const dateStr = new Date().toISOString().slice(0, 10);
      let hash = 0;
      for (let i = 0; i < dateStr.length; i++) {
        hash = (hash << 5) - hash + dateStr.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % PLAYERS_DATABASE.length;
      chosen = PLAYERS_DATABASE[index];
    } else {
      // Random player
      chosen = PLAYERS_DATABASE[Math.floor(Math.random() * PLAYERS_DATABASE.length)];
    }

    setTargetPlayer(chosen);
    setGuesses([]);
    setIsGameOver(false);
    setSearchTerm('');
  };

  const getRegionForTeam = (teamName: string): string => {
    const p = PLAYERS_DATABASE.find(pl => pl.team === teamName);
    if (!p) return 'Internacional';
    if (['LOUD', 'Sentinels', 'OpTic Gaming', 'Evil Geniuses', 'Leviatán', 'G2 Esports', 'KRÜ Esports', 'NRG'].includes(p.team)) return 'Americas';
    if (['Fnatic', 'FunPlus Phoenix', 'Team Heretics', 'Team Liquid'].includes(p.team)) return 'EMEA';
    if (['DRX', 'Paper Rex', 'Gen.G Esports'].includes(p.team)) return 'Pacific';
    if (['EDward Gaming', 'Bilibili Gaming', 'Trace Esports'].includes(p.team)) return 'China';
    return 'Americas';
  };

  const handleMakeGuess = (selected: Player) => {
    if (!targetPlayer || isGameOver) return;
    if (guesses.some(g => g.player.id === selected.id)) return;

    playSelectSound();

    const isMatch = selected.id === targetPlayer.id || selected.ign.toLowerCase() === targetPlayer.ign.toLowerCase();

    const targetRegion = getRegionForTeam(targetPlayer.team);
    const guessRegion = getRegionForTeam(selected.team);

    let yearComparison: 'correct' | 'higher' | 'lower' = 'correct';
    if (selected.year < targetPlayer.year) {
      yearComparison = 'higher';
    } else if (selected.year > targetPlayer.year) {
      yearComparison = 'lower';
    }

    const newGuess: TriviaGuess = {
      player: selected,
      isCorrect: isMatch,
      matches: {
        region: targetRegion === guessRegion ? 'correct' : 'wrong',
        team: selected.team === targetPlayer.team ? 'correct' : 'wrong',
        role: selected.primaryRole === targetPlayer.primaryRole ? 'correct' : 'wrong',
        year: yearComparison,
        agent: selected.signatureAgent === targetPlayer.signatureAgent ? 'correct' : 'wrong',
      },
    };

    const updatedGuesses = [newGuess, ...guesses];
    setGuesses(updatedGuesses);
    setSearchTerm('');

    if (isMatch) {
      setIsGameOver(true);
      playRoundWinSound();
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('vct_trivia_streak', String(newStreak));
    } else if (updatedGuesses.length >= 8) {
      setIsGameOver(true);
      playRoundLossSound();
      setStreak(0);
      localStorage.setItem('vct_trivia_streak', '0');
    } else {
      playRoundLossSound();
    }
  };

  const filteredPlayers = PLAYERS_DATABASE.filter(p => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    return (
      p.ign.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term) ||
      p.team.toLowerCase().includes(term)
    );
  }).slice(0, 6);

  return (
    <div className="max-w-2xl mx-auto my-6 space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono-vct text-[#ff4655] font-bold tracking-widest uppercase">
          MINIGAME TÁTICO
        </span>
        <h2 className="text-3xl sm:text-4xl font-vct text-white tracking-wider">
          DESCUBRA O PRO PLAYER MISTERIOSO
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-mono-vct max-w-md mx-auto">
          Adivinhe o jogador do Champions com base em pistas de equipe, região, função e ano de destaque!
        </p>
      </div>

      {/* Mode Selector & Streak */}
      <div className="flex items-center justify-between bg-[#0e1624] border border-[#212d3f] p-3 rounded text-xs font-mono-vct">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#e2b714]" />
          <span className="text-slate-300">
            Sequência: <strong className="text-[#e2b714] font-bold">{streak} vitórias</strong>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#131d2e] p-1 rounded-sm border border-slate-700">
          <button
            onClick={() => {
              playSelectSound();
              setMode('daily');
            }}
            className={`px-3 py-1 rounded-sm text-xs font-mono-vct font-semibold transition-colors ${
              mode === 'daily'
                ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Desafio Diário
          </button>
          <button
            onClick={() => {
              playSelectSound();
              setMode('practice');
            }}
            className={`px-3 py-1 rounded-sm text-xs font-mono-vct font-semibold transition-colors ${
              mode === 'practice'
                ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Treino Infinito
          </button>
        </div>
      </div>

      {/* Input Search Box */}
      {!isGameOver && (
        <div className="relative max-w-md mx-auto">
          <div className="relative">
            <input
              id="trivia-player-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Digite o nick do jogador (ex: aspas, TenZ, KangKang)..."
              className="w-full bg-[#111824] border border-[#2c3d55] rounded-sm px-4 py-2.5 pl-11 text-white placeholder-slate-500 font-mono-vct text-sm focus:outline-none focus:border-[#e2b714] shadow-lg"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-2.5" />
          </div>

          {/* Autocomplete Dropdown */}
          {filteredPlayers.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0e1520] border border-[#2b3c54] rounded-sm shadow-2xl z-30 overflow-hidden divide-y divide-[#1e2a3b]">
              {filteredPlayers.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleMakeGuess(p)}
                  className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-[#192538] transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-[#ff4655]">
                      {p.ign}
                    </span>
                    <span className="text-xs text-slate-400">({p.name})</span>
                  </div>
                  <div className="text-xs font-mono-vct text-slate-400 flex items-center gap-1.5">
                    <TeamLogo teamName={p.team} size="xs" />
                    <span>{p.team} • {p.primaryRole}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Victory / Defeat Announcement */}
      {isGameOver && (
        <div className="bg-[#111824] border border-[#2b3d55] rounded p-6 text-center max-w-md mx-auto shadow-2xl animate-fadeIn">
          {guesses[0]?.isCorrect ? (
            <div>
              <div className="w-12 h-12 rounded-sm bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-vct text-emerald-400">VOCÊ ACERTOU!</h3>
              <div className="text-xs text-slate-300 font-mono-vct mt-1 mb-4 flex items-center justify-center gap-1.5 flex-wrap">
                <span>O jogador misterioso era</span>
                <strong className="text-white">{targetPlayer?.ign}</strong>
                <span className="inline-flex items-center gap-1">
                  (<TeamLogo teamName={targetPlayer?.team || ''} size="xs" />
                  {targetPlayer?.team}).
                </span>
                <span>Acertado em {guesses.length} palpites!</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 rounded-sm bg-rose-500/20 border border-rose-500 flex items-center justify-center mx-auto mb-2 text-rose-400">
                <X className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-vct text-rose-400">FIM DOS TENTATIVAS</h3>
              <div className="text-xs text-slate-300 font-mono-vct mt-1 mb-4 flex items-center justify-center gap-1.5 flex-wrap">
                <span>O jogador correto era</span>
                <strong className="text-white">{targetPlayer?.ign}</strong>
                <span className="inline-flex items-center gap-1">
                  (<TeamLogo teamName={targetPlayer?.team || ''} size="xs" />
                  {targetPlayer?.team}).
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              playSelectSound();
              initRound('practice');
            }}
            className="px-6 py-2 rounded-sm bg-[#ff4655] hover:bg-[#ff5e6c] text-white font-vct text-lg tracking-wider uppercase transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>
        </div>
      )}

      {/* LoLdle Guess Feedback Table */}
      {guesses.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[620px] bg-[#0c121c] border border-[#202b3b] rounded p-3">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-2 text-center text-[11px] font-mono-vct text-slate-400 font-semibold uppercase pb-2 border-b border-[#1c2738]">
              <div>Jogador</div>
              <div>Equipe</div>
              <div>Região</div>
              <div>Ano</div>
              <div>Função</div>
              <div>Agente</div>
            </div>

            {/* Guess Rows */}
            <div className="space-y-2 mt-2">
              {guesses.map((guess, idx) => {
                const targetReg = getRegionForTeam(targetPlayer?.team || '');
                const guessReg = getRegionForTeam(guess.player.team);

                return (
                  <div
                    key={idx}
                    className="grid grid-cols-6 gap-2 text-center text-xs font-mono-vct font-semibold animate-fadeIn"
                  >
                    {/* Player Name */}
                    <div
                      className={`p-2.5 rounded-sm flex items-center justify-center border ${
                        guess.isCorrect
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-[#151f2e] border-slate-700 text-white'
                      }`}
                    >
                      <span className="truncate">{guess.player.ign}</span>
                    </div>

                    {/* Team */}
                    <div
                      className={`p-2.5 rounded-sm flex items-center justify-center gap-1.5 border ${
                        guess.matches.team === 'correct'
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800 text-rose-300'
                      }`}
                    >
                      <TeamLogo teamName={guess.player.team} size="xs" />
                      <span className="truncate">{guess.player.team}</span>
                    </div>

                    {/* Region */}
                    <div
                      className={`p-2.5 rounded-sm flex items-center justify-center border ${
                        guess.matches.region === 'correct'
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800 text-rose-300'
                      }`}
                    >
                      <span>{guessReg}</span>
                    </div>

                    {/* Year */}
                    <div
                      className={`p-2.5 rounded-sm flex items-center justify-center gap-1 border ${
                        guess.matches.year === 'correct'
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-amber-950/40 border-amber-600 text-amber-300'
                      }`}
                    >
                      <span>{guess.player.year}</span>
                      {guess.matches.year === 'higher' && <ArrowUp className="w-3.5 h-3.5 text-amber-400" />}
                      {guess.matches.year === 'lower' && <ArrowDown className="w-3.5 h-3.5 text-amber-400" />}
                    </div>

                    {/* Role */}
                    <div
                      className={`p-2.5 rounded-sm flex items-center justify-center border ${
                        guess.matches.role === 'correct'
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800 text-rose-300'
                      }`}
                    >
                      <span>{guess.player.primaryRole}</span>
                    </div>

                    {/* Agent */}
                    <div
                      className={`p-2.5 rounded-sm flex items-center justify-center border ${
                        guess.matches.agent === 'correct'
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800 text-rose-300'
                      }`}
                    >
                      <span>{guess.player.signatureAgent}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
