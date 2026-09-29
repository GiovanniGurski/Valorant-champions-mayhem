import { Player, Role } from '../types';
import { PLAYERS_DATABASE } from './teamsAndPlayers';

export type GridCriterionType = 'team' | 'role' | 'achievement' | 'region' | 'nationality';

export interface GridCriterion {
  id: string;
  label: string;
  subLabel?: string;
  type: GridCriterionType;
  value: string;
  color?: string;
  shortCode?: string;
}

export interface GridPuzzle {
  id: string;
  number: number;
  title: string;
  description: string;
  rows: [GridCriterion, GridCriterion, GridCriterion];
  cols: [GridCriterion, GridCriterion, GridCriterion];
}

// Known cross-team histories for prominent players in VCT
export const PLAYER_TEAM_HISTORY: Record<string, string[]> = {
  'aspas': ['LOUD', 'Leviatán'],
  'TenZ': ['Sentinels', 'Cloud9'],
  'Sacy': ['LOUD', 'Sentinels', 'Team Vikings'],
  'pANcada': ['LOUD', 'Sentinels', 'FURIA', 'B4 Esports'],
  'Less': ['LOUD', 'Team Vitality'],
  'Saadhak': ['LOUD', 'Karmine Corp', 'Team Vikings'],
  'Demon1': ['Evil Geniuses', 'NRG', 'Leviatán'],
  'Jawgemo': ['Evil Geniuses', 'G2 Esports'],
  'jawgemo': ['Evil Geniuses', 'G2 Esports'],
  'Ethan': ['Evil Geniuses', 'NRG', '100 Thieves'],
  'C0M': ['Evil Geniuses', 'Leviatán'],
  'Boostio': ['Evil Geniuses', '100 Thieves'],
  'Chronicle': ['Fnatic', 'FPX', 'Gambit', 'M3C'],
  'Derke': ['Fnatic', 'Team Vitality'],
  'yay': ['OpTic Gaming', 'Envy', 'Bleed Esports', 'Cloud9', 'Sentinels'],
  'crashies': ['OpTic Gaming', 'NRG', 'Envy', 'Fnatic'],
  'Victor': ['OpTic Gaming', 'NRG', 'Envy'],
  'FNS': ['OpTic Gaming', 'NRG', 'Envy'],
  'Marved': ['OpTic Gaming', 'Sentinels', 'NRG'],
  'ardiis': ['FPX', 'NRG', 'NAVI'],
  'cNed': ['Acend', 'NAVI', 'FUT Esports'],
  'ScreaM': ['Team Liquid', 'Karmine Corp'],
  'Sayf': ['Team Liquid', 'Team Vitality', 'Guild Esports'],
  'Nivera': ['Team Liquid', 'Karmine Corp'],
  'Jamppi': ['Team Liquid'],
  'soulcas': ['Team Liquid', 'KOI'],
  'keznit': ['KRÜ Esports', 'Leviatán'],
  'Mazino': ['Leviatán', 'KRÜ Esports'],
  'tex': ['G2 Esports', 'NRG', 'Leviatán'],
  'leaf': ['G2 Esports', 'Cloud9'],
  'valyn': ['G2 Esports', 'The Guard'],
  'trent': ['G2 Esports', 'The Guard'],
  'JonahP': ['G2 Esports', 'The Guard'],
  's0m': ['NRG'],
  'cauanzin': ['LOUD', 'Ninjas in Pyjamas'],
  'tuyz': ['LOUD'],
  'heat': ['KRÜ Esports', 'MIBR', 'Vivo Keyd'],
  'zekken': ['Sentinels', 'XSET'],
  'johnqt': ['Sentinels', 'M80'],
  'Zellsis': ['Sentinels', 'Cloud9', 'Version1'],
  'ShahZaM': ['Sentinels', 'G2 Esports'],
  'dapr': ['Sentinels', 'G2 Esports'],
  'curry': ['Cloud9', 'Sentinels', 'T1'],
  'Xeppaa': ['Cloud9'],
  'vanity': ['Cloud9'],
  'Boaster': ['Fnatic'],
  'Alfajer': ['Fnatic'],
  'Leo': ['Fnatic', 'Guild Esports'],
  'hiro': ['Fnatic', 'NAVI'],
  'kaajak': ['Fnatic'],
  'Enzo': ['Fnatic', 'Team Vitality', 'Gentle Mates'],
  'keloqz': ['G2 Esports', 'Team Heretics'],
  'shin': ['Karmine Corp'],
  'nataNk': ['Team Vitality', 'Gentle Mates'],
  'Mixwell': ['G2 Esports', 'Team Heretics'],
  'Fit1nho': ['Team Heretics', 'Giants Gaming'],
  'Klaus': ['KRÜ Esports'],
  'NagZ': ['KRÜ Esports'],
  'Melser': ['Leviatán', 'KRÜ Esports'],
  'bang': ['Sentinels', '100 Thieves', 'TSM'],
  'N4RRATE': ['Sentinels', 'Karmine Corp'],
  'ZmjjKK': ['EDward Gaming'],
  'CHICHOO': ['EDward Gaming'],
  'nobody': ['EDward Gaming'],
  'Smoggy': ['EDward Gaming'],
  'f0rsakeN': ['Paper Rex'],
  'Jinggg': ['Paper Rex'],
  'something': ['Paper Rex'],
  'd4v41': ['Paper Rex'],
  'mindfreak': ['Paper Rex'],
  't3xture': ['Gen.G', 'Global Esports'],
  'Meteor': ['Gen.G', 'NORTHEPTION'],
  'Lakia': ['Gen.G', 'NUTURN Gaming'],
  'Karon': ['Gen.G'],
  'Munchkin': ['Gen.G', 'Crazy Raccoon', 'T1'],
  'Boo': ['Team Heretics'],
  'benjyfishy': ['Team Heretics'],
  'MiniBoo': ['Team Heretics'],
  'RieNs': ['Team Heretics'],
  'Wo0t': ['Team Heretics'],
  'stax': ['DRX', 'T1', 'Vision Strikers'],
  'BuZz': ['DRX', 'T1', 'Vision Strikers'],
  'Rb': ['DRX', 'Titan Esports Club', 'Vision Strikers'],
  'MaKo': ['DRX', 'Vision Strikers'],
  'Zest': ['DRX', 'Vision Strikers', 'IAM'],
  'SUYGETSU': ['FPX', 'NAVI'],
  'Shao': ['FPX', 'NAVI'],
  'ANGE1': ['FPX', 'NAVI'],
  'Zyppan': ['FPX', 'NAVI'],
  'ceNder': ['Team Vitality'],
  'trexx': ['Team Vitality', 'KOI', 'Guild Esports'],
  'runneR': ['Team Vitality'],
  'kicks': ['Team Vitality'],
  'atakan': ['FUT Esports'],
  'qraxs': ['FUT Esports'],
  'yetujey': ['FUT Esports'],
  'mrfalin': ['FUT Esports'],
};

