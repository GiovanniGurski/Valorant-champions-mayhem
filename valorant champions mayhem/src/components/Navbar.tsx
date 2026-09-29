import React from 'react';
import { Trophy, Shield, Volume2, VolumeX, HelpCircle, Gamepad2, Grid3X3 } from 'lucide-react';
import { Difficulty } from '../types';
import { isAudioEnabled, toggleAudio, playSelectSound } from '../utils/audio';

interface NavbarProps {
  currentTab: 'draft' | 'grid' | 'trivia' | 'history';
  onTabChange: (tab: 'draft' | 'grid' | 'trivia' | 'history') => void;
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  onOpenHelp: () => void;
  trophiesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  difficulty,
  onDifficultyChange,
  onOpenHelp,
  trophiesCount,
}) => {
  const [audioOn, setAudioOn] = React.useState<boolean>(true);

  React.useEffect(() => {
    setAudioOn(isAudioEnabled());
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleAudio();
    setAudioOn(newState);
    if (newState) {
      playSelectSound();
    }
  };

  return (
    <header className="border-b border-white/10 bg-[#090d16]/90 backdrop-blur-xl sticky top-0 z-40 shadow-xl shadow-black/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Zone with sharp esports angles */}
        <div className="flex items-center gap-3.5">
          {/* Valorant Icon Emblem */}
          <div className="w-10 h-10 rounded bg-gradient-to-br from-[#ff4655] to-[#b31424] flex items-center justify-center shadow-lg shadow-[#ff4655]/25 border border-white/20 shrink-0 transform transition-transform hover:scale-105">
            <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
              <path d="M15 25 L45 75 L30 75 L5 33 Z" />
              <path d="M85 25 L55 75 L70 75 L95 33 Z" />
              <polygon points="50,42 62,62 38,62" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.2em] font-mono-vct font-semibold text-slate-400">
                VCT ESPORTS
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#ff4655]/15 text-[#ff4655] font-mono-vct font-extrabold border border-[#ff4655]/30">
                CHAMPIONS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-vct leading-none text-white tracking-wider flex items-center gap-1.5">
              VALORANT <span className="text-[#ff4655] drop-shadow-[0_0_12px_rgba(255,70,85,0.4)]">MAYHEM</span>
            </h1>
          </div>
        </div>

        {/* Center Tabs: Sharp Tactical Navigation */}
        <nav className="flex items-center gap-1 bg-[#0f172a]/80 backdrop-blur-md p-1 rounded border border-white/10 shadow-inner">
          <button
            id="tab-draft-btn"
            onClick={() => {
              playSelectSound();
              onTabChange('draft');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs sm:text-sm font-semibold transition-all duration-150 ${
              currentTab === 'draft'
                ? 'bg-[#ff4655] text-white shadow-lg shadow-[#ff4655]/30 border border-white/20'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Draft & Torneio</span>
          </button>

          <button
            id="tab-grid-btn"
            onClick={() => {
              playSelectSound();
              onTabChange('grid');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs sm:text-sm font-semibold transition-all duration-150 ${
              currentTab === 'grid'
                ? 'bg-[#e2b714] text-slate-950 font-bold shadow-lg shadow-[#e2b714]/30 border border-amber-300/40'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Grid Valorant</span>
          </button>

          <button
            id="tab-trivia-btn"
            onClick={() => {
              playSelectSound();
              onTabChange('trivia');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs sm:text-sm font-semibold transition-all duration-150 ${
              currentTab === 'trivia'
                ? 'bg-[#ff4655] text-white shadow-lg shadow-[#ff4655]/30 border border-white/20'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Trivia LoLdle</span>
          </button>

          <button
            id="tab-history-btn"
            onClick={() => {
              playSelectSound();
              onTabChange('history');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs sm:text-sm font-semibold transition-all duration-150 ${
              currentTab === 'history'
                ? 'bg-[#e2b714] text-slate-950 font-bold shadow-lg shadow-[#e2b714]/30 border border-amber-300/40'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Troféus ({trophiesCount})</span>
          </button>
        </nav>

        {/* Right Tools: Difficulty & Audio */}
        <div className="flex items-center gap-2">
          {/* Difficulty Straight Selector */}
          <div className="flex items-center bg-[#0f172a]/80 backdrop-blur-md rounded border border-white/10 text-xs font-mono-vct p-0.5 shadow-inner">
            <button
              id="diff-normal-btn"
              onClick={() => {
                playSelectSound();
                onDifficultyChange('normal');
              }}
              className={`px-2.5 py-1 rounded-sm transition-all duration-150 ${
                difficulty === 'normal'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              title="Normal: 3 Rerolls, Sem banimentos pelo adversário"
            >
              Normal
            </button>
            <button
              id="diff-hard-btn"
              onClick={() => {
                playSelectSound();
                onDifficultyChange('hard');
              }}
              className={`px-2.5 py-1 rounded-sm transition-all duration-150 ${
                difficulty === 'hard'
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              title="Difícil: 2 Rerolls, 3 Jogadores banidos pelo adversário"
            >
              Difícil
            </button>
            <button
              id="diff-master-btn"
              onClick={() => {
                playSelectSound();
                onDifficultyChange('master');
              }}
              className={`px-2.5 py-1 rounded-sm transition-all duration-150 ${
                difficulty === 'master'
                  ? 'bg-[#ff4655] text-white font-bold shadow-md shadow-[#ff4655]/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              title="Master: 1 Reroll apenas, 6 Jogadores banidos pelo adversário"
            >
              Master
            </button>
          </div>

          {/* Sound toggle */}
          <button
            id="sound-toggle-btn"
            onClick={handleSoundToggle}
            className="p-2 rounded bg-[#0f172a]/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-[#ff4655]/50 hover:bg-white/[0.06] transition-all duration-150 shadow-sm"
            title={audioOn ? 'Desativar Sons' : 'Ativar Sons'}
            aria-label="Toggle Sound"
          >
            {audioOn ? <Volume2 className="w-4 h-4 text-[#e2b714]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Help Button */}
          <button
            id="help-btn"
            onClick={() => {
              playSelectSound();
              onOpenHelp();
            }}
            className="p-2 rounded bg-[#0f172a]/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/[0.06] transition-all duration-150 shadow-sm"
            title="Como Jogar & Regras"
            aria-label="Ajuda e Regras"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
