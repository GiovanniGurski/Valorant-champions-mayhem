import { Lineup, MatchEvent, MapGame, SeriesMatch, TournamentStage, Difficulty, Player, PlayerPerformance, TournamentMvpStats } from '../types';
import { TEAMS_DATABASE } from '../data/teamsAndPlayers';

const MAPS_POOL = [
  'Ascent',
  'Haven',
  'Bind',
  'Split',
  'Lotus',
  'Sunset',
  'Abyss',
  'Pearl',
];

export interface TeamStatsCalculation {
  overallRating: number;
  consistency: number;
  clutch: number;
  synergy: number;
  flexibility: number;
  synergyBonuses: string[];
}

export function calculateTeamStats(lineup: Lineup): TeamStatsCalculation {
  const players = Object.values(lineup).filter((p): p is Player => p !== null);
  if (players.length === 0) {
    return {
      overallRating: 0,
      consistency: 0,
      clutch: 0,
      synergy: 0,
      flexibility: 0,
      synergyBonuses: [],
    };
  }

  const avg = (fn: (p: Player) => number) =>
    Math.round(players.reduce((acc, p) => acc + fn(p), 0) / players.length);

  let overallRating = avg(p => p.rating);
  let consistency = avg(p => p.consistency);
  let clutch = avg(p => p.clutch);
  let synergy = avg(p => p.synergy);
  let flexibility = avg(p => p.flexibility);

  const synergyBonuses: string[] = [];

  // Team pairing synergy (players from same team)
  const teamCounts: Record<string, number> = {};
  players.forEach(p => {
    teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
  });

  Object.entries(teamCounts).forEach(([teamName, count]) => {
    if (count >= 2) {
      const bonus = (count - 1) * 2;
      synergy += bonus;
      overallRating += Math.round(bonus / 2);
      synergyBonuses.push(`Química de Elenco (${count}x ${teamName}): +${bonus} Sinergia`);
    }
  });

  // Role balance bonus
  const hasDuelist = !!lineup.Duelist;
  const hasController = !!lineup.Controller;
  const hasInitiator = !!lineup.Initiator;
  const hasSentinel = !!lineup.Sentinel;
  const hasFlex = !!lineup.Flex;

  if (hasDuelist && hasController && hasInitiator && hasSentinel && hasFlex) {
    synergy += 4;
    overallRating += 2;
    synergyBonuses.push('Composição Balanceada (5 Funções Ativas): +4 Sinergia');
  }

  // Champions Winners Aura bonus
  const championsWinners = players.filter(p => p.isChampionsWinner);
  if (championsWinners.length > 0) {
    const clutchBonus = championsWinners.length * 2;
    clutch += clutchBonus;
    synergyBonuses.push(`Pedigree de Campeão (${championsWinners.length}x): +${clutchBonus} Clutch`);
  }

  // Trait impacts on team stat sheet (balanced & tactical)
  players.forEach(p => {
    if (p.trait?.id === 'natural_synergy') {
      synergy += 3;
      synergyBonuses.push(`Química Natural (${p.ign}): +3 Sinergia`);
    } else if (p.trait?.id === 'ice_in_the_veins') {
      clutch += 2;
      synergyBonuses.push(`Sangue Frio (${p.ign}): +2 Clutch`);
    } else if (p.trait?.id === 'final_boss') {
      overallRating += 1;
      clutch += 2;
      synergyBonuses.push(`Aura de Final Boss (${p.ign}): +1 Rating, +2 Clutch`);
    } else if (p.trait?.id === 'choke_artist') {
      clutch -= 2;
      synergyBonuses.push(`Pressão Decisiva (${p.ign}): -2 Clutch`);
    }
  });

  return {
    overallRating: Math.min(99, Math.max(60, overallRating)),
    consistency: Math.min(99, Math.max(60, consistency)),
    clutch: Math.min(99, Math.max(60, clutch)),
    synergy: Math.min(99, Math.max(60, synergy)),
    flexibility: Math.min(99, Math.max(60, flexibility)),
    synergyBonuses,
  };
}

