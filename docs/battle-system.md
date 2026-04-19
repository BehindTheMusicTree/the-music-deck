# Battle System

Defines festival battle rules, stacking, synergies, and score logic.

## Scope

This document covers:

- festival battle flow
- active slots and stack rules
- saved deck presets (lineups per battle context)
- synergy and matchup bonuses/maluses
- scoring model and examples

## Festival Battles

Festivals are the main battle events.

- Players prepare lineups from their collection.
- Battles compare lineup quality, stack construction, genre matchups, and bonuses.

## Saved deck presets

Players can **save named deck presets**: frozen lineup configurations (which cards sit in which stacks / slots) built from their collection, then reloaded before a battle instead of rebuilding from scratch each time.

Design intent:

- **Battle-context switching**: different presets for different situations, for example ladder PvP, casual duels, genre-ranked queues, weekly modifiers, event bosses, or anticipated opponent meta (genre-heavy lineups vs balanced stacks).
- **Fast iteration**: tweak one preset after a loss without losing other tuned setups.
- **Rules**: a preset must still respect active-slot limits and stacking rules at save time; on load, the client validates against the current collection (traded-away or missing cards surface as gaps the player must fix before queuing).

Optional product limits (to be tuned later): maximum number of saved presets per account, and whether presets can be shared as read-only loadouts between friends or Label members.

## Active Slots and Stacks

- A festival battle uses 10 active slots.
- A lineup can contain more than 10 physical cards if some cards are stacked.
- Multiple cards from the same artist count as only 1 active slot.
- Multiple cards from the same album count as only 1 active slot.
- Variants are linked to tracks (same track family), not artists, and can be stacked without taking a new active slot.

Stack scoring rule:

- each stack uses the most powerful card in that stack as its base value
- linked cards then add bonus effects instead of creating extra active slots
- each supplementary stacked card adds +15% bonus to that stack

## Synergies and Matchups

Lineups can gain bonuses from:

- coherent genre synergy across the lineup
- artist card plus linked song cards from the same artist
- album-linked stacks using the same bonus logic as artist-linked stacks
- album and special card effects
- stacked variants that reinforce the same track identity

Lineups can lose points from:

- weak genre matchups against the opponent
- incoherent genre spread
- low-value stacks with poor synergy

Genres act like Pokemon types:

- some genres are strong against others
- some genres are weak against others

## Scoring Model

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

Quick stack example:

- Base (most powerful card in stack) = 100 points
- 2 supplementary stacked cards = +30% total bonus
- Final stack value before other battle modifiers = 130 points

## See Also

- [Card System](./card-system.md)
- [Progression and Enigmas](./progression-and-enigmas.md)
- [Glossary](./glossary.md)
- [Documentation Index](./INDEX.md)
