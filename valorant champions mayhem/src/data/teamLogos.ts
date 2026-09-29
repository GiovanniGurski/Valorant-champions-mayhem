// Real official team logos registry with authentic colors and custom SVG logos
// matching the exact visual identities requested.

export interface TeamLogoData {
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  category: 'Americas' | 'EMEA' | 'Pacific' | 'China';
}

export const TEAM_REAL_LOGOS: Record<string, TeamLogoData> = {
  loud: {
    name: 'LOUD',
    shortName: 'LOUD',
    primaryColor: '#00ff88',
    secondaryColor: '#003b1f',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/LOUD_logo.svg',
    category: 'Americas',
  },
  sentinels: {
    name: 'Sentinels',
    shortName: 'SEN',
    primaryColor: '#ce0037',
    secondaryColor: '#ffffff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Sentinels_logo.svg',
    category: 'Americas',
  },
  fnatic: {
    name: 'Fnatic',
    shortName: 'FNC',
    primaryColor: '#ff5900',
    secondaryColor: '#181a1d',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Fnatic_logo.svg',
    category: 'EMEA',
  },
  paperrex: {
    name: 'Paper Rex',
    shortName: 'PRX',
    primaryColor: '#d63384',
    secondaryColor: '#00d2ff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Paper_Rex_logo.svg',
    category: 'Pacific',
  },
  g2: {
    name: 'G2 Esports',
    shortName: 'G2',
    primaryColor: '#ee1515',
    secondaryColor: '#ffffff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/Esports_organization_G2_Esports_logo.svg',
    category: 'Americas',
  },
  liquid: {
    name: 'Team Liquid',
    shortName: 'TL',
    primaryColor: '#0c223f',
    secondaryColor: '#2b7fff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Team_Liquid_logo.svg',
    category: 'EMEA',
  },
  // 18 user-requested teams:
  xlg: {
    name: 'Xi Lai Gaming',
    shortName: 'XLG',
    primaryColor: '#38b2ac',
    secondaryColor: '#004b87',
    logoUrl: '/logos/xlg.svg',
    category: 'China',
  },
  geng: {
    name: 'Gen.G Esports',
    shortName: 'GEN',
    primaryColor: '#aa8a00',
    secondaryColor: '#000000',
    logoUrl: '/logos/geng.svg',
    category: 'Pacific',
  },
  edg: {
    name: 'EDward Gaming',
    shortName: 'EDG',
    primaryColor: '#c51d24',
    secondaryColor: '#111111',
    logoUrl: '/logos/edg.svg',
    category: 'China',
  },
  vitality: {
    name: 'Team Vitality',
    shortName: 'VIT',
    primaryColor: '#f5c518',
    secondaryColor: '#000000',
    logoUrl: '/logos/vitality.svg',
    category: 'EMEA',
  },
  ns: {
    name: 'Nongshim RedForce',
    shortName: 'NS',
    primaryColor: '#de2027',
    secondaryColor: '#101010',
    logoUrl: '/logos/ns.svg',
    category: 'Pacific',
  },
  heretics: {
    name: 'Team Heretics',
    shortName: 'TH',
    primaryColor: '#d6a13d',
    secondaryColor: '#121212',
    logoUrl: '/logos/heretics.svg',
    category: 'EMEA',
  },
  nrg: {
    name: 'NRG Esports',
    shortName: 'NRG',
    primaryColor: '#ff3800',
    secondaryColor: '#2b2b2b',
    logoUrl: '/logos/nrg.svg',
    category: 'Americas',
  },
  jdg: {
    name: 'JD Gaming',
    shortName: 'JDG',
    primaryColor: '#d81e28',
    secondaryColor: '#0b1325',
    logoUrl: '/logos/jdg.svg',
    category: 'China',
  },
  talon: {
    name: 'Talon Esports',
    shortName: 'TLN',
    primaryColor: '#ea1d2d',
    secondaryColor: '#ffffff',
    logoUrl: '/logos/talon.svg',
    category: 'Pacific',
  },
  trace: {
    name: 'Trace Esports',
    shortName: 'TE',
    primaryColor: '#00adb5',
    secondaryColor: '#2e3859',
    logoUrl: '/logos/trace.svg',
    category: 'China',
  },
  kru: {
    name: 'KRÜ Esports',
    shortName: 'KRÜ',
    primaryColor: '#ff007f',
    secondaryColor: '#111111',
    logoUrl: '/logos/kru.svg',
    category: 'Americas',
  },
  thieves: {
    name: '100 Thieves',
    shortName: '100T',
    primaryColor: '#de1f26',
    secondaryColor: '#1a1a1a',
    logoUrl: '/logos/100t.svg',
    category: 'Americas',
  },
  mibr: {
    name: 'MIBR',
    shortName: 'MIBR',
    primaryColor: '#111827',
    secondaryColor: '#001a4d',
    logoUrl: '/logos/mibr.svg',
    category: 'Americas',
  },
  optic: {
    name: 'OpTic Gaming',
    shortName: 'OPTIC',
    primaryColor: '#88c227',
    secondaryColor: '#181818',
    logoUrl: '/logos/optic.svg',
    category: 'Americas',
  },
  leviatan: {
    name: 'Leviatán',
    shortName: 'LEV',
    primaryColor: '#4ea5de',
    secondaryColor: '#003366',
    logoUrl: '/logos/leviatan.svg',
    category: 'Americas',
  },
  kc: {
    name: 'Karmine Corp',
    shortName: 'KC',
    primaryColor: '#00c8ff',
    secondaryColor: '#051336',
    logoUrl: '/logos/kc.svg',
    category: 'EMEA',
  },
  drx: {
    name: 'DRX',
    shortName: 'DRX',
    primaryColor: '#2563eb',
    secondaryColor: '#5ce1e6',
    logoUrl: '/logos/drx.svg',
    category: 'Pacific',
  },
  blg: {
    name: 'Bilibili Gaming',
    shortName: 'BLG',
    primaryColor: '#00a6e3',
    secondaryColor: '#f25d8e',
    logoUrl: '/logos/blg.svg',
    category: 'China',
  },
  // Other historic teams
  fpx: {
    name: 'FunPlus Phoenix',
    shortName: 'FPX',
    primaryColor: '#ff4655',
    secondaryColor: '#ff9900',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/FunPlus_Phoenix_logo.svg',
    category: 'EMEA',
  },
  eg: {
    name: 'Evil Geniuses',
    shortName: 'EG',
    primaryColor: '#053e6b',
    secondaryColor: '#ffffff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Evil_Geniuses_logo.svg',
    category: 'Americas',
  },
  fut: {
    name: 'FUT Esports',
    shortName: 'FUT',
    primaryColor: '#d92534',
    secondaryColor: '#111111',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/FUT_Esports_logo.png',
    category: 'EMEA',
  },
  navi: {
    name: 'Natus Vincere',
    shortName: 'NAVI',
    primaryColor: '#fff200',
    secondaryColor: '#000000',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Natus_Vincere_logo.svg',
    category: 'EMEA',
  },
  zeta: {
    name: 'ZETA DIVISION',
    shortName: 'ZETA',
    primaryColor: '#c4ff00',
    secondaryColor: '#121212',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/ZETA_DIVISION_logo.svg',
    category: 'Pacific',
  },
  t1: {
    name: 'T1',
    shortName: 'T1',
    primaryColor: '#e4002b',
    secondaryColor: '#0f0f0f',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/T1_logo.svg',
    category: 'Pacific',
  },
  tyloo: {
    name: 'TYLOO',
    shortName: 'TYL',
    primaryColor: '#d62828',
    secondaryColor: '#f77f00',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/TyLoo_logo.svg',
    category: 'China',
  },
};

