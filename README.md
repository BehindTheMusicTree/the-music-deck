# The Music Deck

A collectible music card game inspired by Pokemon-style decks, booster packs, rarity tiers, and battle logic.

## Table of Contents

- [Overview](#overview)
- [Game Concept](#game-concept)
- [Collection Structure](#collection-structure)
  - [Initial Card Pool](#initial-card-pool)
  - [Deck Structure](#deck-structure)
  - [Booster Pack Structure](#booster-pack-structure)
- [Card System](#card-system)
  - [Card Types](#card-types)
  - [Song Variants](#song-variants)
  - [Card Attributes](#card-attributes)
  - [Card Value](#card-value)
  - [Rarity and Shiny Variants](#rarity-and-shiny-variants)
- [Battle System](#battle-system)
  - [Festival Battles](#festival-battles)
  - [Active Slots and Stacks](#active-slots-and-stacks)
  - [Synergies and Matchups](#synergies-and-matchups)
  - [Scoring Model](#scoring-model)
- [Collection Bonuses](#collection-bonuses)
  - [Album and Special Cards](#album-and-special-cards)
- [Integrations and Preview](#integrations-and-preview)
  - [External Links](#external-links)
  - [Song Preview](#song-preview)
- [Progression Ideas](#progression-ideas)
- [Open Questions](#open-questions)

## Overview

The Music Deck is a music card game where players collect songs, artists, and special cards, then build lineups for festival battles.

## Game Concept

- Each card represents a musical entity: a song, an artist, or a special collectible.
- Players collect cards through booster packs and progression systems.
- Battles use genre matchups, artist synergy, stack rules, and collection bonuses.
- The game borrows the structure of Pokemon TCG, but translates it into music culture.

## Collection Structure

### Initial Card Pool

Initial pool idea:

- 100 song cards
- 30 artist cards
- 15 special cards

### Deck Structure

Recommended Pokemon-style deck structure:

- 60 cards total
- 48 song cards
- 8 artist cards
- 4 special cards

This keeps songs as the core of the game while making artists and special cards more meaningful.

### Booster Pack Structure

Pokemon-style booster structure:

- 10 cards per booster
- 6 common song cards
- 3 uncommon song cards or song variants
- 1 rare slot

Example rare slot odds:

- 70% artist card
- 20% shiny song
- 7% album or accessory special card
- 3% legendary special card

## Card System

### Card Types

- `Song` cards: the main collectible type.
- `Artist` cards: rarer cards that buff linked songs and support multi-genre strategies.
- `Special` cards: album cards, shiny full-art cards, legendary tracks, legendary concerts, legendary events, legendary festivals, and accessories.

### Song Variants

Remix cards are normal track variants, not special cards.

Supported variants can include:

- remix
- cover
- parody
- live version
- extended version
- edit
- instrumental
- acoustic version
- demo
- alternate take
- orchestral version
- radio edit
- club mix
- unplugged version
- session version
- remastered version

### Card Attributes

Each card can contain:

- title
- artist
- card type
- genre: single-genre or multi-genre
- lyric excerpt
- popularity level
- experimental level
- computed card value
- variant type
- external links
- visual treatment

### Card Value

Card value should not be a plain sum of popularity and experimentation.

Instead, it should reward the relationship between the two:

- very popular but musically safe tracks should not automatically dominate
- tracks that are both popular and experimental should rank very high
- experimental but niche tracks can become strong in specific genre or lineup combos

Examples:

- `Shape of You`: very high popularity, low experimental score -> medium final card value
- `Stairway to Heaven`: high popularity and high experimental score -> high final card value

### Rarity and Shiny Variants

Suggested rarity mapping:

- `Common`: regular song cards
- `Uncommon`: stronger or more distinctive song cards
- `Rare`: artist cards
- `Ultra Rare`: album cards and some premium special cards
- `Secret Rare`: legendary special cards
- `Shiny`: alternate visual versions of selected iconic songs

Shiny implementation:

- same gameplay stats as the normal version
- different frame and visual treatment
- lower drop rate
- reserved for culturally iconic songs

## Battle System

### Festival Battles

Festivals are the main battle events.

- Players prepare lineups from their collection.
- Battles compare lineup quality, stack construction, genre matchups, and bonuses.

### Active Slots and Stacks

- A festival battle uses 10 active slots.
- A lineup can contain more than 10 physical cards if some cards are stacked.
- Multiple cards from the same artist count as only 1 active slot.
- Variants linked to the same artist or the same track family can also be stacked without taking a new active slot.

Stack scoring rule:

- each stack uses the most powerful card in that stack as its base value
- linked cards then add bonus effects instead of creating extra active slots

### Synergies and Matchups

Lineups can gain bonuses from:

- coherent genre synergy across the lineup
- artist card plus linked song cards from the same artist
- album and special card effects
- stacked variants that reinforce the same track or artist identity

Lineups can lose points from:

- weak genre matchups against the opponent
- incoherent genre spread
- low-value stacks with poor synergy

Genres act like Pokemon types:

- some genres are strong against others
- some genres are weak against others

### Scoring Model

Example scoring logic:

```text
Total Score =
  sum(best_card_value_per_active_stack)
  + stack_bonus
  + artist_synergy_bonus
  + genre_synergy_bonus
  + album_special_bonus
  - genre_weakness_penalty
```

This means battle power comes from:

- the best card in each active stack
- the quality of linked bonuses around that stack
- the overall coherence of the full lineup

## Collection Bonuses

### Album and Special Cards

Collection bonuses reward players who connect related cards.

Examples:

- owning a single and its album card
- stacking an artist card with linked songs
- combining a strong base track with its live or acoustic variants
- activating a legendary special card during a lineup build

Possible rewards:

- extra points
- stack bonus multipliers
- exclusive visual effects
- special battle modifiers

## Integrations and Preview

### External Links

Each card can include:

- a link to `https://grow.themusictree.org`
- platform links such as Spotify, Apple Music, Deezer, and YouTube

### Song Preview

Ideas for a mini preview:

- 10 to 30-second audio snippet if rights and APIs allow it
- otherwise a text teaser with hook plus metadata
- quick display with cover art, artist, genre, and highlighted lyric quote

## Progression Ideas

- Daily missions: find 3 cards of the same genre.
- Themed challenges: collect lyric quotes around one emotion.
- Set challenges: complete an artist line with 1 artist card and 3 songs.
- Event challenges: win a festival battle with at least 3 active combo bonuses.
- Player trading: marketplace or direct trade.

## Open Questions

- What is the source of truth for popularity: external APIs or an internal score?
- How should lyric excerpts be handled legally?
- What exact formula should convert popularity and experimental level into card value?
- How large should stack bonuses be for linked songs, artist cards, and variants?
- What exact genre matchup matrix should be used in battle?
- Is the main mode collection, duel, or both?
