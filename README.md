# The Music Deck

Draft ideas for a **music card game app**.

## Table of Contents

- [Concept](#concept)
- [Card Types](#card-types)
- [Core Mechanics](#core-mechanics)
- [Festival Battles](#festival-battles)
- [Rarity / Shiny](#rarity--shiny)
- [Card Data (MVP)](#card-data-mvp)
- [External Links on Each Card](#external-links-on-each-card)
- [Song Preview](#song-preview)
- [Album / Remix Bonus](#album--remix-bonus)
- [Progression Ideas](#progression-ideas)
- [Open Questions](#open-questions)

## Concept

- Each card represents a song.
- Players collect, compare, and unlock rare cards.
- The game uses collectible game mechanics (Pokemon-style inspiration), applied to music.

## Card Types

- `Song` cards: main collectible type.
- `Artist` cards: appear less frequently than song cards.

Rarity direction:

- Song cards = common baseline - 8 per deck
- Artist cards = rarer drops - 2 per deck
- Artist cards for artists spanning many genres = extra rare.

## Core Mechanics

- `Genre` = equivalent of a Pokemon `type` (Pop, Rap, Electro, Rock, RnB, etc.).
- Cards can have :
  - advantages/disadvantages depending on the opposing genre.
  - a `popularity` score (based on streams, cultural impact, etc.).
  - an `experimental` score (how original, genre-bending, or musically bold a track is).
  - a `card value` score calculated from popularity + experimental balance.
  - an illustration: cover art ? artist portrait ? AI illustration ?
  - one **lyric quote** (short, iconic line).
- Artist cards can carry multiple genres and buff linked songs from the same artist.

Card value examples:

- `Shape of You`: very high popularity, low experimental -> medium final card value.
- `Stairway to Heaven`: high popularity and high experimental -> high final card value.

## Festival Battles

- Festivals are the battle events.
- In each battle, the player must build a lineup of 10 cards from their collection.
- During battle scoring, multiple cards from the same artist count as only 1 active card.
- Lineup combos increase score:
  - coherent genre synergy across the lineup,
  - artist card + at least one song card from that same artist.
- Matchups apply bonus/malus based on genre interactions between your lineup and the opponent lineup.

## Rarity / Shiny

- A very well-known song can exist as a **Shiny** version.
- The more popular the track is (streams, cultural impact, virality), the higher the chance of a Shiny variant.
- Shiny cards can include:
  - animated visuals,
  - a special frame,
  - a short sound effect.

## Card Data (MVP)

- Title
- Artist
- Genre (type, single or multi-genre)
- Card type: song / artist
- Lyric excerpt
- Popularity level
- Experimental level
- Card value (computed)
- External links
- Variant: normal / shiny

## External Links on Each Card

- Link to `https://grow.themusictree.org`
- Platform links (Spotify, Apple Music, Deezer, YouTube, etc.)

## Song Preview

Ideas for a mini preview:

- 10 to 30-second audio snippet (if rights and APIs allow it)
- Otherwise: text teaser (hook + metadata)
- Quick display: cover art + artist + genre + highlighted quote

## Album / Remix Bonus

- Bonus if the player owns:
  - the single card,
  - the matching album card,
  - or a remix version.
- Bonus examples:
  - extra points,
  - collection combo,
  - exclusive visual effects.

## Progression Ideas

- Daily missions: find 3 cards of the same genre.
- Themed challenges: collect lyric quotes around one emotion.
- Set challenges: complete an artist line (artist card + 3 songs).
- Event challenges: win a festival battle with at least 3 active combo bonuses.
- Player trading (marketplace or direct trade).

## Open Questions

- Source of truth for popularity (API / internal score)?
- Legal handling of lyric quotes?
- Exact scoring formula for lineup combos and genre matchups?
- Exact drop rates for song vs artist cards?
- Is the main mode collection, duel, or both?