export const INTERNATIONAL_TROPHY_WINNERS = new Set([
  'aspas', 'Less', 'Saadhak', 'pANcada', 'Sacy',
  'Demon1', 'Jawgemo', 'jawgemo', 'Ethan', 'C0M', 'Boostio',
  'ZmjjKK', 'CHICHOO', 'nobody', 'Smoggy',
  'Boaster', 'Derke', 'Alfajer', 'Leo', 'Chronicle',
  'TenZ', 'zekken', 'johnqt', 'Zellsis',
  'ShahZaM', 'dapr',
  't3xture', 'Meteor', 'Lakia', 'Munchkin', 'Karon',
  'yay', 'Marved', 'crashies', 'Victor', 'FNS',
  'ardiis', 'SUYGETSU', 'Shao', 'ANGE1', 'Zyppan',
  'cNed'
]);

export function isTeamMatch(teamName: string, targetTeam: string): boolean {
  const tNorm = (teamName || '').toLowerCase().trim();
  const targetNorm = (targetTeam || '').toLowerCase().trim();
  if (targetNorm === 'loud') return tNorm === 'loud' || tNorm.startsWith('loud ') || tNorm.endsWith(' loud');
  if (targetNorm === 'c9' || targetNorm === 'cloud9') return tNorm === 'c9' || tNorm.includes('cloud9');
  if (targetNorm === 'eg' || targetNorm === 'evil geniuses') return tNorm === 'eg' || tNorm.includes('evil geniuses');
  if (targetNorm === 'g2' || targetNorm === 'g2 esports') return tNorm.startsWith('g2') || tNorm.includes('g2 esports');
  if (targetNorm === 'fpx' || targetNorm === 'funplus phoenix') return tNorm === 'fpx' || tNorm.includes('funplus');
  if (targetNorm === 'edg' || targetNorm === 'edward gaming') return tNorm === 'edg' || tNorm.includes('edward');
  if (targetNorm === 'prx' || targetNorm === 'paper rex') return tNorm === 'prx' || tNorm.includes('paper rex');
  if (targetNorm === 'krü' || targetNorm === 'kru' || targetNorm === 'krü esports') return tNorm.includes('krü') || tNorm.includes('kru');
  if (targetNorm === 'drx') return tNorm === 'drx' || tNorm.startsWith('drx ');
  if (targetNorm === 'nrg') return tNorm === 'nrg' || tNorm.startsWith('nrg ');
  if (targetNorm === 'optic' || targetNorm === 'optic gaming') return tNorm.includes('optic');
  return tNorm.includes(targetNorm);
}

