import type { Genre } from "./cards";

export interface GenreCfg {
  cls: string;
  genreLabel: string;
  bg0: string;
  bg1: string;
  accent: string;
  sym: string;
  icon: string;
}

export const GENRE_CFG: Record<Genre, GenreCfg> = {
  Rock: {
    cls: "g-metal",
    genreLabel: "Rock",
    bg0: "#0e1a4a",
    bg1: "#040a1e",
    accent: "#4060d8",
    sym: "🎸",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><polygon points="9,1 6,8 9,8 5,15 12,6 8,6" fill="currentColor"/></svg>',
  },
  Reggae: {
    cls: "g-reggae",
    genreLabel: "Reggae",
    bg0: "#0e2014",
    bg1: "#040c08",
    accent: "#5ab878",
    sym: "🌿",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><ellipse cx="8" cy="9" rx="5" ry="5.5" fill="none" stroke="currentColor" stroke-width="1.2"/><line x1="8" y1="3.5" x2="8" y2="1" stroke="currentColor" stroke-width="1.2"/><path d="M5 7 Q6.5 5 8 7 Q9.5 5 11 7" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
  },
  Vintage: {
    cls: "g-vintage",
    genreLabel: "Vintage",
    bg0: "#201610",
    bg1: "#0a0806",
    accent: "#b09878",
    sym: "🎷",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="currentColor" opacity=".85"/><circle cx="8" cy="8" r="5" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="0.6"/><circle cx="8" cy="8" r="3" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="0.6"/><circle cx="8" cy="8" r="2.2" fill="rgba(0,0,0,0.45)"/><circle cx="8" cy="8" r="0.8" fill="rgba(255,255,255,0.55)"/></svg>',
  },
  World: {
    cls: "g-world",
    genreLabel: "World",
    bg0: "#2a1208",
    bg1: "#0c0400",
    accent: "#c05040",
    sym: "🌍",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/><ellipse cx="8" cy="8" rx="3" ry="6" fill="none" stroke="currentColor" stroke-width=".8"/><line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width=".8"/></svg>',
  },
  Classic: {
    cls: "g-classic",
    genreLabel: "Classical",
    bg0: "#200a00",
    bg1: "#080200",
    accent: "#a85020",
    sym: "🎻",
    icon: '<span style="font-size:16px;line-height:1;">𝄞</span>',
  },
  Electro: {
    cls: "g-electro",
    genreLabel: "Electronic",
    bg0: "#0e1828",
    bg1: "#040810",
    accent: "#60a0c0",
    sym: "💿",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M1 8L3 8L5 3L7 13L9 5L11 11L13 8L15 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  Country: {
    cls: "g-country",
    genreLabel: "Country",
    bg0: "#241408",
    bg1: "#0c0600",
    accent: "#b07030",
    sym: "🤠",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><ellipse cx="8" cy="11" rx="7" ry="2" fill="currentColor" opacity=".85"/><path d="M4.5 11 Q4 8 5 6 Q6 4 8 4 Q10 4 11 6 Q12 8 11.5 11 Z" fill="currentColor" opacity=".85"/><line x1="4.8" y1="9.2" x2="11.2" y2="9.2" stroke="rgba(0,0,0,0.3)" stroke-width="1"/></svg>',
  },
  Funk: {
    cls: "g-funk",
    genreLabel: "Disco / Funk",
    bg0: "#200e30",
    bg1: "#0a0418",
    accent: "#a060c8",
    sym: "🕺",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1"/><line x1="8" y1="2.5" x2="8" y2="0" stroke="currentColor" stroke-width="1.2"/><rect x="3" y="4" width="3" height="2" rx=".5" fill="currentColor" opacity=".5"/><rect x="10" y="4" width="3" height="2" rx=".5" fill="currentColor" opacity=".5"/></svg>',
  },
  HipHop: {
    cls: "g-hiphop",
    genreLabel: "Hip-hop",
    bg0: "#221600",
    bg1: "#0a0800",
    accent: "#f0b800",
    sym: "🎤",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M10.5 5.5Q10.5 3.5 8 3.5Q5.5 3.5 5.5 6Q5.5 8 8 8Q10.5 8 10.5 10.5Q10.5 12.5 8 12.5Q5.5 12.5 5.5 10.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="8" y1="12.5" x2="8" y2="14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  },
  Pop: {
    cls: "g-pop",
    genreLabel: "Pop",
    bg0: "#201624",
    bg1: "#0c0814",
    accent: "#c0a0c8",
    sym: "✨",
    icon: '<svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,1 10,6 15,6 11,9.5 12.5,14.5 8,11.5 3.5,14.5 5,9.5 1,6 6,6" fill="currentColor"/></svg>',
  },
};

export const GENRES_ALL: (Genre | "All")[] = [
  "All",
  "Rock",
  "Pop",
  "Vintage",
  "Classic",
  "Electro",
  "Reggae",
  "Funk",
  "HipHop",
  "Country",
  "World",
];

export const DEFI_GENRES: Genre[] = [
  "Rock",
  "Classic",
  "Vintage",
  "Electro",
  "World",
];

export const MARKET_PRICES: Record<string, number> = {
  Legendary: 420,
  Epic: 180,
  Rare: 90,
  Common: 35,
};

export const RAR_SVG: Record<string, string> = {
  Legendary:
    '<svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 8,3.5 10,7 5,10 0,7 2,3.5" fill="#c8a040"/></svg>',
  Epic: '<svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 6.2,3.8 10,3.8 7,6.2 8.2,10 5,7.8 1.8,10 3,6.2 0,3.8 3.8,3.8" fill="#a060c8"/></svg>',
  Rare: '<svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 6,3.5 9.5,3.5 6.8,5.7 7.8,9.2 5,7.2 2.2,9.2 3.2,5.7 0.5,3.5 4,3.5" fill="#4a7aaa"/></svg>',
  Common:
    '<svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="none" stroke="#666" stroke-width="1.5"/></svg>',
};

export const TREE_NODES = [
  { genre: "Electro" as Genre, x: 50, y: 10, level: 0 },
  { genre: "Pop" as Genre, x: 18, y: 28, level: 1 },
  { genre: "HipHop" as Genre, x: 50, y: 28, level: 1 },
  { genre: "Rock" as Genre, x: 82, y: 28, level: 1 },
  { genre: "Vintage" as Genre, x: 12, y: 52, level: 2 },
  { genre: "Funk" as Genre, x: 35, y: 52, level: 2 },
  { genre: "Reggae" as Genre, x: 60, y: 52, level: 2 },
  { genre: "Classic" as Genre, x: 85, y: 52, level: 2 },
  { genre: "Country" as Genre, x: 25, y: 75, level: 3 },
  { genre: "World" as Genre, x: 60, y: 75, level: 3 },
];

export const TREE_EDGES: [Genre, Genre][] = [
  ["Electro", "Pop"],
  ["Electro", "HipHop"],
  ["Electro", "Rock"],
  ["Pop", "Vintage"],
  ["Pop", "Funk"],
  ["HipHop", "Funk"],
  ["HipHop", "Reggae"],
  ["Rock", "Reggae"],
  ["Rock", "Classic"],
  ["Vintage", "Country"],
  ["Funk", "World"],
];