export function generateTournamentSeries(
  stage: TournamentStage,
  difficulty: Difficulty,
  usedOpponents: string[] = []
): SeriesMatch {
  // Select an appropriate opponent from the database
  const candidateTeams = TEAMS_DATABASE.filter(t => !usedOpponents.includes(t.id));
  const opponentTeam = candidateTeams.length > 0 
    ? candidateTeams[Math.floor(Math.random() * candidateTeams.length)] 
    : TEAMS_DATABASE[Math.floor(Math.random() * TEAMS_DATABASE.length)];

  let stageTitle = '';
  let bestOf: 1 | 3 | 5 = 3;
  let baseOpponentRating = 86;

  switch (stage) {
    case 'group':
      stageTitle = 'FASE DE GRUPOS - ABERTURA';
      bestOf = 3;
      baseOpponentRating = 90;
      break;
    case 'quarters':
      stageTitle = 'QUARTAS DE FINAL - PLAYOFFS';
      bestOf = 3;
      baseOpponentRating = 93;
      break;
    case 'semis':
      stageTitle = 'SEMIFINAIS - PLAYOFFS';
      bestOf = 3;
      baseOpponentRating = 95;
      break;
    case 'finals':
      stageTitle = 'GRANDE FINAL DO CHAMPIONS';
      bestOf = 5;
      baseOpponentRating = 97;
      break;
  }

  // Calculate actual opponent roster average rating
  const opponentAvg = Math.round(
    opponentTeam.roster.reduce((acc, p) => acc + (p?.rating || 88), 0) / opponentTeam.roster.length
  );
  // Blend stage expectation with team prestige, ensuring challenging, authentic high-tier competition
  let finalOpponentRating = Math.round((baseOpponentRating * 0.50) + (opponentAvg * 0.50));

  if (difficulty === 'normal') finalOpponentRating += 2;
  if (difficulty === 'hard') finalOpponentRating += 4;
  if (difficulty === 'master') finalOpponentRating += 6;
  finalOpponentRating = Math.min(99, Math.max(88, finalOpponentRating));

  return {
    stage,
    stageTitle,
    opponent: {
      name: `${opponentTeam.name} (${opponentTeam.year})`,
      tag: opponentTeam.shortName,
      region: opponentTeam.region,
      rating: finalOpponentRating,
      logoColor: opponentTeam.primaryColor,
      logoUrl: opponentTeam.logoUrl,
      rosterNames: opponentTeam.roster.map(p => p.ign),
    },
    bestOf,
    playerWins: 0,
    opponentWins: 0,
    currentMapIndex: 0,
    maps: [],
    isFinished: false,
    playerWonSeries: null,
  };
}