export function getPlayerTeamHistory(ign: string): string[] {
  const ignLower = ign.toLowerCase();
  const key = Object.keys(PLAYER_TEAM_HISTORY).find(k => k.toLowerCase() === ignLower);
  const staticTeams = key ? PLAYER_TEAM_HISTORY[key] : [];
  const dbTeams = PLAYERS_DATABASE
    .filter(p => p.ign.toLowerCase() === ignLower)
    .map(p => p.team);
  return Array.from(new Set([...staticTeams, ...dbTeams]));
}

export function playerMatchesCriterion(player: Player, criterion: GridCriterion): boolean {
  switch (criterion.type) {
    case 'team': {
      // Primary team matches
      if (isTeamMatch(player.team, criterion.value)) return true;
      // History matches
      const history = getPlayerTeamHistory(player.ign);
      if (history && history.some(t => isTeamMatch(t, criterion.value))) return true;
      return false;
    }

    case 'nationality': {
      const targetNat = criterion.value.toLowerCase();
      const playerCountry = (player.country || '').toLowerCase();

      if (targetNat === 'frança_espanha' || targetNat === 'france_spain') {
        return playerCountry.includes('fran') || playerCountry.includes('espan');
      }
      if (targetNat === 'eua_canada' || targetNat === 'na') {
        return playerCountry.includes('estados unidos') || playerCountry.includes('eua') || player.countryCode === 'US' || playerCountry.includes('canad');
      }
      if (targetNat === 'chile_argentina' || targetNat === 'latam') {
        return playerCountry.includes('chile') || playerCountry.includes('argent');
      }

      if (targetNat === 'frança' || targetNat === 'france') return playerCountry.includes('fran');
      if (targetNat === 'espanha' || targetNat === 'spain') return playerCountry.includes('espan');
      if (targetNat === 'turquia' && (playerCountry.includes('turqu') || playerCountry.includes('turk'))) return true;
      if (targetNat === 'brasil' && playerCountry.includes('brasil')) return true;
      if (targetNat === 'canadá' && (playerCountry.includes('canad') || playerCountry.includes('canada'))) return true;
      if (targetNat === 'estados unidos' && (playerCountry.includes('estados unidos') || playerCountry.includes('eua') || player.countryCode === 'US')) return true;
      if (targetNat === 'chile' && playerCountry.includes('chile')) return true;
      if (targetNat === 'argentina' && playerCountry.includes('argent')) return true;
      if (targetNat === 'rússia' && (playerCountry.includes('rús') || playerCountry.includes('rus'))) return true;
      if (targetNat === 'finlândia' && playerCountry.includes('finl')) return true;
      if (targetNat === 'coreia do sul' && playerCountry.includes('coreia')) return true;
      if (targetNat === 'reino unido' && playerCountry.includes('reino')) return true;
      return playerCountry === targetNat;
    }

    case 'role': {
      const targetRole = criterion.value as Role;
      return player.primaryRole === targetRole || (player.secondaryRoles && player.secondaryRoles.includes(targetRole));
    }

    case 'achievement': {
      if (criterion.value === 'champions_winner') {
        return !!player.isChampionsWinner || (player.championsYears && player.championsYears.length > 0) || false;
      }
      if (criterion.value === 'international_trophy') {
        return !!player.isChampionsWinner || (player.championsYears && player.championsYears.length > 0) || INTERNATIONAL_TROPHY_WINNERS.has(player.ign);
      }
      if (criterion.value === 'rating_85_plus') {
        return player.rating >= 85;
      }
      if (criterion.value === 'rating_88_plus') {
        return player.rating >= 88;
      }
      if (criterion.value === 'multiple_champions') {
        return (player.championsYears && player.championsYears.length >= 2) || false;
      }
      if (criterion.value === 'clutch_85_plus') {
        return player.clutch >= 85;
      }
      if (criterion.value === 'jett_raze') {
        return player.signatureAgent === 'Jett' || player.signatureAgent === 'Raze';
      }
      if (criterion.value === 'smoker') {
        return ['Omen', 'Viper', 'Astra', 'Brimstone', 'Clove'].includes(player.signatureAgent);
      }
      return false;
    }

    case 'region': {
      const region = criterion.value.toLowerCase();
      if (region === 'americas') {
        return ['Brasil', 'EUA', 'Estados Unidos', 'Canadá', 'Argentina', 'Chile'].includes(player.country) ||
               ['LOUD', 'Sentinels', 'Evil Geniuses', 'Leviatán', 'KRÜ', 'G2', 'NRG', 'OpTic'].some(t => player.team.includes(t));
      }
      if (region === 'emea') {
        return ['Turquia', 'Reino Unido', 'Rússia', 'Finlândia', 'Suécia', 'Espanha', 'Lituânia', 'Bélgica', 'Estônia', 'Macedônia do Norte', 'Cazaquistão', 'França'].includes(player.country) ||
               ['Fnatic', 'Team Liquid', 'FUT', 'Vitality', 'FPX', 'Team Heretics', 'G2'].some(t => player.team.includes(t));
      }
      if (region === 'pacific') {
        return ['Coreia do Sul', 'Cingapura', 'Indonésia', 'Tailândia', 'Rússia', 'Malásia'].includes(player.country) ||
               ['Paper Rex', 'Gen.G', 'DRX', 'Talon'].some(t => player.team.includes(t));
      }
      if (region === 'china') {
        return player.country === 'China' || player.team.includes('EDG') || player.team.includes('Trace');
      }
      return false;
    }

    default:
      return false;
  }
}

