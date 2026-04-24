import type { Genre } from "./cards";

export type CollectionHubCell = { genre: Genre; label: string };

/** 3×3 hub order: row = Classical / Vintage / Reggae·Dub, then Rock / Pop / Electronic, then Hip-Hop / World / Disco·Funk. */
export const COLLECTION_GENRE_HUB: CollectionHubCell[][] = [
  [
    { genre: "Classic", label: "Classical" },
    { genre: "Vintage", label: "Vintage" },
    { genre: "Reggae", label: "Reggae/Dub" },
  ],
  [
    { genre: "Rock", label: "Rock" },
    { genre: "Pop", label: "Pop" },
    { genre: "Electro", label: "Electronic" },
  ],
  [
    { genre: "HipHop", label: "Hip-Hop" },
    { genre: "World", label: "World" },
    { genre: "Funk", label: "Disco/Funk" },
  ],
];

const HUB_SET = new Set(
  COLLECTION_GENRE_HUB.flat().map((c) => c.genre),
);

export function collectionHubLabel(genre: Genre): string {
  return (
    COLLECTION_GENRE_HUB.flat().find((c) => c.genre === genre)?.label ?? genre
  );
}

export function parseCollectionHubGenre(
  param: string | string[] | undefined,
): Genre | null {
  const v = Array.isArray(param) ? param[0] : param;
  if (!v) return null;
  if (HUB_SET.has(v as Genre)) return v as Genre;
  return null;
}
