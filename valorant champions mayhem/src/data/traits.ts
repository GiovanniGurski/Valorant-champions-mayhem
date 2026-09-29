import { Player, PlayerTrait, Team } from '../types';

/**
 * Tactical traits dictionary with distinct, non-game-breaking bonuses.
 * Represents unique playstyles, competitive spirit, and authentic esports flavor.
 */
export const TRAITS_DICTIONARY: Record<string, PlayerTrait> = {
  // ⭐ Legend Traits (Ultra Rare ~0.5%)
  final_boss: {
    id: 'final_boss',
    name: 'Final Boss',
    rarity: 'legendary',
    type: 'positive',
    badgeLabel: '👑 FINAL BOSS',
    shortEffect: '+3 OVR em Decisões',
    description: '+3 de Rating em jogos eliminatórios ou no mapa desempate (Decider).',
    flavorText: 'Acostumado a levantar troféus mundiais nas arenas mais hostis.',
    color: '#fbbf24',
    badgeBg: 'rgba(251, 191, 36, 0.18)',
    badgeBorder: 'rgba(251, 191, 36, 0.65)',
    ratingBonus: 3,
    deciderBonus: true,
  },

  // ❄ Rare Traits (~1.0% each)
  ice_in_the_veins: {
    id: 'ice_in_the_veins',
    name: 'Gelo nas Veias',
    rarity: 'rare',
    type: 'positive',
    badgeLabel: '❄ GELO NAS VEIAS',
    shortEffect: '+8 Clutch no OT',
    description: '+8 de Clutch em rodadas decisivas ou prorrogações (Overtime).',
    flavorText: 'Não treme sob pressão e nunca desperdiça um 1v1 tenso.',
    color: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeBorder: 'rgba(56, 189, 248, 0.6)',
    clutchBonus: 8,
    overtimeBoost: true,
  },
  first_blood_king: {
    id: 'first_blood_king',
    name: 'Rei do First Blood',
    rarity: 'rare',
    type: 'positive',
    badgeLabel: '🎯 FIRST BLOOD',
    shortEffect: '+15% Chance de Abertura',
    description: '+15% de chance de conseguir o primeiro abate da rodada.',
    flavorText: 'Agressividade calculada nas entradas de mapa e confrontos iniciais.',
    color: '#f43f5e',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeBorder: 'rgba(244, 63, 94, 0.6)',
    firstBloodChanceBoost: 0.15,
  },
  natural_synergy: {
    id: 'natural_synergy',
    name: 'Química Natural',
    rarity: 'rare',
    type: 'positive',
    badgeLabel: '⚡ QUÍMICA NATURAL',
    shortEffect: '+6 Sinergia de Equipe',
    description: 'Adiciona +6 de Sinergia de Equipe com qualquer companheiro de elenco.',
    flavorText: 'Comunicação limpa e adaptabilidade rápida ao plano tático.',
    color: '#34d399',
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    badgeBorder: 'rgba(52, 211, 153, 0.6)',
    synergyBonus: 6,
  },
  clutch_master: {
    id: 'clutch_master',
    name: 'Mestre do Clutch',
    rarity: 'rare',
    type: 'positive',
    badgeLabel: '🔥 MESTRE DO CLUTCH',
    shortEffect: '+10 Clutch 1vX',
    description: 'Bônus massivo (+10 Clutch) em situações de desvantagem numérica.',
    flavorText: 'Especialista em viradas improváveis e duelos de desvantagem.',
    color: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeBorder: 'rgba(168, 85, 247, 0.6)',
    clutchBonus: 10,
  },

  // ⚠️ Negative Traits (Rare Spice ~0.25% each)
  choke_artist: {
    id: 'choke_artist',
    name: 'Amarelão',
    rarity: 'negative',
    type: 'negative',
    badgeLabel: '⚠ AMARELÃO',
    shortEffect: '-6 Clutch sob Pressão',
    description: '-6 de Clutch em finais de mapas apertados.',
    flavorText: 'Sente a pressão em partidas de eliminação.',
    color: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    badgeBorder: 'rgba(249, 115, 22, 0.6)',
    clutchBonus: -6,
    chokeOnDecider: true,
  },
  tilted: {
    id: 'tilted',
    name: 'Tiltado',
    rarity: 'negative',
    type: 'negative',
    badgeLabel: '💢 TILTADO',
    shortEffect: '-4% se Perder Rounds',
    description: 'Pequena perda de foco (-4%) se a equipe perder rodadas consecutivas.',
    flavorText: 'Reclama após falhas e precisa do apoio de um líder IGL.',
    color: '#f43f5e',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeBorder: 'rgba(244, 63, 94, 0.6)',
    tiltOnLossStreak: true,
  },
  inconsistent: {
    id: 'inconsistent',
    name: 'Inconsistente',
    rarity: 'negative',
    type: 'negative',
    badgeLabel: '🎲 INCONSISTENTE',
    shortEffect: 'Oscilação Leve ACS',
    description: 'Rendimento oscila moderadamente (+/- 15 a 20 ACS) entre os mapas.',
    flavorText: 'Alterna entre partidas brilhantes e atuações discretas.',
    color: '#94a3b8',
    badgeBg: 'rgba(148, 163, 184, 0.15)',
    badgeBorder: 'rgba(148, 163, 184, 0.5)',
    inconsistentRating: true,
  },
};