// Normalized helper to find team data
export function getTeamLogoData(teamQuery: string): TeamLogoData | null {
  if (!teamQuery) return null;
  const q = teamQuery.toLowerCase().replace(/[\s-]/g, '');

  if (q.includes('loud')) return TEAM_REAL_LOGOS.loud;
  if (q.includes('sentinel') || q === 'sen') return TEAM_REAL_LOGOS.sentinels;
  if (q.includes('fnatic') || q === 'fnc') return TEAM_REAL_LOGOS.fnatic;
  if (q.includes('paperrex') || q === 'prx') return TEAM_REAL_LOGOS.paperrex;
  if (q.includes('g2')) return TEAM_REAL_LOGOS.g2;
  if (q.includes('liquid') || q === 'tl') return TEAM_REAL_LOGOS.liquid;

  // 18 user-requested teams:
  if (q.includes('xilai') || q.includes('xlg')) return TEAM_REAL_LOGOS.xlg;
  if (q.includes('geng') || q === 'gen') return TEAM_REAL_LOGOS.geng;
  if (q.includes('edward') || q.includes('edg')) return TEAM_REAL_LOGOS.edg;
  if (q.includes('vitality') || q === 'vit') return TEAM_REAL_LOGOS.vitality;
  if (q.includes('nongshim') || q.includes('redforce') || q === 'ns') return TEAM_REAL_LOGOS.ns;
  if (q.includes('heretics') || q === 'th') return TEAM_REAL_LOGOS.heretics;
  if (q.includes('nrrg') || q.includes('nrg')) return TEAM_REAL_LOGOS.nrg;
  if (q.includes('jdg') || q.includes('jdgaming')) return TEAM_REAL_LOGOS.jdg;
  if (q.includes('talon') || q === 'tln') return TEAM_REAL_LOGOS.talon;
  if (q.includes('trace') || q === 'te') return TEAM_REAL_LOGOS.trace;
  if (q.includes('kru') || q.includes('krü')) return TEAM_REAL_LOGOS.kru;
  if (q.includes('100thieves') || q.includes('100t') || q.includes('thieves')) return TEAM_REAL_LOGOS.thieves;
  if (q.includes('mibr')) return TEAM_REAL_LOGOS.mibr;
  if (q.includes('optic')) return TEAM_REAL_LOGOS.optic;
  if (q.includes('leviathan') || q.includes('leviatan') || q.includes('leviatán') || q === 'lev') return TEAM_REAL_LOGOS.leviatan;
  if (q.includes('karmine') || q.includes('kc')) return TEAM_REAL_LOGOS.kc;
  if (q.includes('drx') || q.includes('dragonx')) return TEAM_REAL_LOGOS.drx;
  if (q.includes('bilibili') || q.includes('blg')) return TEAM_REAL_LOGOS.blg;

  // Historic
  if (q.includes('funplus') || q === 'fpx') return TEAM_REAL_LOGOS.fpx;
  if (q.includes('evil') || q.includes('eg')) return TEAM_REAL_LOGOS.eg;
  if (q.includes('fut')) return TEAM_REAL_LOGOS.fut;
  if (q.includes('navi') || q.includes('natus')) return TEAM_REAL_LOGOS.navi;
  if (q.includes('zeta')) return TEAM_REAL_LOGOS.zeta;
  if (q.includes('t1')) return TEAM_REAL_LOGOS.t1;
  if (q.includes('tyloo')) return TEAM_REAL_LOGOS.tyloo;

  return null;
}
