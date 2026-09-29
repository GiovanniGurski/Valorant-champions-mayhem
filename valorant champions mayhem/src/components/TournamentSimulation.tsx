import React, { useState, useEffect } from 'react';
import { Trophy, ArrowRight, Play, FastForward, RotateCcw, ShieldAlert, Award, Flame, UserCheck, BarChart3, ChevronDown, ChevronUp, Star, Sparkles } from 'lucide-react';
import { Player, Role, Lineup, SeriesMatch, TournamentStage, Difficulty, CampaignHistory, MapGame, TournamentMvpStats, PlayerPerformance } from '../types';
import { generateTournamentSeries, simulateSingleMap, calculateTeamStats, calculateTournamentMvp, aggregateTournamentPerformances } from '../utils/simulation';
import { playRoundWinSound, playRoundLossSound, playVictoryFanfare, playSelectSound } from '../utils/audio';
import { StageQualifiedScreen } from './StageQualifiedScreen';
import { TeamLogo } from './TeamLogo';
import { TraitBadge } from './TraitBadge';

interface TournamentSimulationProps {
  lineup: Lineup;
  difficulty: Difficulty;
  onResetTournament: () => void;
  onSaveCampaign: (history: CampaignHistory) => void;
}

const STAGES: TournamentStage[] = ['group', 'quarters', 'semis', 'finals'];

