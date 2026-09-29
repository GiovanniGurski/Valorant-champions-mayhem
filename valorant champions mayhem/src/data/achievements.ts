import { Achievement, CampaignHistory } from '../types';

export const ACHIEVEMENTS_LIST: Omit<Achievement, 'isUnlocked' | 'unlockedDate' | 'progressText'>[] = [
  {
    id: 'first_glory',
    title: 'Primeira Glória',
    description: 'Conquiste seu primeiro título mundial do VCT Champions.',
    category: 'trophy',
    icon: 'Trophy',
    rewardLabel: 'Título Campeão',
  },
  {
    id: 'dynasty',
    title: 'Dinastia Internacional',
    description: 'Erga a taça do Champions 3 vezes no histórico de campanhas.',
    category: 'trophy',
    icon: 'Crown',
    rewardLabel: 'Troféu Ouro',
  },
  {
    id: 'penta_champ',
    title: 'Lenda Absoluta',
    description: 'Atinja a marca de 5 títulos mundiais do Champions.',
    category: 'trophy',
    icon: 'Award',
    rewardLabel: 'Troféu Lendário',
  },
  {
    id: 'hard_survivor',
    title: 'Superando os Vetos',
    description: 'Seja campeão do Champions na dificuldade Difícil (com 3 vetos táticos do adversário e 2 rerolls).',
    category: 'draft',
    icon: 'ShieldAlert',
    rewardLabel: 'Mestre dos Vetos',
  },
  {
    id: 'master_conquest',
    title: 'Desafio Supremo do Mestre',
    description: 'Vença o Champions na dificuldade Mestre (com 6 vetos do adversário e apenas 1 reroll).',
    category: 'trophy',
    icon: 'Flame',
    rewardLabel: 'Mente Brilhante',
  },
  {
    id: 'super_team_90',
    title: 'Galácticos do VCT',
    description: 'Monte um elenco com força média de 90 OVR ou superior.',
    category: 'draft',
    icon: 'Star',
    rewardLabel: 'Superelenco',
  },
  {
    id: 'final_boss_glory',
    title: 'Aura do Final Boss',
    description: 'Conquiste o troféu do Champions tendo um jogador com a trait lendária "Final Boss" no elenco.',
    category: 'clutch',
    icon: 'Sparkles',
    rewardLabel: 'Aura Dourada',
  },
  {
    id: 'mvp_beast',
    title: 'Monstro do Servidor',
    description: 'Consagre um MVP de torneio com 270 ou mais de ACS médio.',
    category: 'clutch',
    icon: 'Zap',
    rewardLabel: 'MVP Histórico',
  },
  {
    id: 'ice_blood',
    title: 'Coração de Gelo',
    description: 'Conquiste um título com um jogador de Trait "Ice in the Veins" (Sangue Frio) no time.',
    category: 'clutch',
    icon: 'Snowflake',
    rewardLabel: 'Gelo Puro',
  },
  {
    id: 'veteran',
    title: 'Veterano do Circuito',
    description: 'Dispute 5 ou mais campanhas completas no torneio Champions.',
    category: 'veteran',
    icon: 'Calendar',
    rewardLabel: 'Veterano VCT',
  },
  {
    id: 'first_blood_champ',
    title: 'Agressividade Máxima',
    description: 'Conquiste o troféu tendo o "First Blood King" comandando as aberturas do seu time.',
    category: 'draft',
    icon: 'Crosshair',
    rewardLabel: 'Pistol King',
  },
  {
    id: 'miracle_run',
    title: 'Sobrevivente dos Playoffs',
    description: 'Chegue pelo menos à Grande Final ou conquiste o título mundial.',
    category: 'trophy',
    icon: 'Target',
    rewardLabel: 'Finalista',
  },
];

/**
 * Evaluates all achievements against user's campaign history.
 */
export function evaluateAchievements(history: CampaignHistory[]): Achievement[] {
  const titlesCount = history.filter(h => h.wonChampionship).length;
  const totalCampaigns = history.length;
  const highestRating = history.reduce((max, h) => Math.max(max, h.overallRating || 0), 0);
  const highestAcs = history.reduce((max, h) => Math.max(max, h.mvpDetails?.acs || 0), 0);
  const wonHard = history.some(h => h.wonChampionship && (h.difficulty === 'hard' || h.difficulty === 'master'));
  const wonMaster = history.some(h => h.wonChampionship && h.difficulty === 'master');
  const reachedFinalsOrWon = history.some(h => h.wonChampionship || h.stageReached === 'finals');

  return ACHIEVEMENTS_LIST.map(item => {
    let isUnlocked = false;
    let progressText = '';

    switch (item.id) {
      case 'first_glory':
        isUnlocked = titlesCount >= 1;
        progressText = `${Math.min(1, titlesCount)}/1 Título`;
        break;
      case 'dynasty':
        isUnlocked = titlesCount >= 3;
        progressText = `${Math.min(3, titlesCount)}/3 Títulos`;
        break;
      case 'penta_champ':
        isUnlocked = titlesCount >= 5;
        progressText = `${Math.min(5, titlesCount)}/5 Títulos`;
        break;
      case 'hard_survivor':
        isUnlocked = wonHard;
        progressText = wonHard ? 'Concluído' : 'Pendente (Modo Difícil)';
        break;
      case 'master_conquest':
        isUnlocked = wonMaster;
        progressText = wonMaster ? 'Concluído' : 'Pendente (Modo Mestre)';
        break;
      case 'super_team_90':
        isUnlocked = highestRating >= 90;
        progressText = highestRating > 0 ? `${highestRating}/90 OVR` : '0/90 OVR';
        break;
      case 'final_boss_glory':
        isUnlocked = history.some(h => h.wonChampionship && h.lineup.some(p => p.rating >= 90));
        progressText = isUnlocked ? 'Desbloqueado' : 'Requer Final Boss Campeão';
        break;
      case 'mvp_beast':
        isUnlocked = highestAcs >= 270;
        progressText = highestAcs > 0 ? `${highestAcs}/270 ACS` : '0/270 ACS';
        break;
      case 'ice_blood':
        isUnlocked = titlesCount >= 1;
        progressText = isUnlocked ? 'Concluído' : 'Pendente';
        break;
      case 'veteran':
        isUnlocked = totalCampaigns >= 5;
        progressText = `${Math.min(5, totalCampaigns)}/5 Campanhas`;
        break;
      case 'first_blood_champ':
        isUnlocked = titlesCount >= 1;
        progressText = isUnlocked ? 'Concluído' : 'Pendente';
        break;
      case 'miracle_run':
        isUnlocked = reachedFinalsOrWon;
        progressText = reachedFinalsOrWon ? 'Concluído' : 'Pendente';
        break;
      default:
        isUnlocked = false;
        progressText = 'Pendente';
    }

    return {
      ...item,
      isUnlocked,
      progressText,
      unlockedDate: isUnlocked ? 'Conquistado' : undefined,
    };
  });
}
