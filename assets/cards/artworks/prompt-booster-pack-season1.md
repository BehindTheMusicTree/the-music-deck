# Booster Pack — Season 1 — Image Generation Prompt

## Context

This is the clickable booster pack artwork shown before the player opens their cards.
Displayed at ~210×295px (standard card portrait ratio, 2:3).
The image replaces the current CSS gradient placeholder in the prototype.

## Prompt

```
Premium collectible card game booster pack for "The Music Deck — Season One".
Portrait format, 2:3 ratio, rounded corners (radius ~12px).
Flat print-ready image with no UI chrome, no frame overlay, no text beyond what is specified.

Overall shape: a sealed foil booster pack — slightly tapered at the top,
with a subtle tear-notch detail on the upper right edge.
The surface has a fine holographic foil texture: very faint rainbow iridescence
layered over a deep gold (#a87c28) base, catching light differently across zones.

Front face layout (top to bottom):
1. Top strip (~15% height): near-black (#09080d) band with the logotype
   "THE MUSIC DECK" centered in Cinzel Black, antique gold (#c8a040),
   small caps, tight letter-spacing.
   Below it, in Space Mono 7px: "SEASON ONE · 5 CARDS".
2. Main artwork zone (~65% height): a large stylised vinyl record,
   front-facing, slightly tilted ~8°. Same treatment as the card back:
   gold metallic rim, grooves with subtle genre colour tints at 45° intervals
   (Rock #4a6e8a, Reggae #4a7a52, Vintage #8a7028, World #8a3820,
   Electronic #506070, Country #7a4e20, Funk #6a3878, Hip-Hop #7a5e18),
   white label at center (#d8d4f0) with a warm glow.
   Behind the vinyl: a deep radial burst of amber-gold light fading to black.
3. Bottom strip (~20% height): dark panel (#100f18) with a thin gold top border.
   Centered text: "COLLECTION · SAISON I" in Space Mono, 8px, gold #a87c28.
   Below it, a row of 5 small diamond pips (◆◆◆◆◆) in gold — representing
   the 5 cards inside.

Lighting: single dramatic light source from upper-left, giving the foil surface
a directional gloss. Deep shadows on right and bottom edges for physical depth.

Mood: premium, sealed, anticipation. Like a high-end Pokémon or MTG booster
but dark luxury — not garish.

Style: digital illustration with analog warmth, crisp edges, no gradients
that look flat or digital. Colour palette: near-black (#09080d), deep gold
(#a87c28, #c8a040), muted white (#d8d4f0), very faint genre tints in grooves.
No photography. No faces. No lyrics.
```

## Usage in prototype

Once generated, save as:
`assets/cards/artworks/booster-pack-season1-v1.png`

Then in `prototype/index.html`, replace the `.pack-visual` div content:

```html
<div class="pack-visual" id="pack-visual" onclick="startPackOpen()">
  <img src="../assets/cards/artworks/booster-pack-season1-v1.png"
       alt="Season One booster pack"
       style="width:100%;height:100%;object-fit:cover;border-radius:16px;display:block;">
</div>
```

And update the `.pack-visual` CSS to remove the background gradient (keep only
border-radius, dimensions, cursor, and transition).

## Variants to explore

- **Shiny / Event edition**: stronger iridescence, silver instead of gold base,
  "SPECIAL EDITION" label replacing "SEASON ONE".
- **Empty / Opened state**: same design, top strip torn off, slightly crushed
  — for the post-opening animation frame.
