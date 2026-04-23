import type { Card } from './data/cards';
import { GENRE_CFG } from './data/genres';

export function cardArtSvg(card: Card): string {
  const cfg = GENRE_CFG[card.genre] ?? GENRE_CFG.Pop;
  const s = card.id * 137 + 42;
  const bars = Array.from({ length: 14 }, (_, i) => {
    const h = 16 + ((s + i * 31) % 52);
    const x = 6 + i * 16;
    const op = (0.18 + ((s + i * 7) % 6) * 0.1).toFixed(2);
    return `<rect x="${x}" y="${105 - h / 2}" width="10" height="${h}" rx="5" fill="${cfg.accent}" opacity="${op}"/>`;
  }).join('');
  const dots = Array.from({ length: 12 }, (_, i) => {
    const cx = 15 + ((s * i * 3) % 210);
    const cy = 10 + ((s * i * 7 + 33) % 160);
    const r = 1.5 + ((s + i) % 3);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cfg.accent}" opacity="${(0.08 + ((s + i * 11) % 5) * 0.05).toFixed(2)}"/>`;
  }).join('');
  return `<svg viewBox="0 0 234 190" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="rg${card.id}" cx="50%" cy="42%" r="72%">
      <stop offset="0%" stop-color="${cfg.bg0}"/>
      <stop offset="100%" stop-color="${cfg.bg1}"/>
    </radialGradient></defs>
    <rect width="234" height="190" fill="url(#rg${card.id})"/>
    ${dots}${bars}
    <text x="117" y="102" font-size="80" text-anchor="middle" dominant-baseline="middle" fill="${cfg.accent}" opacity="0.07" font-family="serif">${cfg.sym}</text>
    <text x="117" y="99"  font-size="78" text-anchor="middle" dominant-baseline="middle" fill="${cfg.accent}" opacity="0.42" font-family="serif">${cfg.sym}</text>
    <rect x="0" y="160" width="234" height="30" fill="${cfg.bg1}" opacity="0.65"/>
    <rect x="0" y="0"   width="234" height="18" fill="${cfg.bg1}" opacity="0.45"/>
  </svg>`;
}

export function applyScoreGlow(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('.ch-score').forEach(el => {
    const score = parseInt(el.textContent?.trim() ?? '', 10);
    if (isNaN(score)) return;
    const card = el.closest<HTMLElement>('.card');
    if (!card) return;
    const color = getComputedStyle(card).getPropertyValue('--border-color').trim();
    const t = Math.max(0, (score - 40) / 60);
    el.style.boxShadow = [
      `0 0 ${Math.round(t * 6)}px ${Math.round(t * 2)}px rgba(255,255,255,${(t * 0.45).toFixed(2)})`,
      `0 0 ${Math.round(t * 18)}px ${Math.round(t * 4)}px ${color}`,
      `0 0 ${Math.round(t * 36)}px ${Math.round(t * 4)}px ${color}55`,
    ].join(', ');
    el.style.borderColor = color;
    if (score >= 85) el.style.textShadow = `0 0 ${Math.round(((score - 85) / 15) * 8)}px ${color}`;
  });
}
