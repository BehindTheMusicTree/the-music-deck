# Booster Opening UX

Specifies the user experience when a player opens a booster pack.

## Overview

Booster opening is a key moment of excitement in card game loops. This spec defines:

- Sequential card reveal animation
- Card value indicator visibility
- Visual treatment during opening

## Card Reveal Sequence

### Mechanics

- Cards are revealed **one at a time** (not all at once)
- Reveal delay: **~500-800ms** between cards (allows time to see each card without feeling sluggish)
- Each reveal includes a subtle animation (e.g., card flip, slide-in, or scale effect)
- Player can optionally **skip to end** (reveals all remaining cards immediately)

### User Actions

- Card is displayed with reveal animation
- Player can tap/click to advance to next card (or auto-advance after delay)
- After final card, show **summary view** (all opened cards in compact grid or list)
- Button to **add all to collection** or **view collection**

## Card Value Indicator

### Placement

- Located **below the card artwork** (under the song title or artist name)
- Clearly separated from other card details for quick scanning

### Visual Design: Gold Records (Disques d'Or)

The card value is shown as **1-5 filled gold record icons**.

**Mapping:**

- **1 disc**: Experimental/niche value (unique but low popularity)
- **2 discs**: Moderate value (popular or experimental, but not both)
- **3 discs**: Good value (balanced popularity + experimentation)
- **4 discs**: High value (very popular and/or highly experimental)
- **5 discs**: Exceptional value (iconic or legendary status)

### Formula Support

The gold record count is derived from the **computed card value** field:

- Computed value is calculated from: `popularity_score` + `experimentation_score`
- The result is normalized to a 1-5 scale
- _Exact bucketing formula TBD_ (see [Open Questions](./open-questions.md))

### Implementation Notes

- Display exactly N full gold record icons (no half-icons or empty slots)
- Use consistent icon sizing and color (e.g., gold #FFD700)
- Ensure high contrast for accessibility
- Do not show the raw numeric value (icon count only)

## Card Information Visible During Opening

Each revealed card shows:

- Card artwork / visual treatment
- Card title (song name or special name)
- Artist / Album (condensed)
- Card type badge (Song, Artist, Special)
- Rarity indicator (Common, Uncommon, Rare, Ultra Rare, Secret Rare, Shiny)
- **Card value indicator (1-5 gold records)** ← unique to this UX

Optional (lower priority, can be hidden until summary):

- Genre tags
- Variant type (if remix, cover, etc.)

## Summary View

After all cards are opened:

- Display grid or carousel of all opened cards
- Each card remains compact but legible
- Include total card count
- Include breakdown by rarity (optional)
- Show gold record distribution chart (optional)

## See Also

- [Card System](./card-system.md)
- [Decisions](./decisions.md)
- [Glossary](./glossary.md)
