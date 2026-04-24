# Missions and Challenges

Defines daily and weekly mission structures, rewards, and progression incentives.

## Overview

Missions provide structured goals that drive:

- Daily engagement (short gameplay sessions)
- Weekly long-term targets (deeper collection/strategy)
- Cross-mode engagement (battles, boosters, marketplace, enigmas)

## Daily Missions

**Objective:** Create a reason to return every day with low time commitment.

### Core Daily Challenges

Each day, players can complete any of these missions:

1. **Booster Challenge**: Open 2 boosters from the active pack
   - Reward: 30 points + bonus card
   - Engagement: collection loop, pack discovery

2. **Battle Challenge**: Win at least 1 festival battle
   - Reward: 35 points + rare+ card drop chance
   - Engagement: competitive, strategic

3. **Enigma Challenge**: Solve at least 5 enigmas (out of 10 available)
   - Reward: 25 points + card rewards per solved enigma
   - Engagement: knowledge, exploration

4. **Marketplace Challenge**: List, buy, or trade a card
   - Reward: 20 points + bonus marketplace fee discount (e.g., 1% off next transaction)
   - Engagement: economy, social

### Daily Pick

**Description:**

- Offered once per 24-hour window
- 5 face-down card slots from the active pack
- Player selects 1 card to add to collection
- Remaining 4 cards are discarded

**Purpose:**

- Guaranteed daily card reward (separate from booster luck)
- Adds decision-making (which card to pick without seeing details)
- Boosts daily engagement without requiring skill
- Acts as "free booster" equivalent

**Mechanics:**

- Timing: can be claimed anytime during the day
- Expiration: resets at 00:00 UTC (or per server timezone)
- Cannot be deferred (1 pick per day, not cumulative)

**Payout Considerations:**

- Non-rare weighted (more common/uncommon cards to avoid power creep)
- OR uniform random from active pack (simpler, less predictable)

### Daily Rewards

- Completing 1 daily mission: 1 mission point
- Completing 2+ daily missions: 1.5x multiplier
- Completing all 4 daily missions: 2x multiplier + bonus cosmetic or title progression

## Weekly Missions

**Objective:** Create long-form goals that encourage diverse gameplay and retention across the week.

### Core Weekly Challenges

Each week, players can complete any of these missions:

1. **Tournament Challenge**: Participate in a tournament (or complete 20 battles)
   - Reward: 100 points + Rare+ card slot
   - Engagement: extended competitive play, skill testing
   - Duration: entire week to accumulate battles

2. **Collection Challenge**: Collect 200 cards
   - Reward: 80 points + cosmetic frame or sleeve design
   - Engagement: booster openings, trading, enigma solving
   - Can use historical pack card acquisitions

3. **Exploration Challenge**: Discover 15 different subgenres across MusicTree
   - Reward: 80 points + genre-themed cosmetic
   - Engagement: learning music diversity, long-term MusicTree progression
   - Subgenres unlocked through cards acquired during the week

4. **Community Challenge**: Send 3 messages, create trade offers, or participate in group events
   - Reward: 70 points + title or badge
   - Engagement: social features, marketplace, community building

5. **Synergy Challenge**: Build and save a lineup with at least 5 active combo bonuses
   - Reward: 75 points + track list slot expansion or themed cosmetic
   - Engagement: strategic track list building, understanding synergies
   - Can be saved multiple times; only one "best" synergy counts

6. **Genre Diversity Challenge**: Win battles using 5 different single genres
   - Reward: 75 points + genre-specific cosmetic
   - Engagement: exploring diverse playstyles, testing lineups
   - Tracks battles won (not just participated)

7. **Rarity Acquisition Challenge**: Open enough boosters to obtain 10 rare+ cards
   - Reward: 90 points + rare cosmetic or track list slot
   - Engagement: booster loop, economic engagement
   - Counts all rare+ rarities (Rare, Ultra Rare, Secret Rare, Shiny)

### Weekly Bonus Multiplier

- **Completion stacking reward:** For every additional unique weekly mission completed beyond the first, apply a cumulative bonus
  - 1 mission: 1.0x
  - 2 missions: 1.15x per mission
  - 3 missions: 1.30x per mission
  - 4+ missions: 1.50x per mission
- **Example:** Complete 3 different missions and earn 1.30x base reward on each

### Weekly Reset

- All weekly missions reset every Sunday (or configurable day of week)
- Progress is tracked independently from daily missions
- Partial progress carries over each week (e.g., 150/200 cards stays as 150/200 on reset)

## Mission UI/UX

### Daily View

- Display 4 daily missions as cards/tiles
- Show progress bar for partial completion (e.g., "2/5 enigmas solved")
- Daily Pick displayed prominently as a special animated slot
- Claim button available when mission complete

### Weekly View

- Separate tab or section showing 7 weekly missions
- Show progress (e.g., "12/20 battles won")
- Indicate mission reward and completion status
- Display current week number or reset timer

### Reward Claiming

- Auto-claim daily missions (no manual action) or allow player to manually claim
- Weekly missions auto-claim at week end, or allow manual claim anytime after completion
- Show total mission points earned per day/week
- Display leaderboard or milestone progress (optional)

## Other Progression Loops

### Themed Events (Seasonal/Ad-hoc)

- **Themed Challenges**: Collect cards linked to one emotion, artist, or album.
- **Legendary Quests**: Multi-step challenges requiring:
  - Solving specific enigmas
  - Winning battles vs. AI or players
  - Acquiring cards from marketplace
  - Completing a final "boss" battle

### Long-Form Goals

- **MusicTree Completion**: Unlock cards across all subgenres and main genres
- **Collection Milestones**: Reach 500, 1000, 5000 unique cards (cosmetics, titles)
- **Battle Ladder**: Climb ranked season ladder (separate system, can tie to weekly tournament)

## Reward Distribution

### Point Allocation (Example Baseline)

**Daily Missions:**

- Easiest (marketplace): 20 pts
- Medium (enigma): 25 pts
- Hard (battles): 35 pts
- Booster (mixed): 30 pts
- Daily Pick: 1 free card (no points)
- Completion bonuses: 1.5x-2x multiplier

**Weekly Missions:**

- Base range: 70-100 pts per mission
- Completion bonus: 1.15x-1.50x multiplier based on 2-4+ missions

### Non-Point Rewards

- Cosmetics (card frames, sleeves, titles, avatars)
- Track list slots (expanding collection/battle lineup capacity)
- Cosmetic emotes or profile badges
- Early access to limited-edition cards or packs
- Marketplace fee discounts
- Free booster tokens (consume as "free booster")

## See Also

- [Progression and Enigmas](./progression-and-enigmas.md)
- [Economy and Marketplace](./economy-marketplace.md)
- [Battle System](./battle-system.md)
- [MusicTree View](./musictree.md)
- [Open Questions](./open-questions.md)
- [Documentation Index](./INDEX.md)