export function simulateSingleMap(
  lineup: Lineup,
  opponentRating: number,
  mapIndex: number,
  usedMaps: string[] = []
): MapGame {
  const stats = calculateTeamStats(lineup);
  const players = Object.values(lineup).filter((p): p is Player => p !== null);

  // Pick map
  const availableMaps = MAPS_POOL.filter(m => !usedMaps.includes(m));
  const mapName = availableMaps.length > 0 
    ? availableMaps[Math.floor(Math.random() * availableMaps.length)] 
    : MAPS_POOL[mapIndex % MAPS_POOL.length];

  // Base probability of winning a round situation - calibrated for harder authentic VCT tier competition
  const ratingDiff = stats.overallRating - opponentRating;
  const synergyMod = (stats.synergy - 78) * 0.0022;
  const consistencyMod = (stats.consistency - 78) * 0.0015;
  const clutchMod = (stats.clutch - 78) * 0.0020;

  // Composition balance check
  const isFullComp = !!lineup.Duelist && !!lineup.Controller && !!lineup.Initiator && !!lineup.Sentinel && !!lineup.Flex;
  const compModifier = isFullComp ? 0.015 : -0.065;

  // Champions winners aura
  const champWinnersCount = players.filter(p => p.isChampionsWinner).length;
  const champModifier = champWinnersCount * 0.007;

  // Detect active lineup traits
  const fbKingPlayer = players.find(p => p.trait?.id === 'first_blood_king');
  const finalBossPlayer = players.find(p => p.trait?.id === 'final_boss');
  const icePlayer = players.find(p => p.trait?.id === 'ice_in_the_veins');
  const clutchMasterPlayer = players.find(p => p.trait?.id === 'clutch_master');
  const chokePlayer = players.find(p => p.trait?.id === 'choke_artist');
  const tiltedPlayer = players.find(p => p.trait?.id === 'tilted');
  const inconsistentPlayer = players.find(p => p.trait?.id === 'inconsistent');

  // Harder base probability (40.0% base vs equal opponent, demanding higher synergy, balanced comp and star performances)
  let baseRoundProb = 0.400 + (ratingDiff * 0.009) + synergyMod + consistencyMod + compModifier + champModifier;
  baseRoundProb = Math.min(0.56, Math.max(0.20, baseRoundProb));

  const events: MatchEvent[] = [];

  // Individual player tracking for this map
  const playerStatsMap: Record<string, { kills: number; deaths: number; assists: number; clutches: number; firstBloods: number }> = {};
  players.forEach(p => {
    playerStatsMap[p.id] = { kills: 0, deaths: 0, assists: 0, clutches: 0, firstBloods: 0 };
  });

  interface SituationMeta {
    title: string;
    roundNumber: number;
    winTemplates: ((p: Player) => string)[];
    lossTemplates: string[];
  }

  const SITUATIONS: SituationMeta[] = [
    {
      title: 'SITUAÇÃO 1 · PISTOL ROUND',
      roundNumber: 1,
      winTemplates: [
        (p: Player) => `${p.ign} acerta dois headshots relâmpago com a Classic, abre o bombsite e garante a primeira rodada!`,
        (p: Player) => `Mira cirúrgica de Ghost: ${p.ign} anota o First Blood e sua equipe conquista o pistol round sem baixas!`,
        (p: Player) => `${p.ign} lê a investida adversária no pistol, converte duelo 1v2 e abre o placar com moral!`,
      ],
      lossTemplates: [
        'Avanço coordenado do adversário na rodada de pistolas surpreende a defesa e custa o round inicial.',
        'Confronto tenso de Classic no pistol: o adversário leva a melhor nas trades e garante o primeiro ponto.',
      ],
    },
    {
      title: 'SITUAÇÃO 2 · ROUND FORÇADO & ANTI-ECO',
      roundNumber: 3,
      winTemplates: [
        (p: Player) => `${p.ign} impõe o ritmo com Spectre/Stinger, neutraliza o forçado inimigo e consolida a economia!`,
        (p: Player) => `Anti-eco exemplar: ${p.ign} segura o avanço rápido com utilitários perfeitos e anota um 3K avassalador!`,
        (p: Player) => `Eco round espetacular! Sua equipe surpreende com pistolas, rouba armamento pesado com ${p.ign} e vira o round!`,
      ],
      lossTemplates: [
        'Surpresa econômica: o adversário acerta miras afiadas de Sheriff na média distância e vence a rodada forçada.',
        'Sua equipe força o armamento mas é surpreendida pela postura recuada da equipe adversária.',
      ],
    },
    {
      title: 'SITUAÇÃO 3 · FULL BUY DE RIFLES',
      roundNumber: 9,
      winTemplates: [
        (p: Player) => `${p.ign} acha duas eliminações cruciais de Vandal no meio do mapa, quebrando a defesa adversária!`,
        (p: Player) => `Tiroteio de alto nível: ${p.ign} encaixa um tiro de Operator na longa distância e abre o mapa para o plant!`,
        (p: Player) => `Execução tática perfeita: utilitários sincronizados de ${p.ign} limpam as esquinas e garantem o round armado!`,
      ],
      lossTemplates: [
        'Trocação pesada no armamento total: o adversário se posiciona melhor no bombsite e garante a rodada de rifles.',
        'Ataque interceptado: a defesa adversária segura os ângulos com firmeza e anula a investida armada da sua equipe.',
      ],
    },
    {
      title: 'SITUAÇÃO 4 · RETAKE & CLUTCH',
      roundNumber: 18,
      winTemplates: [
        (p: Player) => `CLUTCH ÉPICO! ${p.ign} mantém a frieza sob extrema pressão, converte um 1v2 espetacular e desarma o Spike!`,
        (p: Player) => `Retake cirúrgico: coordenação impecável liderada por ${p.ign} limpa o bomb com 5 segundos restantes!`,
        (p: Player) => `${p.ign} protege o Spike plantado contra 3 defensores e garante a rodada mais tensa da partida!`,
      ],
      lossTemplates: [
        'Tempo esgotado no pós-plant: os utilitários adversários atrasam o avanço e impedem o defuse do Spike.',
        'O adversário surpreende com um lurk silencioso pelas costas e fatura o retake decisivo.',
      ],
    },
    {
      title: 'SITUAÇÃO 5 · PONTO DECISIVO DO MAPA',
      roundNumber: 24,
      winTemplates: [
        (p: Player) => `PONTO DO MAPA! ${p.ign} brilha no tiroteio decisivo, derruba o último oponente e garante a vitória no mapa!`,
        (p: Player) => `OVERTIME GLORIOSO! ${p.ign} crava a mira com frieza absurda e fecha a partida para a festa da torcida!`,
      ],
      lossTemplates: [
        'PONTO DECISIVO: o adversário arrisca uma investida agressiva, encaixa o abate final e vence o mapa.',
        'Round final disputado milésimo a milésimo, mas o adversário assegura o ponto do mapa na prorrogação.',
      ],
    },
  ];

  let playerSituationsWon = 0;
  let opponentSituationsWon = 0;
  let consecutiveLosses = 0;
  let clutchMasterRescued = false;

  // Simulate up to 5 situations. As soon as a team reaches 3 wins, they win the map!
  for (let i = 0; i < SITUATIONS.length; i++) {
    // If either team already has 3 wins, the map is decided!
    if (playerSituationsWon >= 3 || opponentSituationsWon >= 3) {
      break;
    }

    const situation = SITUATIONS[i];
    let sitProb = baseRoundProb;

    // TRAIT: First Blood King boost in Pistol Round (Situation 1) - balanced
    if (i === 0 && fbKingPlayer) {
      sitProb += 0.07;
    }

    // Clutch adjustment for situations 4 and 5 (retake and map point)
    if (i >= 3) {
      sitProb += clutchMod * 1.2;

      // TRAIT: Final Boss tactical clutch boost
      if (finalBossPlayer) {
        sitProb += 0.06;
      }

      // TRAIT: Choke Artist penalty in high stakes
      if (chokePlayer) {
        sitProb -= 0.06;
      }
    }

    // TRAIT: Tiltado and Ice in the Veins after round drop
    if (consecutiveLosses >= 1) {
      if (tiltedPlayer) {
        // High synergy / IGL leadership can neutralize tilt
        if (stats.synergy < 82) {
          sitProb -= 0.04;
        }
      }
      if (icePlayer) {
        // Sangue Frio prevents drop and stabilizes team
        sitProb += 0.03;
      }
    }

    // Dynamic round variance (+/- 3%)
    sitProb += (Math.random() - 0.50) * 0.06;
    sitProb = Math.min(0.58, Math.max(0.24, sitProb));

    let wonSituation = Math.random() < sitProb;

    // TRAIT: Clutch Master tactical miracle rescue on map point
    if (!wonSituation && clutchMasterPlayer && opponentSituationsWon >= 2 && !clutchMasterRescued) {
      if (Math.random() < 0.35) {
        wonSituation = true;
        clutchMasterRescued = true;
      }
    }

    // Select performing players
    const duelist = players.find(p => p.primaryRole === 'Duelist') || players[0];
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    const activePlayer = Math.random() < 0.40 ? duelist : randomPlayer;

    if (wonSituation) {
      playerSituationsWon++;
      consecutiveLosses = 0;

      let eventText = '';

      // Specific narrative hooks for traits
      if (i === 0 && fbKingPlayer && Math.random() < 0.75) {
        eventText = `[FIRST BLOOD] ${fbKingPlayer.ign} explode no bombsite de Classic, anota a primeira baixa relâmpago e garante o pistol!`;
        if (playerStatsMap[fbKingPlayer.id]) playerStatsMap[fbKingPlayer.id].firstBloods += 1;
      } else if (clutchMasterRescued) {
        eventText = `[CLUTCH MASTER] REVIRAVOLTA HEROICA! Quando tudo parecia perdido no map point, ${clutchMasterPlayer!.ign} acha um ângulo impossível, converte o 1v3 e salva a equipe!`;
        if (playerStatsMap[clutchMasterPlayer!.id]) playerStatsMap[clutchMasterPlayer!.id].clutches += 1;
      } else if ((i === 3 || i === 4) && finalBossPlayer && Math.random() < 0.70) {
        eventText = `[FINAL BOSS] Sob pressão sufocante, ${finalBossPlayer.ign} assume o servidor, fecha o round com frieza absurda e levanta a arena!`;
        if (playerStatsMap[finalBossPlayer.id]) playerStatsMap[finalBossPlayer.id].clutches += 1;
      } else {
        const template = situation.winTemplates[Math.floor(Math.random() * situation.winTemplates.length)];
        eventText = template(activePlayer);
      }

      // Update stats
      if (playerStatsMap[activePlayer.id]) {
        playerStatsMap[activePlayer.id].kills += Math.random() < 0.4 ? 2 : 1;
        if (i === 3 || i === 4) playerStatsMap[activePlayer.id].clutches += 1;
        if (i === 0) playerStatsMap[activePlayer.id].firstBloods += 1;
      }
      const assistPlayer = players[Math.floor(Math.random() * players.length)];
      if (assistPlayer.id !== activePlayer.id && playerStatsMap[assistPlayer.id]) {
        playerStatsMap[assistPlayer.id].assists += 1;
      }

      events.push({
        id: `sit-${i}-${situation.roundNumber}`,
        roundNumber: situation.roundNumber,
        text: eventText,
        type: 'win',
        clutchPlayer: activePlayer.ign,
        situationTitle: situation.title,
        situationIndex: i + 1,
      });
    } else {
      opponentSituationsWon++;
      consecutiveLosses++;

      let lossText = '';

      // Specific narrative hooks for negative traits
      if ((i === 3 || i === 4) && chokePlayer && Math.random() < 0.65) {
        lossText = `[AMARELÃO] As mãos suaram frio no round decisivo: ${chokePlayer.ign} erra a mira sob tensão máxima e o adversário fatura o ponto!`;
      } else if (consecutiveLosses >= 2 && tiltedPlayer && stats.synergy < 82 && Math.random() < 0.65) {
        lossText = `[TILTADO] ${tiltedPlayer.ign} perde o foco com a desvantagem no placar e a desorganização defensiva custa a rodada.`;
      } else {
        lossText = situation.lossTemplates[Math.floor(Math.random() * situation.lossTemplates.length)];
      }

      const deadPlayer = players[Math.floor(Math.random() * players.length)];
      if (playerStatsMap[deadPlayer.id]) {
        playerStatsMap[deadPlayer.id].deaths += 1;
      }

      events.push({
        id: `sit-${i}-${situation.roundNumber}`,
        roundNumber: situation.roundNumber,
        text: lossText,
        type: 'loss',
        situationTitle: situation.title,
        situationIndex: i + 1,
      });
    }
  }

  // Determine map result strictly based on who won 3 situations
  const playerWon = playerSituationsWon >= 3;

  // Realistic Valorant game score derived from round situations (first to 3 wins)
  let playerScore = 13;
  let opponentScore = 8;

  if (playerWon) {
    if (opponentSituationsWon === 0) {
      playerScore = 13;
      opponentScore = 5; // 3-0: Dominant victory
    } else if (opponentSituationsWon === 1) {
      playerScore = 13;
      opponentScore = 8; // 3-1: Solid victory
    } else {
      playerScore = 13;
      opponentScore = 11; // 3-2: Thriller overtime victory
    }
  } else {
    if (playerSituationsWon === 0) {
      playerScore = 5;
      opponentScore = 13; // 0-3: Tough loss
    } else if (playerSituationsWon === 1) {
      playerScore = 8;
      opponentScore = 13; // 1-3: Fought hard
    } else {
      playerScore = 11;
      opponentScore = 13; // 2-3: Close nailbiter
    }
  }

  const totalRounds = playerScore + opponentScore;

  // Build authentic per-map player performance stats with trait bonuses
  const playerPerformances: PlayerPerformance[] = players.map(p => {
    const raw = playerStatsMap[p.id];
    const roleBaseMultiplier = p.primaryRole === 'Duelist' ? 1.15 : p.primaryRole === 'Flex' ? 1.05 : 0.95;
    const ratingBonus = (p.rating - 75) * 0.14;
    let baseKills = Math.max(7, Math.round((totalRounds * 0.72 * roleBaseMultiplier * (p.rating / 85)) + raw.kills * 0.8 + (Math.random() * 3 - 1)));
    let baseDeaths = Math.max(6, Math.round((totalRounds * (playerWon ? 0.62 : 0.78)) + raw.deaths + (Math.random() * 3 - 1)));
    let baseAssists = Math.max(3, Math.round(totalRounds * (p.primaryRole === 'Initiator' || p.primaryRole === 'Controller' ? 0.36 : 0.22) + raw.assists));
    let clutchesWon = raw.clutches;
    let kdRatio = Number((baseKills / Math.max(1, baseDeaths)).toFixed(2));
    
    // Calculate authentic ACS (Average Combat Score)
    const baseAcs = Math.round((baseKills * 12) + (baseAssists * 4) + (clutchesWon * 15) + (ratingBonus * 6));
    let acs = Math.max(150, Math.min(340, Math.round((baseAcs / totalRounds) * 24)));

    // TRAIT: Final Boss +25% ACS
    if (p.trait?.id === 'final_boss') {
      acs = Math.min(390, Math.round(acs * 1.25));
      baseKills += 3;
      clutchesWon += 1;
      kdRatio = Number((baseKills / Math.max(1, baseDeaths)).toFixed(2));
    }

    // TRAIT: Inconsistente swing (+/- 25% ACS)
    if (p.trait?.id === 'inconsistent') {
      const isGoodDay = Math.random() < 0.50;
      if (isGoodDay) {
        acs = Math.min(370, Math.round(acs * 1.22));
        baseKills += 3;
      } else {
        acs = Math.max(115, Math.round(acs * 0.72));
        baseKills = Math.max(5, baseKills - 4);
      }
      kdRatio = Number((baseKills / Math.max(1, baseDeaths)).toFixed(2));
    }

    const impactScore = Number(((acs / 200) * 0.6 + kdRatio * 0.4).toFixed(2));

    return {
      playerId: p.id,
      ign: p.ign,
      role: p.primaryRole,
      team: p.team,
      year: p.year,
      rating: p.rating,
      kills: baseKills,
      deaths: baseDeaths,
      assists: baseAssists,
      kdRatio,
      acs,
      clutchesWon,
      impactScore,
      signatureAgent: p.signatureAgent,
    };
  });

  return {
    mapName,
    playerScore,
    opponentScore,
    playerWon,
    events,
    playerPerformances,
  };
}

