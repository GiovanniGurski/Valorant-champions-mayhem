import { GridPuzzle, GridCriterion, playerMatchesCriterion } from './gridPuzzles';
import { PLAYERS_DATABASE } from './teamsAndPlayers';

// Verified candidate column criteria for dynamic infinite generation
export const INFINITE_COL_CRITERIA: GridCriterion[] = [
  { id: 'c_loud', label: 'LOUD', subLabel: 'Time Americas', type: 'team', value: 'LOUD', color: '#00ff88', shortCode: 'LOUD' },
  { id: 'c_sen', label: 'Sentinels', subLabel: 'Time Americas', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
  { id: 'c_fnc', label: 'Fnatic', subLabel: 'Time EMEA', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
  { id: 'c_prx', label: 'Paper Rex', subLabel: 'Time Pacific', type: 'team', value: 'Paper Rex', color: '#d946ef', shortCode: 'PRX' },
  { id: 'c_eg', label: 'Evil Geniuses', subLabel: 'Time Americas', type: 'team', value: 'Evil Geniuses', color: '#1f2937', shortCode: 'EG' },
  { id: 'c_edg', label: 'EDward Gaming', subLabel: 'Time China', type: 'team', value: 'EDward Gaming', color: '#dc2626', shortCode: 'EDG' },
  { id: 'c_g2', label: 'G2 Esports', subLabel: 'Time Americas/EMEA', type: 'team', value: 'G2 Esports', color: '#ffffff', shortCode: 'G2' },
  { id: 'c_th', label: 'Team Heretics', subLabel: 'Time EMEA', type: 'team', value: 'Team Heretics', color: '#f59e0b', shortCode: 'TH' },
  { id: 'c_geng', label: 'Gen.G', subLabel: 'Time Pacific', type: 'team', value: 'Gen.G', color: '#eab308', shortCode: 'GEN' },
  { id: 'c_drx', label: 'DRX', subLabel: 'Time Pacific', type: 'team', value: 'DRX', color: '#2563eb', shortCode: 'DRX' },
  { id: 'c_c9', label: 'Cloud9', subLabel: 'Time Americas', type: 'team', value: 'Cloud9', color: '#0ea5e9', shortCode: 'C9' },
  { id: 'c_nrg', label: 'NRG', subLabel: 'Time Americas', type: 'team', value: 'NRG', color: '#ef4444', shortCode: 'NRG' },
  { id: 'c_lev', label: 'Leviatán', subLabel: 'Time Americas', type: 'team', value: 'Leviatán', color: '#0284c7', shortCode: 'LEV' },
  { id: 'c_kru', label: 'KRÜ Esports', subLabel: 'Time Americas', type: 'team', value: 'KRÜ Esports', color: '#f43f5e', shortCode: 'KRÜ' },
  { id: 'c_optic', label: 'OpTic Gaming', subLabel: 'Time Americas', type: 'team', value: 'OpTic Gaming', color: '#84cc16', shortCode: 'OG' },
  { id: 'c_tl', label: 'Team Liquid', subLabel: 'Time EMEA', type: 'team', value: 'Team Liquid', color: '#0f172a', shortCode: 'TL' },
  { id: 'c_fut', label: 'FUT Esports', subLabel: 'Time EMEA', type: 'team', value: 'FUT Esports', color: '#d92534', shortCode: 'FUT' },
];

// Verified candidate row criteria for dynamic infinite generation
export const INFINITE_ROW_CRITERIA: GridCriterion[] = [
  { id: 'r_duelist', label: 'Duelista', subLabel: 'Primeiro Contato', type: 'role', value: 'Duelist', color: '#ff4655' },
  { id: 'r_initiator', label: 'Iniciador', subLabel: 'Visão & Flashes', type: 'role', value: 'Initiator', color: '#a855f7' },
  { id: 'r_controller', label: 'Controlador', subLabel: 'Smokes & Bloqueio', type: 'role', value: 'Controller', color: '#38bdf8' },
  { id: 'r_sentinel', label: 'Sentinela', subLabel: 'Ancoragem & Travas', type: 'role', value: 'Sentinel', color: '#eab308' },
  { id: 'r_champ', label: 'Campeão do Champions', subLabel: 'Título Mundial', type: 'achievement', value: 'champions_winner', color: '#e2b714' },
  { id: 'r_trophy', label: 'Campeão Internacional', subLabel: 'Champions ou Masters', type: 'achievement', value: 'international_trophy', color: '#e2b714' },
  { id: 'r_r85', label: 'Rating 85+', subLabel: 'Estrela do VCT', type: 'achievement', value: 'rating_85_plus', color: '#10b981' },
  { id: 'r_clutch', label: 'Clutch 85+', subLabel: 'Frio nas Decisões', type: 'achievement', value: 'clutch_85_plus', color: '#f59e0b' },
  { id: 'r_br', label: 'Brasil', subLabel: 'Bandeira Brasileira', type: 'nationality', value: 'brasil', color: '#10b981', shortCode: 'BR' },
  { id: 'r_na', label: 'EUA ou Canadá', subLabel: 'América do Norte', type: 'nationality', value: 'eua_canada', color: '#ef4444', shortCode: 'NA' },
  { id: 'r_turkey', label: 'Turquia', subLabel: 'Bandeira Turca', type: 'nationality', value: 'turquia', color: '#e11d48', shortCode: 'TUR' },
  { id: 'r_kr', label: 'Coreia do Sul', subLabel: 'Bandeira Sul-Coreana', type: 'nationality', value: 'coreia do sul', color: '#3b82f6', shortCode: 'KR' },
  { id: 'r_latam', label: 'Chile ou Argentina', subLabel: 'América Latina Sul', type: 'nationality', value: 'chile_argentina', color: '#0284c7', shortCode: 'LATAM' },
  { id: 'r_emea', label: 'Região EMEA', subLabel: 'Europa & Turquia', type: 'region', value: 'emea', color: '#f59e0b', shortCode: 'EMEA' },
  { id: 'r_americas', label: 'Região Americas', subLabel: 'Circuito Americas', type: 'region', value: 'americas', color: '#10b981', shortCode: 'AMER' },
  { id: 'r_pacific', label: 'Região Pacífico', subLabel: 'Circuito Pacific', type: 'region', value: 'pacific', color: '#8b5cf6', shortCode: 'PAC' },
  { id: 'r_nrg', label: 'Passagem pela NRG', subLabel: 'Jogou na NRG', type: 'team', value: 'NRG', color: '#ef4444', shortCode: 'NRG' },
  { id: 'r_c9', label: 'Passagem pela Cloud9', subLabel: 'Jogou na C9', type: 'team', value: 'Cloud9', color: '#0ea5e9', shortCode: 'C9' },
  { id: 'r_sen', label: 'Passagem pela Sentinels', subLabel: 'Jogou na SEN', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
];

/**
 * Checks if a 3x3 grid setup is 100% solvable with at least 1 candidate per cell.
 */
export function isGridSolvable(
  rows: [GridCriterion, GridCriterion, GridCriterion],
  cols: [GridCriterion, GridCriterion, GridCriterion]
): boolean {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const hasMatch = PLAYERS_DATABASE.some(
        p => playerMatchesCriterion(p, rows[r]) && playerMatchesCriterion(p, cols[c])
      );
      if (!hasMatch) return false;
    }
  }
  return true;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Dynamically generates a fresh, randomized, 100% verified solvable 3x3 Grid Puzzle
 */
export function generateInfiniteGridPuzzle(roundNumber: number): GridPuzzle {
  const maxAttempts = 60;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Pick 3 random distinct columns (mostly teams or mixed)
    const shuffledCols = shuffle(INFINITE_COL_CRITERIA);
    const chosenCols: [GridCriterion, GridCriterion, GridCriterion] = [
      shuffledCols[0],
      shuffledCols[1],
      shuffledCols[2],
    ];

    // Pick 3 random distinct rows
    const shuffledRows = shuffle(INFINITE_ROW_CRITERIA);
    const chosenRows: [GridCriterion, GridCriterion, GridCriterion] = [
      shuffledRows[0],
      shuffledRows[1],
      shuffledRows[2],
    ];

    // Ensure row values don't clash with column values (e.g. Sentinels in row and col)
    const colValues = new Set(chosenCols.map(c => c.value));
    if (chosenRows.some(r => r.type === 'team' && colValues.has(r.value))) {
      continue;
    }

    if (isGridSolvable(chosenRows, chosenCols)) {
      const id = `infinite-grid-${Date.now()}-${roundNumber}-${attempt}`;
      const title = `Modo Infinito · Desafio #${roundNumber}`;
      const description = `Combinação dinâmica gerada: ${chosenCols.map(c => c.label).join(' × ')} cruzados com ${chosenRows.map(r => r.label).join(', ')}.`;

      return {
        id,
        number: roundNumber,
        title,
        description,
        cols: chosenCols,
        rows: chosenRows,
      };
    }
  }

  // Guaranteed fallback template if attempts exceed
  const fallbackCols: [GridCriterion, GridCriterion, GridCriterion] = [
    { id: 'c_f1', label: 'LOUD', subLabel: 'Time Americas', type: 'team', value: 'LOUD', color: '#00ff88', shortCode: 'LOUD' },
    { id: 'c_f2', label: 'Sentinels', subLabel: 'Time Americas', type: 'team', value: 'Sentinels', color: '#ce0037', shortCode: 'SEN' },
    { id: 'c_f3', label: 'Fnatic', subLabel: 'Time EMEA', type: 'team', value: 'Fnatic', color: '#ff5900', shortCode: 'FNC' },
  ];
  const fallbackRows: [GridCriterion, GridCriterion, GridCriterion] = [
    { id: 'r_f1', label: 'Duelista', subLabel: 'Primeiro Contato', type: 'role', value: 'Duelist', color: '#ff4655' },
    { id: 'r_f2', label: 'Iniciador', subLabel: 'Visão & Flashes', type: 'role', value: 'Initiator', color: '#a855f7' },
    { id: 'r_f3', label: 'Controlador', subLabel: 'Smokes & Bloqueio', type: 'role', value: 'Controller', color: '#38bdf8' },
  ];

  return {
    id: `infinite-grid-fallback-${roundNumber}`,
    number: roundNumber,
    title: `Modo Infinito · Desafio #${roundNumber}`,
    description: `Combinação clássica de estrelas de LOUD, Sentinels e Fnatic.`,
    cols: fallbackCols,
    rows: fallbackRows,
  };
}
