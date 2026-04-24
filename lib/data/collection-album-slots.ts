import type { Card, Genre } from "./cards";
import { CARDS } from "./cards";

/** Slots per genre in the collection “album” view (full-set mode). */
export const COLLECTION_ALBUM_SIZE = 20;

const SLOT_BY_CARD_ID = new Map<number, number>();

function hashGenre(g: string): number {
  let h = 2166136261;
  for (let i = 0; i < g.length; i++) {
    h ^= g.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic shuffle of integers 1..n (Fisher–Yates with LCG). */
function shuffledSlots1ToN(n: number, seed: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i + 1);
  let s = seed >>> 0;
  for (let i = n - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const GENRES_IN_DATA = [...new Set(CARDS.map((c) => c.genre))] as Genre[];

for (const genre of GENRES_IN_DATA) {
  const inGenre = CARDS.filter((c) => c.genre === genre).sort(
    (a, b) => a.id - b.id,
  );
  const perm = shuffledSlots1ToN(COLLECTION_ALBUM_SIZE, hashGenre(genre));
  inGenre.forEach((c, idx) => {
    SLOT_BY_CARD_ID.set(c.id, perm[idx]!);
  });
}

export function collectionSlotForCard(cardId: number): number | undefined {
  return SLOT_BY_CARD_ID.get(cardId);
}

export type AlbumSlot = { slot: number; card: Card | null };

/** Slots 1..COLLECTION_ALBUM_SIZE; `card` null = no card defined for that slot in this genre yet. */
export function albumSlotsForGenre(genre: Genre): AlbumSlot[] {
  const bySlot = new Map<number, Card>();
  for (const c of CARDS) {
    if (c.genre !== genre) continue;
    const s = SLOT_BY_CARD_ID.get(c.id);
    if (s != null) bySlot.set(s, c);
  }
  const out: AlbumSlot[] = [];
  for (let slot = 1; slot <= COLLECTION_ALBUM_SIZE; slot++) {
    out.push({ slot, card: bySlot.get(slot) ?? null });
  }
  return out;
}

export function totalCardsInGenre(genre: Genre): number {
  return CARDS.filter((c) => c.genre === genre).length;
}
