import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Calendar,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Crown,
  ShieldAlert,
  Flame,
  Star,
  Sparkles,
  Zap,
  Snowflake,
  Crosshair,
  Target,
  CheckCircle2,
  Lock,
  Medal,
} from 'lucide-react';
import { CampaignHistory, Achievement } from '../types';
import { evaluateAchievements } from '../data/achievements';
import { playSelectSound } from '../utils/audio';
import { TeamLogo } from './TeamLogo';

interface TrophyRoomModalProps {
  history: CampaignHistory[];
  onClearHistory: () => void;
  onClose: () => void;
}

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({
  history,
  onClearHistory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'achievements'>('campaigns');
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const championshipsWon = history.filter(h => h.wonChampionship).length;
  const totalCampaigns = history.length;
  const winRate = totalCampaigns > 0 ? Math.round((championshipsWon / totalCampaigns) * 100) : 0;
  const highestRating = history.reduce((max, h) => Math.max(max, h.overallRating), 0);

  const achievements: Achievement[] = evaluateAchievements(history);
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const achievementProgress = Math.round((unlockedCount / achievements.length) * 100);

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-5 h-5 ${isUnlocked ? 'text-[#e2b714]' : 'text-slate-500'}`;
    switch (iconName) {
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Star':
        return <Star className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Snowflake':
        return <Snowflake className={className} />;
      case 'Calendar':
        return <Calendar className={className} />;
      case 'Crosshair':
        return <Crosshair className={className} />;
      case 'Target':
        return <Target className={className} />;
      default:
        return <Medal className={className} />;
    }
  };

  const filteredAchievements = achievements.filter(a => {
    if (achievementFilter === 'unlocked') return a.isUnlocked;
    if (achievementFilter === 'locked') return !a.isUnlocked;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      {/* Trophy Header Banner */}
      <div className="bg-gradient-to-r from-[#182030] via-[#101724] to-[#182030] border border-[#2b3a50] rounded p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-sm bg-gradient-to-tr from-[#e2b714] to-amber-300 flex items-center justify-center text-slate-950 shadow-xl shadow-[#e2b714]/30 shrink-0">
              <Trophy className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-mono-vct text-[#e2b714] font-bold tracking-widest uppercase">
                HISTÓRICO COMPETITIVO & CONQUISTAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-vct text-white tracking-wider leading-none mt-1">
                SALA DE TROFÉUS DO CHAMPIONS
              </h2>
              <p className="text-xs text-slate-400 font-mono-vct mt-1">
                Registro de títulos, histórico de campanhas e galeria de conquistas VCT.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalCampaigns > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Deseja realmente limpar o histórico de campanhas?')) {
                    playSelectSound();
                    onClearHistory();
                  }
                }}
                className="px-3 py-1.5 rounded-sm border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-mono-vct flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#1f2b3e]">
          <div className="bg-[#0c121d] p-3 rounded-sm border border-[#212d3f] text-center">
            <span className="text-[10px] uppercase font-mono-vct text-slate-400 block">Títulos VCT</span>
            <span className="text-2xl sm:text-3xl font-vct text-[#e2b714] font-bold">
              {championshipsWon}
            </span>
          </div>

          <div className="bg-[#0c121d] p-3 rounded-sm border border-[#212d3f] text-center">
            <span className="text-[10px] uppercase font-mono-vct text-slate-400 block">Torneios Disputados</span>
            <span className="text-2xl sm:text-3xl font-vct text-white font-bold">
              {totalCampaigns}
            </span>
          </div>

          <div className="bg-[#0c121d] p-3 rounded-sm border border-[#212d3f] text-center">
            <span className="text-[10px] uppercase font-mono-vct text-slate-400 block">Taxa de Títulos</span>
            <span className="text-2xl sm:text-3xl font-vct text-emerald-400 font-bold">
              {winRate}%
            </span>
          </div>

          <div className="bg-[#0c121d] p-3 rounded-sm border border-[#212d3f] text-center">
            <span className="text-[10px] uppercase font-mono-vct text-slate-400 block">Conquistas VCT</span>
            <span className="text-2xl sm:text-3xl font-vct text-amber-300 font-bold">
              {unlockedCount}/{achievements.length}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Campanhas vs Conquistas) */}
      <div className="flex items-center justify-between border-b border-[#212f42] pb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSelectSound();
              setActiveTab('campaigns');
            }}
            className={`px-4 py-2 rounded-sm font-vct font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'campaigns'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-400/20 border-2 border-amber-400 text-amber-300 shadow-md'
                : 'bg-[#0f1724] border border-[#212f42] text-slate-400 hover:text-white hover:bg-[#162235]'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Campanhas ({history.length})</span>
          </button>

          <button
            onClick={() => {
              playSelectSound();
              setActiveTab('achievements');
            }}
            className={`px-4 py-2 rounded-sm font-vct font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-400/20 border-2 border-amber-400 text-amber-300 shadow-md'
                : 'bg-[#0f1724] border border-[#212f42] text-slate-400 hover:text-white hover:bg-[#162235]'
            }`}
          >
            <Medal className="w-4 h-4 text-amber-400" />
            <span>Conquistas ({unlockedCount}/{achievements.length})</span>
          </button>
        </div>

        {/* Tab 2 Filter Shortcuts */}
        {activeTab === 'achievements' && (
          <div className="flex items-center gap-1.5 text-xs font-mono-vct">
            <button
              onClick={() => setAchievementFilter('all')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                achievementFilter === 'all'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Todas ({achievements.length})
            </button>
            <button
              onClick={() => setAchievementFilter('unlocked')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                achievementFilter === 'unlocked'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Desbloqueadas ({unlockedCount})
            </button>
            <button
              onClick={() => setAchievementFilter('locked')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                achievementFilter === 'locked'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Bloqueadas ({achievements.length - unlockedCount})
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Campaigns List */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-vct text-white tracking-wider flex items-center gap-2">
              <span>HISTÓRICO DE TORNEIOS</span>
            </h3>
            <span className="text-xs font-mono-vct text-slate-400">
              {history.length} {history.length === 1 ? 'campanha disputada' : 'campanhas disputadas'}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="bg-[#0e1624] border border-[#222e40] rounded-sm p-8 text-center text-slate-400 font-mono-vct text-xs">
              Nenhuma campanha registrada ainda. Monte seu elenco no modo Draft e dispute o torneio para eternizar sua equipe aqui!
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(camp => (
                <div
                  key={camp.id}
                  className={`p-4 rounded-sm border transition-all ${
                    camp.wonChampionship
                      ? 'bg-gradient-to-r from-[#172233] to-[#101724] border-[#e2b714]/60 shadow-lg shadow-[#e2b714]/10'
                      : 'bg-[#0f1624] border-[#222e40]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#1c2738]">
                    <div className="flex items-center gap-2">
                      {camp.wonChampionship ? (
                        <span className="px-2.5 py-1 rounded-sm bg-gradient-to-r from-amber-500 to-[#e2b714] text-slate-950 text-xs font-mono-vct font-bold flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" /> CAMPEÃO DO CHAMPIONS
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-sm bg-slate-800 text-slate-300 text-xs font-mono-vct">
                          Eliminado: {camp.stageReached.toUpperCase()}
                        </span>
                      )}

                      <span className="text-xs font-mono-vct text-slate-400">
                        • {camp.date} • Dificuldade: {camp.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono-vct">
                      {camp.mvp && (
                        <span className="px-2 py-0.5 rounded-sm bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1 font-bold">
                          <Award className="w-3.5 h-3.5 text-[#e2b714]" />
                          <span>MVP: {camp.mvp} {camp.mvpDetails ? `(${camp.mvpDetails.acs} ACS)` : ''}</span>
                        </span>
                      )}
                      <span className="text-slate-300">
                        Força: <strong className="text-[#ff4655]">{camp.overallRating} OVR</strong>
                      </span>
                    </div>
                  </div>

                  {/* 5 Roster Players */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {camp.lineup.map((p, pIdx) => {
                      const isMvp = camp.mvp === p.ign;
                      return (
                        <div
                          key={pIdx}
                          className={`p-2 rounded-sm border text-xs font-mono-vct transition-all ${
                            isMvp
                              ? 'bg-[#151c2b] border-[#e2b714]/60 shadow-sm shadow-[#e2b714]/10'
                              : 'bg-[#0b1019] border-[#1b2536]'
                          }`}
                        >
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              {p.role}
                              {isMvp && <Award className="w-2.5 h-2.5 text-[#e2b714]" />}
                            </span>
                            <span className="text-amber-400 font-bold">{p.rating}</span>
                          </div>
                          <span className={`font-bold block truncate ${isMvp ? 'text-[#e8c374]' : 'text-white'}`}>
                            {p.ign}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <TeamLogo teamName={p.team} size="xs" />
                            <span className="truncate">{p.team} ({p.year})</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Achievements Gallery */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="bg-[#0c121e] border border-[#202d40] rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-vct uppercase text-amber-400 font-extrabold tracking-wider">
                  Progresso das Conquistas
                </span>
                <span className="text-xs font-mono-vct text-slate-400">
                  ({unlockedCount} de {achievements.length} liberadas)
                </span>
              </div>
              <div className="w-full sm:w-80 h-2 bg-slate-900 rounded-sm mt-2 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#e2b714] rounded-sm transition-all duration-500"
                  style={{ width: `${achievementProgress}%` }}
                />
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-2xl font-vct font-black text-amber-300">
                {achievementProgress}%
              </span>
              <span className="text-[10px] font-mono-vct text-slate-400 block">
                Completado
              </span>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredAchievements.map(ach => {
              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-sm border relative transition-all duration-200 flex items-start gap-3.5 ${
                    ach.isUnlocked
                      ? 'bg-[#0f1726] border-[#e2b714]/50 shadow-md shadow-[#e2b714]/10'
                      : 'bg-[#0b1018] border-white/[0.08] opacity-75'
                  }`}
                >
                  {/* Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-sm shrink-0 flex items-center justify-center border ${
                      ach.isUnlocked
                        ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-slate-500'
                    }`}
                  >
                    {getAchievementIcon(ach.icon, ach.isUnlocked)}
                  </div>

                  {/* Body Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-base font-vct font-extrabold truncate ${
                          ach.isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {ach.title}
                      </h4>
                      {ach.isUnlocked ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono-vct font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          CONQUISTADA
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-mono-vct font-bold text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded-sm border border-white/10 shrink-0">
                          <Lock className="w-3 h-3 text-slate-500" />
                          BLOQUEADA
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-mono-vct mt-1 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-white/[0.06] text-[11px] font-mono-vct">
                      {ach.rewardLabel && (
                        <span className="text-amber-400/90 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          {ach.rewardLabel}
                        </span>
                      )}
                      <span className={`${ach.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                        {ach.progressText || (ach.isUnlocked ? 'Desbloqueada' : 'Em progresso')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