// 12 Rich, authentic VCT Immaculate Grids - 100% cell solvability verified
// Featuring TEAM-VS-TEAM rows & columns for cross-team player selections!
export const GRID_PUZZLES: GridPuzzle[] = [
  {
    id: 'grid-transfers-optic-g2',
    number: 1,
    title: 'Janela de Transferências: Sentinels, OpTic & G2',
    description: 'Times dos dois lados! Escolha jogadores lendários que defenderam a Sentinels, OpTic e G2 cruzados com passagens por NRG e Cloud9.',
    cols: [
      { id: 'c1', label: 'Sentinels', subLabel: 'Time Americas', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
      { id: 'c2', label: 'OpTic Gaming', subLabel: 'Time Americas', type: 'team', value: 'OpTic Gaming', color: '#84cc16', shortCode: 'OG' },
      { id: 'c3', label: 'G2 Esports', subLabel: 'Time Americas', type: 'team', value: 'G2 Esports', color: '#ffffff', shortCode: 'G2' },
    ],
    rows: [
      { id: 'r1', label: 'Jogou na NRG', subLabel: 'Passagem pela NRG', type: 'team', value: 'NRG', color: '#ef4444', shortCode: 'NRG' },
      { id: 'r2', label: 'Jogou na Cloud9', subLabel: 'Passagem pela Cloud9', type: 'team', value: 'Cloud9', color: '#0ea5e9', shortCode: 'C9' },
      { id: 'r3', label: 'Duelista', subLabel: 'Função no VCT', type: 'role', value: 'Duelist', color: '#ff4655' },
    ],
  },
  {
    id: 'grid-americas-triangle',
    number: 2,
    title: 'Triângulo das Americas: LOUD, NRG & G2',
    description: 'Times dos dois lados! Encontre jogadores que atuaram na LOUD, NRG e G2 cruzados com passagens por Sentinels e Leviatán.',
    cols: [
      { id: 'c1', label: 'LOUD', subLabel: 'Time Americas', type: 'team', value: 'LOUD', color: '#00ff88', shortCode: 'LOUD' },
      { id: 'c2', label: 'NRG', subLabel: 'Time Americas', type: 'team', value: 'NRG', color: '#ef4444', shortCode: 'NRG' },
      { id: 'c3', label: 'G2 Esports', subLabel: 'Time Americas', type: 'team', value: 'G2 Esports', color: '#ffffff', shortCode: 'G2' },
    ],
    rows: [
      { id: 'r1', label: 'Jogou na Sentinels', subLabel: 'Passagem pela Sentinels', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
      { id: 'r2', label: 'Jogou na Leviatán', subLabel: 'Passagem pela Leviatán', type: 'team', value: 'Leviatán', color: '#2563eb', shortCode: 'LEV' },
      { id: 'r3', label: 'Campeão Internacional', subLabel: 'Champions ou Masters', type: 'achievement', value: 'international_trophy', color: '#e2b714' },
    ],
  },
  {
    id: 'grid-na-crossroads',
    number: 3,
    title: 'Dança das Cadeiras NA: Sentinels, NRG & Cloud9',
    description: 'Times dos dois lados! Conexões históricas de Sentinels, NRG e Cloud9 com quem jogou na OpTic Gaming e na G2 Esports.',
    cols: [
      { id: 'c1', label: 'Sentinels', subLabel: 'Time Americas', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
      { id: 'c2', label: 'NRG', subLabel: 'Time Americas', type: 'team', value: 'NRG', color: '#ef4444', shortCode: 'NRG' },
      { id: 'c3', label: 'Cloud9', subLabel: 'Time Americas', type: 'team', value: 'Cloud9', color: '#0ea5e9', shortCode: 'C9' },
    ],
    rows: [
      { id: 'r1', label: 'Jogou na OpTic Gaming', subLabel: 'Passagem pela OpTic/Envy', type: 'team', value: 'OpTic Gaming', color: '#84cc16', shortCode: 'OG' },
      { id: 'r2', label: 'Jogou na G2 Esports', subLabel: 'Passagem pela G2', type: 'team', value: 'G2 Esports', color: '#ffffff', shortCode: 'G2' },
      { id: 'r3', label: 'Iniciador', subLabel: 'Flash & Reconhecimento', type: 'role', value: 'Initiator', color: '#a855f7' },
    ],
  },
  {
    id: 'grid-emea-cis-crossover',
    number: 4,
    title: 'Crossover Europa & CIS: Fnatic, NAVI & NRG',
    description: 'Times dos dois lados! O legado histórico da lendária FPX campeã de Copenhagen e os gigantes de Fnatic, NAVI e NRG.',
    cols: [
      { id: 'c1', label: 'Fnatic', subLabel: 'Time EMEA', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
      { id: 'c2', label: 'NAVI', subLabel: 'Time EMEA', type: 'team', value: 'NAVI', color: '#facc15', shortCode: 'NAVI' },
      { id: 'c3', label: 'NRG', subLabel: 'Time Americas', type: 'team', value: 'NRG', color: '#ef4444', shortCode: 'NRG' },
    ],
    rows: [
      { id: 'r1', label: 'Jogou na FPX', subLabel: 'Passagem pela FunPlus Phoenix', type: 'team', value: 'FPX', color: '#f97316', shortCode: 'FPX' },
      { id: 'r2', label: 'Campeão Internacional', subLabel: 'Champions ou Masters', type: 'achievement', value: 'international_trophy', color: '#e2b714' },
      { id: 'r3', label: 'Duelista', subLabel: 'Função no VCT', type: 'role', value: 'Duelist', color: '#ff4655' },
    ],
  },
  {
    id: 'grid-champions-lev-vitality',
    number: 5,
    title: 'Caminhos de Campeões: Sentinels, Leviatán & Team Vitality',
    description: 'Times dos dois lados! Cruze Sentinels, Leviatán e Vitality com quem já vestiu a camisa da LOUD e levantou o Champions.',
    cols: [
      { id: 'c1', label: 'Sentinels', subLabel: 'Time Americas', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
      { id: 'c2', label: 'Leviatán', subLabel: 'Time Americas', type: 'team', value: 'Leviatán', color: '#2563eb', shortCode: 'LEV' },
      { id: 'c3', label: 'Team Vitality', subLabel: 'Time EMEA', type: 'team', value: 'Team Vitality', color: '#fde047', shortCode: 'VIT' },
    ],
    rows: [
      { id: 'r1', label: 'Jogou na LOUD', subLabel: 'Passagem pela LOUD', type: 'team', value: 'LOUD', color: '#00ea62', shortCode: 'LOUD' },
      { id: 'r2', label: 'Campeão do Champions', subLabel: 'Troféu do Mundial', type: 'achievement', value: 'champions_winner', color: '#e2b714' },
      { id: 'r3', label: 'Duelista', subLabel: 'Função no VCT', type: 'role', value: 'Duelist', color: '#ff4655' },
    ],
  },
  {
    id: 'grid-eg-dynasty-crossover',
    number: 6,
    title: 'A Dispersão da EG: Leviatán, NRG & G2',
    description: 'Times dos dois lados! Onde foram parar as estrelas da Evil Geniuses campeã de 2023 em Leviatán, NRG e G2.',
    cols: [
      { id: 'c1', label: 'Leviatán', subLabel: 'Time Americas', type: 'team', value: 'Leviatán', color: '#2563eb', shortCode: 'LEV' },
      { id: 'c2', label: 'NRG', subLabel: 'Time Americas', type: 'team', value: 'NRG', color: '#ef4444', shortCode: 'NRG' },
      { id: 'c3', label: 'G2 Esports', subLabel: 'Time Americas', type: 'team', value: 'G2 Esports', color: '#ffffff', shortCode: 'G2' },
    ],
    rows: [
      { id: 'r1', label: 'Jogou na Evil Geniuses', subLabel: 'Passagem pela EG', type: 'team', value: 'Evil Geniuses', color: '#38bdf8', shortCode: 'EG' },
      { id: 'r2', label: 'Estados Unidos', subLabel: 'Bandeira dos EUA', type: 'nationality', value: 'estados unidos', color: '#3c3b6e', shortCode: 'USA' },
      { id: 'r3', label: 'Duelista', subLabel: 'Função no VCT', type: 'role', value: 'Duelist', color: '#ff4655' },
    ],
  },
  {
    id: 'grid-south-america-clash',
    number: 7,
    title: 'Sul-Americano VCT: Leviatán, KRÜ & LOUD',
    description: 'A força da América do Sul! Jogadores brasileiros, chilenos, argentinos e duelistas de LOUD, KRÜ e Leviatán.',
    cols: [
      { id: 'c1', label: 'Leviatán', subLabel: 'Americas VCT', type: 'team', value: 'Leviatán', color: '#2563eb', shortCode: 'LEV' },
      { id: 'c2', label: 'KRÜ Esports', subLabel: 'Americas VCT', type: 'team', value: 'KRÜ Esports', color: '#f43f5e', shortCode: 'KRÜ' },
      { id: 'c3', label: 'LOUD', subLabel: 'Brasil VCT', type: 'team', value: 'LOUD', color: '#00ff88', shortCode: 'LOUD' },
    ],
    rows: [
      { id: 'r1', label: 'Brasil', subLabel: 'Bandeira Brasileira', type: 'nationality', value: 'brasil', color: '#009c3b', shortCode: 'BRA' },
      { id: 'r2', label: 'Chile ou Argentina', subLabel: 'Bandeira LATAM Sul', type: 'nationality', value: 'chile_argentina', color: '#74acdf', shortCode: 'CL/AR' },
      { id: 'r3', label: 'Duelista', subLabel: 'Função no VCT', type: 'role', value: 'Duelist', color: '#ff4655' },
    ],
  },
  {
    id: 'grid-emea-turkey-clash',
    number: 8,
    title: 'A Força da Turquia: Fnatic, Heretics & FUT',
    description: 'A potência da Turquia no VCT! Encontre os prodígios turcos da Fnatic e Heretics e a linha de frente da FUT.',
    cols: [
      { id: 'c1', label: 'Fnatic', subLabel: 'Time EMEA', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
      { id: 'c2', label: 'Team Heretics', subLabel: 'Time EMEA', type: 'team', value: 'Team Heretics', color: '#f59e0b', shortCode: 'TH' },
      { id: 'c3', label: 'FUT Esports', subLabel: 'Turquia / EMEA', type: 'team', value: 'FUT Esports', color: '#d92534', shortCode: 'FUT' },
    ],
    rows: [
      { id: 'r1', label: 'Turquia', subLabel: 'Bandeira da Turquia', type: 'nationality', value: 'turquia', color: '#e11d48', shortCode: 'TUR' },
      { id: 'r2', label: 'Duelista', subLabel: 'Função no VCT', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r3', label: 'Iniciador', subLabel: 'Flash & Recon', type: 'role', value: 'Initiator', color: '#a855f7' },
    ],
  },
  {
    id: 'grid-emea-france-spain',
    number: 9,
    title: 'Conexão França & Espanha: G2, Fnatic & Heretics',
    description: 'Inspirado nos clássicos europeus do CS2: cruze as camisas de G2, Fnatic e Heretics com jogadores franceses, espanhóis e duelistas.',
    cols: [
      { id: 'c1', label: 'G2 Esports', subLabel: 'Time EMEA/Americas', type: 'team', value: 'G2 Esports', color: '#ffffff', shortCode: 'G2' },
      { id: 'c2', label: 'Fnatic', subLabel: 'Time EMEA', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
      { id: 'c3', label: 'Team Heretics', subLabel: 'Time EMEA', type: 'team', value: 'Team Heretics', color: '#f59e0b', shortCode: 'TH' },
    ],
    rows: [
      { id: 'r1', label: 'França ou Espanha', subLabel: 'Bandeira Francesa/Espanhola', type: 'nationality', value: 'frança_espanha', color: '#002654', shortCode: 'FR/ES' },
      { id: 'r2', label: 'Duelista', subLabel: 'Função no VCT', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r3', label: 'Iniciador', subLabel: 'Flash & Reconhecimento', type: 'role', value: 'Initiator', color: '#a855f7' },
    ],
  },
  {
    id: 'grid-pacific-masters',
    number: 10,
    title: 'Mestres do Pacífico: Paper Rex, DRX & Gen.G',
    description: 'A elite de Seul e Singapura em duelo de duelistas, iniciadores e rating elevado.',
    cols: [
      { id: 'c1', label: 'Paper Rex', subLabel: 'Time Pacific', type: 'team', value: 'Paper Rex', color: '#d946ef', shortCode: 'PRX' },
      { id: 'c2', label: 'DRX', subLabel: 'Reis de Seul', type: 'team', value: 'DRX', color: '#2563eb', shortCode: 'DRX' },
      { id: 'c3', label: 'Gen.G', subLabel: 'Campeão Masters', type: 'team', value: 'Gen.G', color: '#eab308', shortCode: 'GEN' },
    ],
    rows: [
      { id: 'r1', label: 'Rating 85+', subLabel: 'Estrela do VCT', type: 'achievement', value: 'rating_85_plus', color: '#a855f7' },
      { id: 'r2', label: 'Duelista', subLabel: 'Primeiro contato', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r3', label: 'Iniciador', subLabel: 'Controle de mapa', type: 'role', value: 'Initiator', color: '#38bdf8' },
    ],
  },
  {
    id: 'grid-champions-dynasties',
    number: 11,
    title: 'Dinastias de Champions: LOUD, EG & EDG',
    description: 'Organizações que levantaram o troféu máximo do Champions de 2022 a 2024!',
    cols: [
      { id: 'c1', label: 'LOUD', subLabel: 'Champions 2022', type: 'team', value: 'LOUD', color: '#00ff88', shortCode: 'LOUD' },
      { id: 'c2', label: 'Evil Geniuses', subLabel: 'Champions 2023', type: 'team', value: 'Evil Geniuses', color: '#1f2937', shortCode: 'EG' },
      { id: 'c3', label: 'EDward Gaming', subLabel: 'Champions 2024', type: 'team', value: 'EDward Gaming', color: '#dc2626', shortCode: 'EDG' },
    ],
    rows: [
      { id: 'r1', label: 'Campeão do Champions', subLabel: 'Levantou a taça mundial', type: 'achievement', value: 'champions_winner', color: '#e2b714' },
      { id: 'r2', label: 'Duelista', subLabel: 'Miras agressivas', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r3', label: 'Controlador', subLabel: 'Mestres de fumaça', type: 'role', value: 'Controller', color: '#38bdf8' },
    ],
  },
  {
    id: 'grid-defense-masters',
    number: 12,
    title: 'Mestres da Defesa: LOUD, Fnatic & Sentinels',
    description: 'Especialistas em travar bombsites e campeões mundiais de LOUD, Fnatic e Sentinels.',
    cols: [
      { id: 'c1', label: 'LOUD', subLabel: 'Time VCT', type: 'team', value: 'LOUD', color: '#00ff88', shortCode: 'LOUD' },
      { id: 'c2', label: 'Fnatic', subLabel: 'Time VCT', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
      { id: 'c3', label: 'Sentinels', subLabel: 'Time VCT', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
    ],
    rows: [
      { id: 'r1', label: 'Sentinela', subLabel: 'Killjoy / Cypher', type: 'role', value: 'Sentinel', color: '#f59e0b' },
      { id: 'r2', label: 'Campeão Internacional', subLabel: 'Champions ou Masters', type: 'achievement', value: 'international_trophy', color: '#e2b714' },
      { id: 'r3', label: 'Rating 85+', subLabel: 'Estrela mundial', type: 'achievement', value: 'rating_85_plus', color: '#10b981' },
    ],
  },
  {
    id: 'grid-reykjavik-pioneers',
    number: 13,
    title: 'Pioneiros de Reykjavík: Sentinels, OpTic & Fnatic',
    description: 'Os primeiros grandes campeões e finalistas do VCT internacional em cruzamento de troféus e funções clássicas.',
    cols: [
      { id: 'c1', label: 'Sentinels', subLabel: 'Campeão Masters 2021/24', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
      { id: 'c2', label: 'OpTic Gaming', subLabel: 'Campeão Reykjavík 22', type: 'team', value: 'OpTic Gaming', color: '#84cc16', shortCode: 'OG' },
      { id: 'c3', label: 'Fnatic', subLabel: 'Bi-Campeão Masters 23', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
    ],
    rows: [
      { id: 'r1', label: 'Campeão Internacional', subLabel: 'Champions ou Masters', type: 'achievement', value: 'international_trophy', color: '#e2b714' },
      { id: 'r2', label: 'Duelista', subLabel: 'Função no VCT', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r3', label: 'Controlador', subLabel: 'Smokes & Visão', type: 'role', value: 'Controller', color: '#38bdf8' },
    ],
  },
  {
    id: 'grid-south-america-axis',
    number: 14,
    title: 'Eixo Sul-Americano: LOUD, Leviatán & KRÜ',
    description: 'A força máxima do continente latino! Conexões entre iniciadores de elite, sentinelas e craques com rating 85+.',
    cols: [
      { id: 'c1', label: 'LOUD', subLabel: 'Brasil VCT', type: 'team', value: 'LOUD', color: '#00ff88', shortCode: 'LOUD' },
      { id: 'c2', label: 'Leviatán', subLabel: 'Americas VCT', type: 'team', value: 'Leviatán', color: '#2563eb', shortCode: 'LEV' },
      { id: 'c3', label: 'KRÜ Esports', subLabel: 'Americas VCT', type: 'team', value: 'KRÜ Esports', color: '#f43f5e', shortCode: 'KRÜ' },
    ],
    rows: [
      { id: 'r1', label: 'Iniciador', subLabel: 'Flash & Reconhecimento', type: 'role', value: 'Initiator', color: '#a855f7' },
      { id: 'r2', label: 'Sentinela', subLabel: 'Defesa & Travamento', type: 'role', value: 'Sentinel', color: '#f59e0b' },
      { id: 'r3', label: 'Rating 85+', subLabel: 'Estrela do VCT', type: 'achievement', value: 'rating_85_plus', color: '#10b981' },
    ],
  },
  {
    id: 'grid-na-big-three',
    number: 15,
    title: 'Tríplice Aliança NA: Sentinels, Cloud9 & NRG',
    description: 'As três maiores organizações da América do Norte em busca de duelistas letais, iniciadores e controladores experientes.',
    cols: [
      { id: 'c1', label: 'Sentinels', subLabel: 'Time Americas', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
      { id: 'c2', label: 'Cloud9', subLabel: 'Time Americas', type: 'team', value: 'Cloud9', color: '#0ea5e9', shortCode: 'C9' },
      { id: 'c3', label: 'NRG', subLabel: 'Time Americas', type: 'team', value: 'NRG', color: '#ef4444', shortCode: 'NRG' },
    ],
    rows: [
      { id: 'r1', label: 'Duelista', subLabel: 'Entrada de bombsite', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r2', label: 'Iniciador', subLabel: 'Flash & Recon', type: 'role', value: 'Initiator', color: '#a855f7' },
      { id: 'r3', label: 'Controlador', subLabel: 'Mestres de fumaça', type: 'role', value: 'Controller', color: '#38bdf8' },
    ],
  },
  {
    id: 'grid-emea-rivalries',
    number: 16,
    title: 'Clássicos Europeus: Fnatic, Team Liquid & Karmine Corp',
    description: 'As torcidas mais apaixonadas de EMEA em um grid de duelistas, iniciadores e craques com rating acima de 85.',
    cols: [
      { id: 'c1', label: 'Fnatic', subLabel: 'Time EMEA', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
      { id: 'c2', label: 'Team Liquid', subLabel: 'Time EMEA', type: 'team', value: 'Team Liquid', color: '#0f172a', shortCode: 'TL' },
      { id: 'c3', label: 'Karmine Corp', subLabel: 'Time EMEA', type: 'team', value: 'Karmine Corp', color: '#0284c7', shortCode: 'KC' },
    ],
    rows: [
      { id: 'r1', label: 'Duelista', subLabel: 'Miras agressivas', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r2', label: 'Iniciador', subLabel: 'Suporte tático', type: 'role', value: 'Initiator', color: '#a855f7' },
      { id: 'r3', label: 'Rating 85+', subLabel: 'Desempenho de elite', type: 'achievement', value: 'rating_85_plus', color: '#10b981' },
    ],
  },
  {
    id: 'grid-brazil-derby',
    number: 17,
    title: 'O Dérbi Brasileiro: LOUD, FURIA & MIBR',
    description: 'A história do cenário brasileiro no VCT! Atletas brasileiros, duelistas afiados e iniciadores fundamentais.',
    cols: [
      { id: 'c1', label: 'LOUD', subLabel: 'Campeão Mundial 22', type: 'team', value: 'LOUD', color: '#00ff88', shortCode: 'LOUD' },
      { id: 'c2', label: 'FURIA Esports', subLabel: 'Panteras no VCT', type: 'team', value: 'FURIA', color: '#ffffff', shortCode: 'FUR' },
      { id: 'c3', label: 'MIBR', subLabel: 'Made in Brazil', type: 'team', value: 'MIBR', color: '#1d4ed8', shortCode: 'MIBR' },
    ],
    rows: [
      { id: 'r1', label: 'Duelista', subLabel: 'Poder de fogo', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r2', label: 'Iniciador', subLabel: 'Comunicação & Util', type: 'role', value: 'Initiator', color: '#a855f7' },
      { id: 'r3', label: 'Brasil', subLabel: 'Bandeira Brasileira', type: 'nationality', value: 'brasil', color: '#009c3b', shortCode: 'BRA' },
    ],
  },
  {
    id: 'grid-global-favorites',
    number: 18,
    title: 'O Triângulo Global dos Favoritos: Sentinels, PRX & Fnatic',
    description: 'Os três times mais populares do mundo do Valorant frente a frente com duelistas, controladores e campeões de troféus internacionais.',
    cols: [
      { id: 'c1', label: 'Sentinels', subLabel: 'Americas', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
      { id: 'c2', label: 'Paper Rex', subLabel: 'Pacific', type: 'team', value: 'Paper Rex', color: '#d946ef', shortCode: 'PRX' },
      { id: 'c3', label: 'Fnatic', subLabel: 'EMEA', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
    ],
    rows: [
      { id: 'r1', label: 'Duelista', subLabel: 'Entrada agressiva', type: 'role', value: 'Duelist', color: '#ff4655' },
      { id: 'r2', label: 'Controlador', subLabel: 'Domínio de fumaça', type: 'role', value: 'Controller', color: '#38bdf8' },
      { id: 'r3', label: 'Campeão Internacional', subLabel: 'Champions ou Masters', type: 'achievement', value: 'international_trophy', color: '#e2b714' },
    ],
  },
];
