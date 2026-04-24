import { Platform } from 'react-native';

/** Slightly scale text on web: density matches phone UI, and desktop layout uses a wider column. */
const WEB_TEXT_SCALE = 1.28;

export function fs(n: number): number {
  if (Platform.OS !== 'web') return n;
  return Math.round(n * WEB_TEXT_SCALE * 10) / 10;
}

export const colors = {
  bg:      '#09080d',
  surface: '#100f18',
  card:    '#16141f',
  border:  '#1e1c2c',
  gold:    '#a87c28',
  goldHi:  '#c8a040',
  rust:    '#7a3020',
  white:   '#d8d4f0',
  muted:   '#6a6480',
  dim:     '#28263a',
  // Parchment — card type strip, ability box, ink on parch
  parch:   '#f0e8d4',
  parch2:  '#e8dfc4',
  ink:     '#1a1208',
  // Logo background variants (charter: dark/sepia/parch/violet)
  logoBgSepia:  '#180e04',
  logoBgViolet: '#100818',
  navH:    64,
  topH:    52,
};

export const rarity = {
  Legendary: '#c8a040',
  Epic:      '#b070e0',
  Rare:      '#6090e0',
  Common:    '#7878a0',
} as const;

export const spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
} as const;

export const radius = {
  xs:   2,
  sm:   4,
  md:   8,
  lg:   16,
  xl:   18,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.85,
    shadowRadius: 32,
    elevation: 24,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

export const animation = {
  fast:   150,
  normal: 200,
  slow:   300,
} as const;

export const genreColors: Record<string, {
  border: string; cardBg: string; headerBg: string;
  textMain: string; textBody: string;
  barPop: string[]; barExp: string[];
  barGlowPop: string; barGlowExp: string;
}> = {
  rock:    { border: '#d01828', cardBg: '#200608', headerBg: '#180404', textMain: '#f04858', textBody: '#d02838', barPop: ['#800810','#e82030'], barExp: ['#600610','#b81828'], barGlowPop: 'rgba(232,32,48,.85)',  barGlowExp: 'rgba(184,24,40,.75)' },
  metal:   { border: '#7a0810', cardBg: '#180404', headerBg: '#100202', textMain: '#b03030', textBody: '#882020', barPop: ['#480408','#980c18'], barExp: ['#300204','#700810'], barGlowPop: 'rgba(152,12,24,.8)',   barGlowExp: 'rgba(112,8,16,.7)' },
  reggae:  { border: '#3a9030', cardBg: '#081a06', headerBg: '#061404', textMain: '#70d058', textBody: '#50b038', barPop: ['#185010','#48c030'], barExp: ['#103a08','#309820'], barGlowPop: 'rgba(72,192,48,.8)',   barGlowExp: 'rgba(48,152,32,.7)' },
  vintage: { border: '#787878', cardBg: '#121212', headerBg: '#0e0e0e', textMain: '#b0b0b0', textBody: '#888888', barPop: ['#404040','#a0a0a0'], barExp: ['#282828','#686868'], barGlowPop: 'rgba(176,176,176,.65)',barGlowExp: 'rgba(104,104,104,.6)' },
  world:   { border: '#a01818', cardBg: '#1e0808', headerBg: '#180404', textMain: '#d85858', textBody: '#b83838', barPop: ['#780808','#e03030'], barExp: ['#580808','#b02020'], barGlowPop: 'rgba(224,48,48,.75)',  barGlowExp: 'rgba(176,32,32,.7)' },
  classic: { border: '#5c2a0a', cardBg: '#130800', headerBg: '#0d0500', textMain: '#b86832', textBody: '#8a4a1a', barPop: ['#4a1a02','#a85020'], barExp: ['#321202','#7a3a14'], barGlowPop: 'rgba(168,80,32,.8)',   barGlowExp: 'rgba(122,58,20,.75)' },
  electro: { border: '#2850c8', cardBg: '#0a1020', headerBg: '#060c18', textMain: '#6888e8', textBody: '#4868c8', barPop: ['#102060','#3060e0'], barExp: ['#0c1848','#2048b0'], barGlowPop: 'rgba(48,96,224,.8)',   barGlowExp: 'rgba(32,72,176,.7)' },
  country: { border: '#7a4e20', cardBg: '#1c1008', headerBg: '#160c04', textMain: '#b88048', textBody: '#987028', barPop: ['#582808','#b07030'], barExp: ['#402010','#805028'], barGlowPop: 'rgba(176,112,48,.75)', barGlowExp: 'rgba(128,80,40,.7)' },
  funk:    { border: '#c0387a', cardBg: '#200812', headerBg: '#18060e', textMain: '#e868a0', textBody: '#c84880', barPop: ['#701840','#e05088'], barExp: ['#501030','#b03868'], barGlowPop: 'rgba(224,104,160,.8)', barGlowExp: 'rgba(176,56,104,.7)' },
  hiphop:  { border: '#c8960a', cardBg: '#1c1600', headerBg: '#140e00', textMain: '#f0b800', textBody: '#c89000', barPop: ['#7a5400','#f0b000'], barExp: ['#503800','#c08800'], barGlowPop: 'rgba(240,176,0,.8)',   barGlowExp: 'rgba(192,136,0,.75)' },
  pop:     { border: '#c0b8d0', cardBg: '#1a1820', headerBg: '#141218', textMain: '#e8e4f4', textBody: '#ccc8dc', barPop: ['#706880','#e0d0f0'], barExp: ['#504860','#a890b8'], barGlowPop: 'rgba(224,208,240,.8)', barGlowExp: 'rgba(168,144,184,.7)' },
};

// Maps Genre (capitalized) to genreColors key (lowercase)
export const genreKey: Record<string, string> = {
  Rock: 'rock', Pop: 'pop', Vintage: 'vintage', Classic: 'classic',
  Electro: 'electro', Reggae: 'reggae', Funk: 'funk', HipHop: 'hiphop',
  Country: 'country', World: 'world', Metal: 'metal',
};

export const fonts = {
  cinzel:           'Cinzel_400Regular',
  cinzelBold:       'Cinzel_700Bold',
  spaceMono:        'SpaceMono_400Regular',
  spaceMonoBold:    'SpaceMono_700Bold',
  cormorant:        'CormorantGaramond_400Regular',
  cormorantItalic:  'CormorantGaramond_400Regular_Italic',
  cormorantLight:   'CormorantGaramond_300Light',
  cormorantLightIt: 'CormorantGaramond_300Light_Italic',
};