export const TournamentSimulation: React.FC<TournamentSimulationProps> = ({
  lineup,
  difficulty,
  onResetTournament,
  onSaveCampaign,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [showQualifiedScreen, setShowQualifiedScreen] = useState<boolean>(false);
  const [series, setSeries] = useState<SeriesMatch | null>(null);
  const [currentMap, setCurrentMap] = useState<MapGame | null>(null);
  const [allTournamentMaps, setAllTournamentMaps] = useState<MapGame[]>([]);
  const [revealedEventsCount, setRevealedEventsCount] = useState<number>(0);
  const [isSeriesDecided, setIsSeriesDecided] = useState<boolean>(false);
  const [isChampionshipWon, setIsChampionshipWon] = useState<boolean>(false);
  const [isEliminated, setIsEliminated] = useState<boolean>(false);
  const [showScoreboardModal, setShowScoreboardModal] = useState<boolean>(false);
  const [showCurrentMapStats, setShowCurrentMapStats] = useState<boolean>(false);
  const [tournamentMvp, setTournamentMvp] = useState<TournamentMvpStats | null>(null);
  const [teamPerformances, setTeamPerformances] = useState<PlayerPerformance[]>([]);

  const teamStats = calculateTeamStats(lineup);
  const currentStage = STAGES[currentStageIndex];

  // Initialize first series
  useEffect(() => {
    initSeriesForStage(currentStage);
  }, [currentStageIndex]);

  const initSeriesForStage = (stage: TournamentStage) => {
    const newSeries = generateTournamentSeries(stage, difficulty);
    setSeries(newSeries);
    setIsSeriesDecided(false);
    setShowCurrentMapStats(false);

    // Prepare first map
    const firstMap = simulateSingleMap(lineup, newSeries.opponent.rating, 0);
    setCurrentMap(firstMap);
    setRevealedEventsCount(1); // reveal first event immediately
  };

  // Sound effect when revealing events
  useEffect(() => {
    if (!currentMap || revealedEventsCount === 0) return;
    const latestEvent = currentMap.events[revealedEventsCount - 1];
    if (latestEvent) {
      if (latestEvent.type === 'win') {
        playRoundWinSound();
      } else {
        playRoundLossSound();
      }
    }
  }, [revealedEventsCount, currentMap]);

  // Reveal next round event or finalize map
  const handleNextEvent = () => {
    if (!currentMap || !series) return;

    const revealedEvents = currentMap.events.slice(0, revealedEventsCount);
    const playerSituationsWon = revealedEvents.filter(e => e.type === 'win').length;
    const opponentSituationsWon = revealedEvents.filter(e => e.type === 'loss').length;
    const isMapDecided = playerSituationsWon >= 3 || opponentSituationsWon >= 3;

    if (revealedEventsCount < currentMap.events.length && !isMapDecided) {
      const nextEvent = currentMap.events[revealedEventsCount];
      if (nextEvent && nextEvent.type === 'win') {
        playRoundWinSound();
      } else if (nextEvent && nextEvent.type === 'loss') {
        playRoundLossSound();
      } else {
        playSelectSound();
      }
      setRevealedEventsCount(prev => prev + 1);
    } else {
      playSelectSound();
      // Map complete! Record map score in series
      finishCurrentMap();
    }
  };

  // Instant simulate entire map
  const handleInstantMap = () => {
    playSelectSound();
    if (!currentMap || !series) return;
    setRevealedEventsCount(currentMap.events.length);
    if (currentMap.playerWon) {
      playRoundWinSound();
    } else {
      playRoundLossSound();
    }
  };

  const finishCurrentMap = () => {
    if (!currentMap || !series) return;

    const updatedMaps = [...series.maps, currentMap];
    const newAllTournamentMaps = [...allTournamentMaps, currentMap];
    setAllTournamentMaps(newAllTournamentMaps);

    const playerWins = updatedMaps.filter(m => m.playerWon).length;
    const opponentWins = updatedMaps.filter(m => !m.playerWon).length;
    const targetWins = Math.ceil(series.bestOf / 2);

    const isSeriesWon = playerWins >= targetWins;
    const isSeriesLost = opponentWins >= targetWins;
    const seriesOver = isSeriesWon || isSeriesLost;

    const updatedSeries: SeriesMatch = {
      ...series,
      playerWins,
      opponentWins,
      currentMapIndex: series.currentMapIndex + 1,
      maps: updatedMaps,
      isFinished: seriesOver,
      playerWonSeries: seriesOver ? isSeriesWon : null,
    };

    setSeries(updatedSeries);

    if (seriesOver) {
      setIsSeriesDecided(true);

      // Aggregate performances across entire run
      const performances = aggregateTournamentPerformances(lineup, newAllTournamentMaps);
      setTeamPerformances(performances);

      const mvp = calculateTournamentMvp(lineup, newAllTournamentMaps);
      setTournamentMvp(mvp);

      if (isSeriesWon) {
        if (currentStageIndex === STAGES.length - 1) {
          // CHAMPIONSHIP WON!
          playVictoryFanfare();
          setIsChampionshipWon(true);
          saveCampaignRecord(true, currentStage, mvp, performances);
        } else {
          // Qualified to next stage!
          setShowQualifiedScreen(true);
        }
      } else {
        // Eliminated!
        setIsEliminated(true);
        saveCampaignRecord(false, currentStage, mvp, performances);
      }
    } else {
      // Proceed to next map of series
      const nextMap = simulateSingleMap(
        lineup,
        series.opponent.rating,
        updatedSeries.currentMapIndex,
        updatedMaps.map(m => m.mapName)
      );
      setCurrentMap(nextMap);
      setRevealedEventsCount(1);
    }
  };

  const saveCampaignRecord = (
    wonChampionship: boolean,
    finalStage: TournamentStage,
    mvpStats: TournamentMvpStats | null,
    performances: PlayerPerformance[]
  ) => {
    const mvpPlayer = mvpStats?.player;

    const record: CampaignHistory = {
      id: `camp_${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      difficulty,
      lineup: Object.entries(lineup)
        .filter(([_, p]) => p !== null)
        .map(([role, p]) => ({
          role: role as Role,
          ign: p!.ign,
          team: p!.team,
          year: p!.year,
          rating: p!.rating,
        })),
      overallRating: teamStats.overallRating,
      stageReached: finalStage,
      wonChampionship,
      seriesScore: `${series?.playerWins ?? 0} - ${series?.opponentWins ?? 0}`,
      mvp: mvpPlayer?.ign || 'Nenhum',
      mvpDetails: mvpPlayer && mvpStats ? {
        ign: mvpPlayer.ign,
        role: mvpPlayer.primaryRole,
        team: mvpPlayer.team,
        year: mvpPlayer.year,
        acs: mvpStats.acs,
        kdRatio: mvpStats.kdRatio,
        clutchesWon: mvpStats.clutchesWon,
        signatureAgent: mvpPlayer.signatureAgent,
      } : undefined,
    };

    onSaveCampaign(record);
  };

  const handleNextStageFromScreen = () => {
    setShowQualifiedScreen(false);
    setCurrentStageIndex(prev => prev + 1);
  };

  if (showQualifiedScreen) {
    return (
      <StageQualifiedScreen
        stage={currentStage}
        onNextStage={handleNextStageFromScreen}
      />
    );
  }

  if (!series || !currentMap) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono-vct">
        Carregando confrontos do Champions...
      </div>
    );
  }

  const mapSlots = Array.from({ length: series.bestOf });
  const revealedEvents = currentMap ? currentMap.events.slice(0, revealedEventsCount) : [];
  const playerSituationsWon = revealedEvents.filter(e => e.type === 'win').length;
  const opponentSituationsWon = revealedEvents.filter(e => e.type === 'loss').length;
  const isCurrentMapEnded = playerSituationsWon >= 3 || opponentSituationsWon >= 3 || revealedEventsCount >= currentMap.events.length;

  return (
    <div className="max-w-2xl mx-auto my-4 space-y-6">
      {/* Top Match Card Header (Straight Tactical Styling) */}
      <div className="bg-[#0b111c] border border-[#232f42] rounded p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 vct-grid-bg opacity-40 pointer-events-none" />

        {/* Stage & Opponent Tag */}
        <div className="flex items-center justify-between text-xs font-mono-vct text-slate-400 mb-2 relative z-10">
          <span className="text-[#38bdf8] font-bold tracking-wider">
            {series.stageTitle}
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="text-slate-400">Adversário:</span>
            <TeamLogo
              teamName={series.opponent.name}
              shortName={series.opponent.tag}
              logoUrl={series.opponent.logoUrl}
              primaryColor={series.opponent.logoColor}
              size="sm"
            />
            <span className="font-bold text-white font-mono-vct">{series.opponent.name}</span>
          </div>
        </div>

        {/* Best of X and Score Row */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <h3 className="text-3xl sm:text-4xl text-white font-serif tracking-wide">
            Best of {series.bestOf}
          </h3>
          <div className="text-3xl sm:text-4xl font-serif text-[#e8c374] font-bold tracking-widest">
            {series.playerWins} <span className="text-slate-500 font-normal px-1">-</span> {series.opponentWins}
          </div>
        </div>

        {/* Map Indicator Row: [M1 X] [M2 -] [M3 -] [M4 -] [M5 -] */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 relative z-10 overflow-x-auto pb-1">
          {mapSlots.map((_, idx) => {
            const playedMap = series.maps[idx];
            const isCurrent = idx === series.currentMapIndex;

            let content = '•';
            let styleClass = 'border-[#222e40] bg-[#111927] text-slate-500';

            if (playedMap) {
              if (playedMap.playerWon) {
                content = '✓';
                styleClass = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400';
              } else {
                content = 'X';
                styleClass = 'border-rose-500/50 bg-rose-950/30 text-rose-400 font-bold';
              }
            } else if (isCurrent) {
              styleClass = 'border-[#e2b714] bg-[#1a2335] text-[#e2b714] shadow-md shadow-[#e2b714]/20 animate-pulse';
            }

            return (
              <div
                key={idx}
                className={`flex-1 min-w-[50px] sm:min-w-[60px] h-14 rounded-sm border flex flex-col items-center justify-center transition-all ${styleClass}`}
              >
                <span className="text-[10px] font-mono-vct uppercase text-slate-400">
                  M{idx + 1}
                </span>
                <span className="text-base sm:text-lg font-mono-vct font-bold">
                  {content}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current Map Name & Score Pill */}
        <div className="flex items-center justify-between bg-[#131d2e] px-4 py-2.5 rounded-sm border border-[#28384f] text-xs font-mono-vct mb-4 relative z-10">
          <span className="text-slate-300 font-semibold">
            MAPA ATUAL: <strong className="text-white uppercase">{currentMap.mapName}</strong>
          </span>
          {isCurrentMapEnded ? (
            <span
              className={`font-bold px-2.5 py-1 rounded-sm text-xs ${
                currentMap.playerWon
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              Placar Final: {currentMap.playerScore} - {currentMap.opponentScore}
            </span>
          ) : (
            <span className="text-amber-400 font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Em andamento...
            </span>
          )}
        </div>

        {/* Active Lineup Traits Strip */}
        {(() => {
          const playersWithTraits = Object.values(lineup).filter((p): p is Player => !!p && !!p.trait);
          if (playersWithTraits.length === 0) return null;
          return (
            <div className="mb-4 bg-[#090f19] px-3.5 py-2 rounded-sm border border-white/[0.08] relative z-10">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono-vct text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Traits em Ação no Servidor ({playersWithTraits.length})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {playersWithTraits.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-[#121a28] px-2 py-0.5 rounded-sm border border-white/10">
                    <span className="text-[11px] font-vct font-bold text-white">{p.ign}:</span>
                    <TraitBadge trait={p.trait} size="xs" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Round Situations Tracker (3 Wins Rule) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#0e1624] px-4 py-2.5 rounded-sm border border-[#1f2d42] mb-5 relative z-10 text-xs font-mono-vct">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Situações de Round:</span>
            <span className="text-sm font-vct font-extrabold text-white">
              <span className="text-emerald-400">{playerSituationsWon}</span>
              <span className="text-slate-500 px-1">-</span>
              <span className="text-rose-400">{opponentSituationsWon}</span>
            </span>
            <span className="text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-sm border border-amber-400/20">
              3 vitórias = Mapa Vencido
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, sIdx) => {
              const ev = revealedEvents[sIdx];
              let icon = '•';
              let pillClass = 'bg-[#141f30] border-white/10 text-slate-500';
              if (ev) {
                if (ev.type === 'win') {
                  icon = '✓';
                  pillClass = 'bg-emerald-500/25 border-emerald-500 text-emerald-400 font-bold';
                } else {
                  icon = '✕';
                  pillClass = 'bg-rose-500/25 border-rose-500 text-rose-400 font-bold';
                }
              }
              return (
                <span
                  key={sIdx}
                  className={`w-6 h-6 rounded-sm border flex items-center justify-center text-[11px] font-mono-vct ${pillClass}`}
                  title={`Situação ${sIdx + 1}`}
                >
                  {icon}
                </span>
              );
            })}
          </div>
        </div>

        {/* Match Highlight Events Cards */}
        <div className="space-y-3.5 relative z-10">
          {revealedEvents.map((event, eIdx) => {
            const isWin = event.type === 'win';

            return (
              <div
                key={event.id || eIdx}
                className={`p-3.5 sm:p-4 rounded-sm border transition-all duration-200 animate-fadeIn ${
                  isWin
                    ? 'border-emerald-500/80 bg-gradient-to-r from-emerald-950/20 via-[#0d1624] to-[#0d1624] shadow-md shadow-emerald-500/10'
                    : 'border-rose-500/80 bg-gradient-to-r from-rose-950/20 via-[#0d1624] to-[#0d1624] shadow-md shadow-rose-500/10'
                }`}
              >
                {event.situationTitle && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-mono-vct font-extrabold uppercase px-1.5 py-0.2 rounded-sm border ${
                        isWin
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {event.situationTitle}
                    </span>
                    <span className="text-[10px] font-mono-vct text-slate-400">
                      Round {event.roundNumber}
                    </span>
                  </div>
                )}
                {(() => {
                  const tagMatch = event.text.match(/^(\[[A-ZÀ-Ú\s]+\])\s*(.*)$/);
                  if (tagMatch) {
                    const tag = tagMatch[1];
                    const restText = tagMatch[2];
                    const isGold = tag.includes('FINAL BOSS');
                    const isRed = tag.includes('FIRST BLOOD') || tag.includes('TILTADO');
                    const isOrange = tag.includes('AMARELÃO');
                    const isPurple = tag.includes('CLUTCH MASTER');

                    let tagColor = 'bg-amber-400/20 text-amber-300 border-amber-400/40';
                    if (isGold) tagColor = 'bg-amber-400/25 text-amber-300 border-amber-400/50 shadow-sm shadow-amber-400/30';
                    else if (isRed) tagColor = 'bg-rose-500/25 text-rose-300 border-rose-500/50';
                    else if (isOrange) tagColor = 'bg-orange-500/25 text-orange-300 border-orange-500/50';
                    else if (isPurple) tagColor = 'bg-purple-500/25 text-purple-300 border-purple-500/50';

                    return (
                      <p
                        className={`text-sm sm:text-base font-serif tracking-wide leading-relaxed ${
                          isWin ? 'text-[#8ce8a3]' : 'text-[#f5a7a7]'
                        }`}
                      >
                        <span className={`inline-block mr-2 px-2 py-0.5 rounded-sm text-[11px] font-mono-vct font-extrabold uppercase border ${tagColor}`}>
                          {tag.replace('[', '').replace(']', '')}
                        </span>
                        {restText}
                      </p>
                    );
                  }
                  return (
                    <p
                      className={`text-sm sm:text-base font-serif tracking-wide leading-relaxed ${
                        isWin ? 'text-[#8ce8a3]' : 'text-[#f5a7a7]'
                      }`}
                    >
                      {event.text}
                    </p>
                  );
                })()}
              </div>
            );
          })}
        </div>

        {/* Status text & map stats toggle */}
        {isCurrentMapEnded && (
          <div className="mt-6 pt-4 border-t border-[#1e2a3c] relative z-10 space-y-3">
            <div className="text-center">
              <span
                className={`text-xl sm:text-2xl font-vct tracking-widest uppercase font-bold ${
                  currentMap.playerWon ? 'text-emerald-400' : 'text-[#f58b95]'
                }`}
              >
                {currentMap.playerWon ? 'MAPA VENCIDO' : 'GAME LOST'}
              </span>
            </div>

            {/* Quick map scoreboard toggle */}
            {currentMap.playerPerformances && (
              <div className="text-center">
                <button
                  onClick={() => setShowCurrentMapStats(!showCurrentMapStats)}
                  className="text-xs font-mono-vct text-slate-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{showCurrentMapStats ? 'Ocultar Estatísticas do Mapa' : 'Ver Estatísticas do Mapa'}</span>
                  {showCurrentMapStats ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showCurrentMapStats && (
                  <div className="mt-3 bg-[#080d16] p-3 rounded-sm border border-[#212d3f] animate-fadeIn text-left overflow-x-auto">
                    <div className="text-[10px] font-mono-vct text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Jogador</span>
                      <span>K / D / A • ACS</span>
                    </div>
                    <div className="space-y-1.5">
                      {currentMap.playerPerformances.map((perf, pIdx) => {
                        const playerObj = Object.values(lineup).find(p => p?.id === perf.playerId);
                        return (
                          <div key={pIdx} className="flex items-center justify-between text-xs font-mono-vct py-1 px-2 rounded-sm bg-[#101724]">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{perf.ign}</span>
                              {playerObj?.trait && <TraitBadge trait={playerObj.trait} size="xs" />}
                              <span className="text-[10px] text-slate-400">{perf.signatureAgent}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-300">{perf.kills}/{perf.deaths}/{perf.assists}</span>
                              <span className="font-bold text-[#e2b714] w-14 text-right">{perf.acs} ACS</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Match Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 relative z-10">
          {!isCurrentMapEnded ? (
            <>
              <button
                id="next-round-btn"
                onClick={handleNextEvent}
                className="flex-1 py-3 px-4 rounded-sm bg-[#ff4655] hover:bg-[#ff5e6c] text-white font-vct text-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff4655]/20"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Próximo Round</span>
              </button>
              <button
                id="instant-map-btn"
                onClick={handleInstantMap}
                className="py-3 px-4 rounded-sm bg-[#192335] hover:bg-[#222f47] border border-slate-700 text-slate-300 font-mono-vct text-xs transition-colors flex items-center gap-1.5"
                title="Mostrar resultado completo do mapa"
              >
                <FastForward className="w-4 h-4" />
                <span>Simular Restante</span>
              </button>
            </>
          ) : (
            <button
              id="continue-series-btn"
              onClick={handleNextEvent}
              className="w-full py-3.5 rounded-sm bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#e5c158] hover:to-[#c99516] text-slate-950 font-vct text-2xl tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/30"
            >
              <span>{isSeriesDecided ? 'VER RESULTADO DA SÉRIE' : 'IR PARA O PRÓXIMO MAPA'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Grand Final Championship Victory Modal with Highlighted MVP */}
      {isChampionshipWon && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="vct-corner-box relative bg-gradient-to-b from-[#182030] to-[#0a0f17] border-2 border-[#e2b714] rounded w-full max-w-xl p-6 sm:p-8 text-center text-white shadow-2xl shadow-[#e2b714]/20 animate-fadeIn my-auto">
            <div className="vct-corner-tr" />
            <div className="vct-corner-bl" />

            {/* Trophy Icon */}
            <div className="w-20 h-20 rounded-sm bg-gradient-to-tr from-[#e2b714] to-amber-300 flex items-center justify-center mx-auto mb-3 text-slate-950 shadow-2xl shadow-[#e2b714]/50">
              <Trophy className="w-10 h-10" />
            </div>

            <span className="text-xs font-mono-vct text-[#e2b714] font-bold tracking-[0.3em] uppercase">
              VALORANT CHAMPIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-vct text-white tracking-wider leading-none mt-1 mb-2">
              CAMPEÕES MUNDIAIS!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono-vct mb-5 max-w-md mx-auto">
              Sua escalação personalizada conquistou o troféu mundial com maestria tática e precisão sob pressão!
            </p>

            {/* HIGHLIGHTED MVP CARD */}
            {tournamentMvp && (
              <div className="bg-gradient-to-r from-amber-500/15 via-[#1a2333] to-amber-500/15 border-2 border-[#e2b714] rounded-sm p-4 sm:p-5 mb-5 text-left shadow-lg shadow-[#e2b714]/15 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-sm bg-gradient-to-r from-[#e2b714] to-amber-400 text-slate-950 font-vct text-xs tracking-wider font-black uppercase flex items-center gap-1 shadow-sm">
                      <Award className="w-3.5 h-3.5 fill-slate-950" />
                      MVP DA CAMPANHA
                    </span>
                    <span className="text-xs font-mono-vct text-[#e8c374] font-semibold">
                      MELHOR JOGADOR DO TIME
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono-vct text-slate-400">{tournamentMvp.player.primaryRole}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-3xl font-vct text-white tracking-wide">
                        {tournamentMvp.player.ign}
                      </h3>
                      {tournamentMvp.player.trait && (
                        <TraitBadge trait={tournamentMvp.player.trait} size="sm" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono-vct text-slate-300 flex-wrap">
                      <span>{tournamentMvp.player.name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-amber-400 font-semibold">{tournamentMvp.player.signatureAgent}</span>
                      <span className="text-slate-600">•</span>
                      <span className="inline-flex items-center gap-1.5 text-slate-300">
                        <TeamLogo teamName={tournamentMvp.player.team} size="xs" />
                        <span>{tournamentMvp.player.team} '{tournamentMvp.player.year.toString().slice(2)}</span>
                      </span>
                    </div>
                  </div>

                  {/* MVP Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-[#0c121c] p-2.5 rounded-sm border border-[#29384e] text-center shrink-0">
                    <div className="px-2">
                      <span className="text-[9px] uppercase font-mono-vct text-slate-400 block">ACS Médio</span>
                      <span className="text-lg font-vct font-bold text-[#e2b714]">{tournamentMvp.acs}</span>
                    </div>
                    <div className="px-2 border-x border-[#1e2a3c]">
                      <span className="text-[9px] uppercase font-mono-vct text-slate-400 block">K/D Ratio</span>
                      <span className="text-lg font-vct font-bold text-emerald-400">{tournamentMvp.kdRatio}</span>
                    </div>
                    <div className="px-2">
                      <span className="text-[9px] uppercase font-mono-vct text-slate-400 block">Clutches</span>
                      <span className="text-lg font-vct font-bold text-sky-400">{tournamentMvp.clutchesWon}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-serif italic text-amber-200/90 mt-3 pt-2.5 border-t border-[#2a384e]">
                  "{tournamentMvp.highlightText}"
                </p>
              </div>
            )}

            {/* Scoreboard Accordion / Roster overview */}
            <div className="mb-5">
              <button
                onClick={() => setShowScoreboardModal(!showScoreboardModal)}
                className="w-full py-2 px-3 rounded-sm bg-[#111926] hover:bg-[#162132] border border-[#233145] text-xs font-mono-vct text-slate-300 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5 text-slate-200">
                  <BarChart3 className="w-3.5 h-3.5 text-[#e2b714]" />
                  <span>{showScoreboardModal ? 'Ocultar Estatísticas do Elenco' : 'Ver Estatísticas de Todos os 5 Jogadores'}</span>
                </span>
                {showScoreboardModal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showScoreboardModal && (
                <div className="mt-2 bg-[#0a0f18] p-3 rounded-sm border border-[#222f42] text-left space-y-2 animate-fadeIn">
                  <div className="grid grid-cols-12 text-[10px] font-mono-vct text-slate-400 uppercase tracking-wider pb-1 border-b border-[#1c2738]">
                    <span className="col-span-5">Jogador</span>
                    <span className="col-span-2 text-center">K / D</span>
                    <span className="col-span-2 text-center">K/D</span>
                    <span className="col-span-3 text-right">ACS Médio</span>
                  </div>
                  {teamPerformances.map((perf) => {
                    const isMvp = tournamentMvp?.player.id === perf.playerId;
                    return (
                      <div
                        key={perf.playerId}
                        className={`grid grid-cols-12 items-center text-xs font-mono-vct py-1.5 px-2 rounded-sm ${
                          isMvp
                            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                            : 'bg-[#101724] border border-[#1b2536] text-slate-300'
                        }`}
                      >
                        <div className="col-span-5 flex items-center gap-1.5 truncate">
                          {isMvp && <Award className="w-3 h-3 text-[#e2b714] shrink-0" />}
                          <TeamLogo teamName={lineup[perf.role]?.team || ''} size="xs" />
                          <span className="font-bold text-white truncate">{perf.ign}</span>
                          <span className="text-[10px] text-slate-400">({perf.role[0]})</span>
                        </div>
                        <span className="col-span-2 text-center text-slate-300 text-[11px]">{perf.kills}/{perf.deaths}</span>
                        <span className={`col-span-2 text-center font-bold ${perf.kdRatio >= 1 ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {perf.kdRatio}
                        </span>
                        <span className="col-span-3 text-right font-bold text-[#e2b714]">
                          {perf.acs} ACS
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                id="victory-new-draft-btn"
                onClick={() => {
                  playSelectSound();
                  onResetTournament();
                }}
                className="w-full py-3 rounded-sm bg-gradient-to-r from-[#ff4655] to-[#e03746] hover:from-[#ff5e6c] hover:to-[#ff4655] text-white font-vct text-xl tracking-wider uppercase transition-colors shadow-lg shadow-[#ff4655]/20"
              >
                MONTAR NOVO ELENCO (DRAFT)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Elimination Screen with Highlighted MVP */}
      {isEliminated && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="vct-corner-box-red relative bg-[#120f15] border-2 border-rose-600 rounded w-full max-w-lg p-6 sm:p-8 text-center text-white shadow-2xl shadow-rose-600/20 animate-fadeIn my-auto">
            <div className="w-16 h-16 rounded-sm bg-rose-600/20 border border-rose-500 flex items-center justify-center mx-auto mb-3 text-rose-500">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono-vct text-rose-400 font-bold tracking-widest uppercase">
              FIM DA LINHA
            </span>
            <h2 className="text-3xl sm:text-4xl font-vct text-white tracking-wider leading-none mt-1 mb-2">
              EQUIPE ELIMINADA
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono-vct mb-5 flex items-center justify-center gap-2 flex-wrap">
              <span>Sua equipe foi superada por</span>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-slate-900 border border-slate-700 text-white font-bold font-vct">
                <TeamLogo
                  teamName={series.opponent.name}
                  shortName={series.opponent.tag}
                  logoUrl={series.opponent.logoUrl}
                  primaryColor={series.opponent.logoColor}
                  size="sm"
                />
                {series.opponent.name}
              </span>
              <span>na {series.stageTitle}.</span>
            </p>

            {/* HIGHLIGHTED MVP IN DEFEAT */}
            {tournamentMvp && (
              <div className="bg-[#19111b] border border-rose-500/40 rounded-sm p-4 mb-5 text-left">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-sm bg-rose-600/30 border border-rose-500/40 text-rose-300 font-vct text-xs tracking-wider uppercase font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-rose-300" />
                    DESTAQUE DO TIME (MVP)
                  </span>
                  <span className="text-[10px] font-mono-vct text-slate-400">{tournamentMvp.player.primaryRole}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-vct text-white">
                      {tournamentMvp.player.ign}
                    </h3>
                    <div className="text-xs font-mono-vct text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{tournamentMvp.player.signatureAgent}</span>
                      <span>•</span>
                      <TeamLogo teamName={tournamentMvp.player.team} size="xs" />
                      <span>{tournamentMvp.player.team} ({tournamentMvp.player.year})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#0d0a11] px-3 py-1.5 rounded-sm border border-rose-950">
                    <div className="text-center">
                      <span className="text-[9px] font-mono-vct text-slate-400 uppercase block">ACS</span>
                      <span className="text-base font-vct font-bold text-amber-400">{tournamentMvp.acs}</span>
                    </div>
                    <div className="text-center border-l border-slate-800 pl-3">
                      <span className="text-[9px] font-mono-vct text-slate-400 uppercase block">K/D</span>
                      <span className="text-base font-vct font-bold text-rose-300">{tournamentMvp.kdRatio}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-mono-vct text-slate-300 mt-2 pt-2 border-t border-rose-950">
                  Apesar da eliminação, lutou bravamente e liderou sua equipe em abates e impacto de rounds.
                </p>
              </div>
            )}

            {/* Scoreboard Toggle in Elimination */}
            <div className="mb-5">
              <button
                onClick={() => setShowScoreboardModal(!showScoreboardModal)}
                className="w-full py-2 px-3 rounded-sm bg-[#181119] hover:bg-[#221624] border border-rose-950 text-xs font-mono-vct text-slate-300 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5 text-slate-300">
                  <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{showScoreboardModal ? 'Ocultar Estatísticas do Elenco' : 'Ver Estatísticas do Elenco'}</span>
                </span>
                {showScoreboardModal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showScoreboardModal && (
                <div className="mt-2 bg-[#0e0a12] p-3 rounded-sm border border-rose-950 text-left space-y-1.5 animate-fadeIn">
                  <div className="grid grid-cols-12 text-[10px] font-mono-vct text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                    <span className="col-span-5">Jogador</span>
                    <span className="col-span-2 text-center">K / D</span>
                    <span className="col-span-2 text-center">K/D</span>
                    <span className="col-span-3 text-right">ACS</span>
                  </div>
                  {teamPerformances.map(perf => (
                    <div
                      key={perf.playerId}
                      className="grid grid-cols-12 items-center text-xs font-mono-vct py-1 px-2 rounded-sm bg-[#16101c]"
                    >
                      <span className="col-span-5 font-bold text-white truncate">{perf.ign}</span>
                      <span className="col-span-2 text-center text-slate-400 text-[11px]">{perf.kills}/{perf.deaths}</span>
                      <span className="col-span-2 text-center font-bold text-slate-300">{perf.kdRatio}</span>
                      <span className="col-span-3 text-right font-bold text-rose-400">{perf.acs} ACS</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              id="eliminated-retry-btn"
              onClick={() => {
                playSelectSound();
                onResetTournament();
              }}
              className="w-full py-3 rounded-sm bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-vct text-xl tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>MONTAR NOVA EQUIPE</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
