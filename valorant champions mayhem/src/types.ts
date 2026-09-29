export type Role = 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel' | 'Flex';

export type Region = 'Americas' | 'EMEA' | 'Pacific' | 'China';

export type TournamentStage = 'group' | 'quarters' | 'semis' | 'finals';

export type Difficulty = 'normal' | 'hard' | 'master';

export type TraitRarity = 'legendary' | 'epic' | 'rare' | 'negative';

export interface PlayerTrait {
  id: string;
  name: string;
  rarity: TraitRarity;
  type: 'positive' | 'negative';
  description: string;
  flavorText: string;
  badgeLabel: string;
  shortEffect: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  // Mechanical attributes
  ratingBonus?: number;
  acsBonusPct?: number; // e.g. 25 for +25% ACS
  clutchBonus?: number; // e.g. +20 or -15
  pistolWinBonus?: number; // e.g. 0.18 for pistol situation boost
  synergyBonus?: number;
  synergyMultiplier?: number; // e.g. 2x synergy contribution
  clutchMasterRescue?: boolean; // dramatic rescue chance on lost situation
  tiltOnLossStreak?: boolean; // tilt if rounds are dropped
  inconsistentRating?: boolean; // rating/ACS fluctuates between maps
  chokeOnDecider?: boolean; // choking in map point situations
  deciderBonus?: boolean | number;
  overtimeBoost?: boolean;
  firstBloodChanceBoost?: number;
}

export interface Player {
  id: string;
  name: string; // Real name
  ign: string; // In-game name (e.g. "aspas", "TenZ")
  country: string; // e.g. "Brasil"
  countryCode: string; // ISO 2-letter, e.g. "BR"
  team: string; // e.g. "LOUD"
  year: number; // e.g. 2022
  championsYears: number[]; // e.g. [2022, 2023, 2024]
  primaryRole: Role;
  secondaryRoles: Role[];
  signatureAgent: string; // e.g. "Jett", "Omen", "Sova"
  rating: number; // 75 - 98
  consistency: number; // 70 - 97
  clutch: number; // 70 - 99
  synergy: number; // 70 - 96
  flexibility: number; // 65 - 98
  isChampionsWinner?: boolean;
  trait?: PlayerTrait;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  year: number;
  region: Region;
  editionLabel: string; // e.g. "Champions 2022 - Campeão"
  primaryColor: string; // hex
  logoUrl?: string;
  roster: Player[];
}

export interface Lineup {
  Duelist: Player | null;
  Controller: Player | null;
  Initiator: Player | null;
  Sentinel: Player | null;
  Flex: Player | null;
}

export interface MatchEvent {
  id: string;
  roundNumber: number;
  text: string;
  type: 'win' | 'loss' | 'neutral';
  clutchPlayer?: string;
  situationTitle?: string;
  situationIndex?: number;
}

export interface PlayerPerformance {
  playerId: string;
  ign: string;
  role: Role;
  team: string;
  year: number;
  rating: number;
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number;
  acs: number;
  clutchesWon: number;
  impactScore: number;
  signatureAgent: string;
}

export interface TournamentMvpStats {
  player: Player;
  acs: number;
  kdRatio: number;
  totalKills: number;
  totalDeaths: number;
  clutchesWon: number;
  highlightText: string;
}

export interface MapGame {
  mapName: string;
  playerScore: number;
  opponentScore: number;
  playerWon: boolean;
  events: MatchEvent[];
  playerPerformances?: PlayerPerformance[];
}

export interface SeriesMatch {
  stage: TournamentStage;
  stageTitle: string;
  opponent: {
    name: string;
    tag: string;
    region: Region;
    rating: number;
    logoColor: string;
    logoUrl?: string;
    rosterNames: string[];
  };
  bestOf: 1 | 3 | 5;
  playerWins: number;
  opponentWins: number;
  currentMapIndex: number;
  maps: MapGame[];
  isFinished: boolean;
  playerWonSeries: boolean | null;
}

export interface CampaignHistory {
  id: string;
  date: string;
  difficulty: Difficulty;
  lineup: {
    role: Role;
    ign: string;
    team: string;
    year: number;
    rating: number;
  }[];
  overallRating: number;
  stageReached: TournamentStage;
  wonChampionship: boolean;
  seriesScore: string;
  mvp: string;
  mvpDetails?: {
    ign: string;
    role: Role;
    team: string;
    year: number;
    acs: number;
    kdRatio: number;
    clutchesWon: number;
    signatureAgent: string;
  };
}

export interface TriviaGuess {
  player: Player;
  isCorrect: boolean;
  matches: {
    region: 'correct' | 'wrong';
    team: 'correct' | 'wrong';
    role: 'correct' | 'wrong';
    year: 'correct' | 'higher' | 'lower';
    agent: 'correct' | 'wrong';
  };
}

export interface GridCellState {
  row: number;
  col: number;
  player: Player | null;
  isSolved: boolean;
  points: number; // Starts at 60, decrements by 15 on wrong guess (min 15)
  wrongGuessesCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'trophy' | 'draft' | 'clutch' | 'veteran';
  icon: string;
  isUnlocked: boolean;
  progressText?: string;
  unlockedDate?: string;
  rewardLabel?: string;
}
