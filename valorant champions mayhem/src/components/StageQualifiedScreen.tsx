import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { TournamentStage } from '../types';
import { playVictoryFanfare, playSelectSound } from '../utils/audio';

interface StageQualifiedScreenProps {
  stage: TournamentStage;
  onNextStage: () => void;
}

const STAGE_LABELS: Record<TournamentStage, string> = {
  group: 'GROUP STAGE',
  quarters: 'QUARTERFINALS',
  semis: 'SEMIFINALS',
  finals: 'GRAND FINAL',
};

export const StageQualifiedScreen: React.FC<StageQualifiedScreenProps> = ({
  stage,
  onNextStage,
}) => {
  React.useEffect(() => {
    playVictoryFanfare();
  }, []);

  return (
    <div className="vct-grid-bg min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn relative">
      {/* Top Banner */}
      <div className="absolute top-12 flex flex-col items-center">
        <span className="text-xs font-mono-vct text-[#38bdf8] tracking-[0.3em] font-semibold uppercase">
          CHAMPIONS MAYHEM
        </span>
        <h2 className="text-2xl sm:text-4xl font-vct text-white tracking-widest mt-1">
          {STAGE_LABELS[stage]}
        </h2>
      </div>

      {/* Center "Qualified!" text */}
      <div className="my-auto py-16">
        <div className="w-16 h-16 rounded-sm bg-[#e2b714]/20 border border-[#e2b714] flex items-center justify-center mx-auto mb-6 text-[#e2b714] shadow-lg shadow-[#e2b714]/20">
          <Award className="w-8 h-8" />
        </div>
        <h1
          className="text-4xl sm:text-6xl text-[#e8c374] tracking-wide font-serif mb-6"
          style={{ textShadow: '0 4px 20px rgba(226, 183, 20, 0.4)' }}
        >
          Classificado!
        </h1>
        <p className="text-sm font-mono-vct text-slate-300 max-w-md mx-auto mb-8">
          Sua equipe demonstrou excelente química tática e avançou para a próxima etapa do campeonato.
        </p>

        {/* Button: [NEXT STAGE] */}
        <button
          id="next-stage-btn"
          onClick={() => {
            playSelectSound();
            onNextStage();
          }}
          className="px-8 py-2.5 rounded-sm border border-[#3b4b66] bg-[#121c2d] hover:bg-[#19273e] hover:border-[#e2b714] text-slate-200 hover:text-white font-vct text-xl tracking-widest uppercase transition-all shadow-xl inline-flex items-center gap-2 group"
        >
          <span>PRÓXIMA FASE</span>
          <ArrowRight className="w-4 h-4 text-[#e2b714] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