/**
 * Rolls a trait for a given player based on calibrated, slightly reduced probabilities.
 * Total trait appearance chance is ~5.2% (94.8% of players have standard pro stats without traits).
 */
export function rollPlayerTrait(player: Player): PlayerTrait | undefined {
  const roll = Math.random() * 100;

  // 1. Final Boss: 0.5% chance, strictly for elite players with rating >= 92
  if (player.rating >= 92 && roll < 0.5) {
    return TRAITS_DICTIONARY.final_boss;
  }

  // 2. Ice in the Veins: 1.0% chance (roll 0.5 - 1.5)
  if (roll >= 0.5 && roll < 1.5) {
    return TRAITS_DICTIONARY.ice_in_the_veins;
  }

  // 3. First Blood King: 1.2% base (1.5% if Duelist)
  const isDuelist = player.primaryRole === 'Duelist';
  const fbThreshold = isDuelist ? 3.0 : 2.7;
  if (roll >= 1.5 && roll < fbThreshold) {
    return TRAITS_DICTIONARY.first_blood_king;
  }

  // 4. Natural Synergy: 1.0% chance (roll 3.0 - 4.0)
  if (roll >= 3.0 && roll < 4.0) {
    return TRAITS_DICTIONARY.natural_synergy;
  }

  // 5. Clutch Master: 0.6% chance (roll 4.0 - 4.6)
  if (roll >= 4.0 && roll < 4.6) {
    return TRAITS_DICTIONARY.clutch_master;
  }

  // ❄ Negative Traits (Rare, balanced spice): ~0.75% total
  // 6. Choke Artist: 0.25%
  if (roll >= 4.6 && roll < 4.85) {
    return TRAITS_DICTIONARY.choke_artist;
  }

  // 7. Tiltado: 0.25%
  if (roll >= 4.85 && roll < 5.1) {
    return TRAITS_DICTIONARY.tilted;
  }

  // 8. Inconsistente: 0.25%
  if (roll >= 5.1 && roll < 5.35) {
    return TRAITS_DICTIONARY.inconsistent;
  }

  // ~94.65% of players have standard pro player stats without traits
  return undefined;
}

/**
 * Deep clones a team and rolls traits for each player in the roster.
 */
export function assignTraitsToTeam(team: Team): Team {
  return {
    ...team,
    roster: team.roster.map(p => {
      // If player already has a trait assigned, keep it
      if (p.trait) return p;
      const trait = rollPlayerTrait(p);
      return {
        ...p,
        trait,
      };
    }),
  };
}
