# Genres

Defines the 10 genre archetypes, their visual identity, gameplay role, and synergy logic.

## Scope

This document covers:

- genre list with colors and archetypes
- gameplay identity per genre
- synergy rules

## Genre Archetypes

Each genre has a dominant color used for card frames and UI, and a gameplay archetype that defines how it behaves in battles.

### 1. Rock

- **Dominant color**: Flashy red (`#d01828`)
- **Archetype**: Warriors, brutes, tanks
- **Description**: Specialists in raw power and resilience, they boost allies of the same genre. Their strength comes from the collective and stage rage.
- **Strength**: Vintage
- **Weakness**: Electronic

#### Subgenre: Metal

- **Dominant color**: Dark red (`#7a0810`) — rouge plus sombre que le Rock, sous-genre extérieur
- **Archetype**: Warriors, brutes, tanks (version extrême)

### 2. Reggae / Dub

- **Dominant color**: Grass green (`#3a9030`)
- **Archetype**: Healer mages, nature shamans
- **Description**: Masters of healing and debuff reduction, they protect and heal using natural vibes and plants. Attribute: Nature, harmony.
- **Strength**: Electronic
- **Weakness**: Disco / Funk

#### Subgenre direction: Dub

- **Color**: Turquoise (`~#20a898`) — vert gazon tirant vers le bleu roi électro

#### Subgenre direction: Reggae (sous-genres)

- **Color**: Vert pomme (`~#78d828`) — vert gazon plus vif et lumineux

### 3. Vintage

- **Dominant color**: Gray (`#787878`)
- **Archetype**: Virtuosos, improvisers, tempo manipulators
- **Description**: Experts in improvisation, they gain power as rounds progress and manipulate the rhythm of the game.
- **Strength**: Country
- **Weakness**: Rock / Metal

### 4. World

- **Dominant color**: Red (`#a01818`)
- **Archetype**: Travelers, adaptive, multicultural bonuses
- **Description**: Benefit from diversity: the more different genres in the lineup, the stronger they become. Adaptability and openness.
- **Strength**: Pop
- **Weakness**: Country

### 5. Classical

- **Dominant color**: Brown wood (`#5c2a0a`)
- **Archetype**: Summoners, deific, unique powerful effects
- **Description**: Unique effect cards, invocation of higher powers, stack bonuses, but not stackable with other Classical cards.
- **Strength**: Disco / Funk
- **Weakness**: Hip-hop

### 6. Electronic

- **Dominant color**: Royal blue (`#2850c8`)
- **Archetype**: Engineers, accumulators, resource generators
- **Description**: Generate stack bonuses each round, accumulate resources over time.
- **Strength**: Rock / Metal
- **Weakness**: Reggae / Dub

### 7. Country

- **Dominant color**: Burnt sienna (`#7a4e20`)
- **Archetype**: Survivors, immune, robust
- **Description**: Temporary immunity to debuffs, very resilient at the start of the game.
- **Strength**: World
- **Weakness**: Vintage

### 8. Disco / Funk

- **Dominant color**: Hot pink (`#c0387a`)
- **Archetype**: Collective boosters, party makers
- **Description**: The more active stacks in the lineup, the more everyone is boosted. Group synergy.
- **Strength**: Reggae / Dub
- **Weakness**: Classical

### 9. Hip-hop

- **Dominant color**: Antique gold (`#7a5e18`)
- **Archetype**: Leaders, soloists, "gangs"
- **Description**: Work solo or in groups: bonus if alone in the lineup, but also "crew" synergies. Immunity to debuffs when solo.
- **Strength**: Classical
- **Weakness**: Pop

### 10. Pop

- **Dominant color**: Near-white (`#c0b8d0`)
- **Archetype**: Universal, spreaders, connectors
- **Description**: Share their bonuses with adjacent cards. Great accessibility and popularity.
- **Strength**: Hip-hop
- **Weakness**: World

## Genre Strengths & Weaknesses

Each genre has a strength against another genre, and a weakness against a different one. This creates a strategic triangle similar to type matchups in other games.

| Genre        | Strength vs. | Weakness vs. |
| ------------ | ------------ | ------------ |
| Rock         | Vintage      | Electronic   |
| Reggae / Dub | Electronic   | Disco / Funk |
| Vintage      | Country      | Rock         |
| World        | Pop          | Country      |
| Classical    | Disco / Funk | Hip-hop      |
| Electronic   | Rock         | Reggae / Dub |
| Country      | World        | Vintage      |
| Disco / Funk | Reggae / Dub | Classical    |
| Hip-hop      | Classical    | Pop          |
| Pop          | Hip-hop      | World        |

> These relationships can be adjusted for game balance. They are both thematic and strategic.

## Synergy Logic

Genres interact in battles like type matchups (see [Battle System](./battle-system.md)):

- Some genres are strong against others
- Some genres are weak against others
- World cards gain power proportional to the number of distinct genres in the lineup
- Classical effects are unique and non-stackable with other Classical cards
- Disco / Funk effects scale with the total number of active stacks
- Hip-hop cards gain solo immunity to debuffs when they are the only card of their genre in the lineup

## Subgenre Color System

Each subgenre inherits the dominant color of its parent genre, with a variation that can pull toward a second genre. The further the subgenre sits from the parent's core, the more it blends toward the secondary genre's hue.

**Examples:**

| Subgenre   | Parent genre(s)   | Color                                      |
| ---------- | ----------------- | ------------------------------------------ |
| Metal      | Rock              | Navy blue (`#1a2e6a`) — denim foncé        |
| Funk Metal      | Rock + Funk       | Indigo (`~#8020a0`) — rouge rock tirant au rose funk   |
| Pop Rap         | Hip-hop + Pop     | Jaune très clair (`~#f0e890`) — or pastel              |
| Dub (ss-genres) | Reggae + Electro  | Turquoise (`~#20a898`) — vert gazon + bleu roi électro |
| Reggae (ss-genres) | Reggae         | Vert pomme (`~#78d828`) — vert gazon plus lumineux     |

> This table will grow as subgenres are defined. The color blending ratio reflects the thematic distance from the parent genre.

## Subgenres Reference

A complete list of genres and subgenres, with their unique codes and numbering (format: GG-SS-10000), is maintained in a dedicated spreadsheet:

- [Genres & Subgenres Master List (Google Sheets)](https://docs.google.com/spreadsheets/d/1MIotDpIYESwmIVQpHcrTzjQ5sdMlkHIucFfNMpFKvs0/edit?usp=sharing)

Each subgenre is assigned a unique code:

- 2 letters for the genre (GG)
- 2 letters for the subgenre (SS, unique per genre)
- 5-digit increment (e.g., 10000)

**Example:**

- `RK-HM-00666` → "666 (Number of the Beast)" by Iron Maiden (Genre: Rock/Metal, Subgenre: Heavy Metal, ID: 666)

This file is the authoritative source for all genre/subgenre definitions and codes used in The Music Deck.

## See Also

- [Card System](./card-system.md)
- [Battle System](./battle-system.md)
- [Glossary](./glossary.md)
- [Documentation Index](./INDEX.md)
