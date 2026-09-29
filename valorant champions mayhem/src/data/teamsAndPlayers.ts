import { Player, Team } from '../types';
import { PLAYERS_2026, TEAMS_2026 } from './teams2026';
import { PLAYERS_2025, TEAMS_2025 } from './teams2025';
import { PLAYERS_2024, TEAMS_2024 } from './teams2024';
import { PLAYERS_2023, TEAMS_2023 } from './teams2023';
import { PLAYERS_2022, TEAMS_2022 } from './teams2022';
import { getTeamLogoData } from './teamLogos';

// Helper to adjust Initiator and Controller overall rating (+2 boost, capped at 99)
function boostSupportRoles(player: Player): Player {
  if (player.primaryRole === 'Initiator' || player.primaryRole === 'Controller') {
    return {
      ...player,
      rating: Math.min(99, player.rating + 2),
      consistency: Math.min(99, player.consistency + 1),
      synergy: Math.min(99, player.synergy + 1),
      clutch: player.clutch,
    };
  }
  return player;
}

// Raw aggregated player pool
const RAW_PLAYERS: Player[] = [
  ...PLAYERS_2026,
  ...PLAYERS_2025,
  ...PLAYERS_2024,
  ...PLAYERS_2023,
  ...PLAYERS_2022,
];

// Aggregated Database of all players from 2022 to 2026 with adjusted overalls
export const PLAYERS_DATABASE: Player[] = RAW_PLAYERS.map(boostSupportRoles);

// Aggregated Database of all teams from 2022 to 2026
export const TEAMS_DATABASE: Team[] = [
  ...TEAMS_2026,
  ...TEAMS_2025,
  ...TEAMS_2024,
  ...TEAMS_2023,
  ...TEAMS_2022,
].map(team => ({
  ...team,
  roster: team.roster.map(boostSupportRoles),
}));

// Enrich all teams with high quality logos and color definitions
for (const team of TEAMS_DATABASE) {
  const logoData = getTeamLogoData(team.name) || getTeamLogoData(team.shortName);
  if (logoData) {
    if (!team.logoUrl && logoData.logoUrl) {
      team.logoUrl = logoData.logoUrl;
    }
    if (logoData.primaryColor) {
      team.primaryColor = logoData.primaryColor;
    }
  }
}
