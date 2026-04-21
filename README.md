# Music Deck

A collectible music card game inspired by Pokemon-style content packs, booster loops, rarity tiers, and tactical battles.

## Overview

Music Deck lets players collect songs and special cards, then compete in festival battles using stack-based lineups and genre matchups.

## High-Level Product Snapshot

- Card catalog: songs and special cards, with expandable size over time.
- Release model: one active content pack at a time; boosters draw only from the active pack.
- Collection size: unlimited.
- Battle format: 10 active slots with stack rules.
- Stack rule: only cards from the same subgenre can be stacked; strongest card in stack is base, each supplementary stacked card adds +15%.
- Progression includes daily enigmas (10/day), missions, and MusicTree completion.
- Economy uses points from gameplay, boosters, enigmas, and optional freemium purchases.

## Documentation

Use the docs hub for detailed rules:

- [Documentation Index](./docs/INDEX.md)

Detailed specs:

- [Card System](./docs/card-system.md)
- [Pack Rotation Rules](./docs/pack-rotation.md)
- [Battle System](./docs/battle-system.md)
- [Economy and Marketplace](./docs/economy-marketplace.md)
- [Progression and Enigmas](./docs/progression-and-enigmas.md)
- [MusicTree View](./docs/musictree.md)
- [AI Card Generation and Asset Storage](./docs/ai-card-generation.md)

Shared references:

- [Glossary](./docs/glossary.md)
- [Decisions](./docs/decisions.md)
- [Open Questions](./docs/open-questions.md)

## Genres de Cartes (Types)

Chaque carte chanson appartient à un genre (type), qui influence les bonus/malus lors des battles contre d'autres types. Voici les 9 genres principaux et leur couleur associée :

| Genre / Type | Couleur     |
| ------------ | ----------- |
| Rock         | Bleu        |
| Reggae Dub   | Vert        |
| Vintage      | Jaune pâle  |
| World        | Rouge       |
| Classique    | Marron bois |
| Pop          | Blanc       |
| Electronic   | Métal       |
| Country      | Orange      |
| Disco Funk   | Violet      |
| Hip-hop      | Or          |

🎵 **TABLEAU DES FORCES / FAIBLESSES — MUSIC DECK**

| Genre / Type            | Fort contre →           | Faible contre ←         |
| ----------------------- | ----------------------- | ----------------------- |
| Rock (Bleu)             | Vintage (Jaune pâle)    | Reggae Dub (Vert)       |
| Reggae Dub (Vert)       | Rock (Bleu)             | Hip-hop (Or)            |
| Vintage (Jaune pâle)    | World (Rouge)           | Rock (Bleu)             |
| World (Rouge)           | Classique (Marron bois) | Vintage (Jaune pâle)    |
| Classique (Marron bois) | Electronic (Métal)      | World (Rouge)           |
| Pop (Blanc)             | Hip-hop (Or)            | Disco Funk (Violet)     |
| Electronic (Métal)      | Country (Orange)        | Classique (Marron bois) |
| Country (Orange)        | Disco Funk (Violet)     | Electronic (Métal)      |
| Disco Funk (Violet)     | Pop (Blanc)             | Country (Orange)        |
| Hip-hop (Or)            | Reggae Dub (Vert)       | Pop (Blanc)             |

**Rôle en battle :**

- Le genre d'une carte détermine ses affinités et faiblesses face aux autres genres.
- Certains genres obtiennent des bonus ou subissent des malus selon le type de l'adversaire (voir la documentation du système de battle pour les détails des interactions).
- Les stratégies de stack et de lineup tirent parti de ces interactions de types pour maximiser les chances de victoire.

Pour plus de détails sur les effets des genres en combat, consultez la section [Battle System](./docs/battle-system.md).

## External Link

- `https://grow.themusictree.org`