// Calculate tournament-wide MVP and overall team roster statistics
export function calculateTournamentMvp(lineup: Lineup, maps: MapGame[]): TournamentMvpStats | null {
  const players = Object.values(lineup).filter((p): p is Player => p !== null);
  if (players.length === 0 || maps.length === 0) return null;

  const performances = aggregateTournamentPerformances(lineup, maps);
  if (performances.length === 0) return null;

  // Sort by impact score descending, then ACS
  const sorted = [...performances].sort((a, b) => {
    if (b.impactScore !== a.impactScore) return b.impactScore - a.impactScore;
    return b.acs - a.acs;
  });

  const topPerformer = sorted[0];
  const playerObj = players.find(p => p.id === topPerformer.playerId) || players[0];

  let highlight = `Liderou a equipe com ${topPerformer.acs} ACS e foi fundamental nas entradas de bomb!`;
  if (topPerformer.clutchesWon >= 3) {
    highlight = `Mestre do clutch: converteu ${topPerformer.clutchesWon} situações decisivas sob pressão máxima!`;
  } else if (topPerformer.kdRatio >= 1.35) {
    highlight = `Poder de fogo avassalador com K/D de ${topPerformer.kdRatio} e ${topPerformer.totalKills} abates totais!`;
  } else if (topPerformer.role === 'Controller' || topPerformer.role === 'Initiator') {
    highlight = `Comando tático absoluto com controle milimétrico de utilitários e presença constante!`;
  }

  return {
    player: playerObj,
    acs: topPerformer.acs,
    kdRatio: topPerformer.kdRatio,
    totalKills: topPerformer.kills,
    totalDeaths: topPerformer.deaths,
    clutchesWon: topPerformer.clutchesWon,
    highlightText: highlight,
  };
}

