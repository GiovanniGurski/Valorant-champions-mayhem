import { Player, Difficulty } from '../types';
import { PLAYERS_DATABASE } from '../data/teamsAndPlayers';

/**
 * Rolls random opponent bans based on difficulty:
 * - Normal mode: 0 bans (sem banimentos)
 * - Hard mode: 3 players randomly banned by the opponent
 * - Master mode: 6 players randomly banned by the opponent
 */
export function rollOpponentBans(difficulty: Difficulty): Player[] {
  if (difficulty === 'normal') {
    return [];
  }

  const banCount = difficulty === 'hard' ? 3 : difficulty === 'master' ? 6 : 0;
  if (banCount <= 0) return [];

  // Create pool of unique players by IGN, prioritizing notable stars and diverse roles
  const uniquePlayersMap = new Map<string, Player>();
  for (const player of PLAYERS_DATABASE) {
    const key = player.ign.toLowerCase();
    if (!uniquePlayersMap.has(key)) {
      uniquePlayersMap.set(key, player);
    }
  }

  const uniquePlayers = Array.from(uniquePlayersMap.values());
  const shuffled = [...uniquePlayers].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, banCount);
}

/**
 * Checks if a specific player matches any of the opponent bans (by id or IGN).
 */
export function isPlayerBanned(player: Player, bannedPlayers: Player[]): boolean {
  if (!bannedPlayers || bannedPlayers.length === 0) return false;
  return bannedPlayers.some(
    b => b.id === player.id || b.ign.toLowerCase() === player.ign.toLowerCase()
  );
}