export function aggregateTournamentPerformances(
  lineup: Lineup,
  maps: MapGame[]
): (PlayerPerformance & { totalKills: number; totalDeaths: number })[] {
  const players = Object.values(lineup).filter((p): p is Player => p !== null);
  if (players.length === 0) return [];

  return players.map(p => {
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalClutches = 0;
    let totalAcsSum = 0;
    let mapCount = 0;

    maps.forEach(m => {
      const perf = m.playerPerformances?.find(pf => pf.playerId === p.id);
      if (perf) {
        totalKills += perf.kills;
        totalDeaths += perf.deaths;
        totalAssists += perf.assists;
        totalClutches += perf.clutchesWon;
        totalAcsSum += perf.acs;
        mapCount++;
      }
    });

    if (mapCount === 0) {
      // Fallback if simulated before map stats were attached
      totalKills = Math.round(p.rating * 0.22);
      totalDeaths = 14;
      totalAssists = 5;
      totalAcsSum = p.rating * 2.8;
      mapCount = 1;
    }

    const avgAcs = Math.round(totalAcsSum / Math.max(1, mapCount));
    const kdRatio = Number((totalKills / Math.max(1, totalDeaths)).toFixed(2));
    const impactScore = Number(((avgAcs / 200) * 0.6 + kdRatio * 0.4).toFixed(2));

    return {
      playerId: p.id,
      ign: p.ign,
      role: p.primaryRole,
      team: p.team,
      year: p.year,
      rating: p.rating,
      kills: totalKills,
      deaths: totalDeaths,
      assists: totalAssists,
      totalKills,
      totalDeaths,
      kdRatio,
      acs: avgAcs,
      clutchesWon: totalClutches,
      impactScore,
      signatureAgent: p.signatureAgent,
    };
  });
}

