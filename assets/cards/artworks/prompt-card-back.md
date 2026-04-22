# Card Back — Image Generation Prompt

## Context

The card back is the face shown when a card is face-down or in a booster pack.
It must be instantly recognisable as "The Music Deck" without revealing the card's content.

## Prompt

```
Card back design for a premium collectible card game called "The Music Deck".
Portrait format, standard card ratio (2.5 × 3.5 in), with rounded corners (radius ~4mm).
Print-ready flat image. No card frame overlay.

Central motif: a stylised vinyl record seen from above, slightly tilted.
The grooves radiate outward as fine concentric rings with subtle metallic sheen.

Color treatment of the vinyl:
- Center label (inner circle): pure white (#d8d4f0) with a soft warm glow — the 9th colour.
- The 8 grooved rings radiating outward are each tinted with one genre accent colour,
  evenly distributed at 45° intervals around the record:
  1. Rock       #4a6e8a  (steel blue)
  2. Reggae     #4a7a52  (sage green)
  3. Vintage    #8a7028  (warm ochre)
  4. World      #8a3820  (terra cotta)
  5. Electronic #506070  (pewter)
  6. Country    #7a4e20  (sienna)
  7. Funk       #6a3878  (mauve)
  8. Hip-Hop    #7a5e18  (antique gold)
  Each colour is subtle and desaturated — a gentle tint in the groove sheen,
  not a bold solid fill. The transitions between segments are smooth.
Overall vinyl rendering: deep gold (#a87c28 → #c8a040) dominates the frame/rim,
with the genre tints visible mainly in reflected light across the grooves.

Surrounding the vinyl: an ornate geometric border in the style of antique
cartouche engraving — thin gold filigree lines with corner flourishes,
repeating diamond and dot motifs. The border sits 6–8% inward from
each edge, leaving a thin dark margin.

Background treatment: deep violet-black (#09080d to #100f18),
with a very faint radial vignette that concentrates warm amber light
at the center and fades to pure dark at the corners.
Subtle noise texture over the entire surface for a matte premium feel.

At the bottom of the card, centered: the logotype "THE MUSIC DECK" in Cinzel Black,
small but legible, in antique gold (#a87c28). "THE" in a smaller weight above "MUSIC DECK",
matching the brand's logo treatment. No other text.

Mood: dark luxury, collector edition, serious musicology.
References: high-end playing cards, Magic: The Gathering card backs,
vintage vinyl sleeve artwork, Art Deco engravings.

Style: digital illustration, vector-clean but with analog warmth,
no photographic realism, no gradients that look digital or garish.
Colour palette strictly limited to: near-black (#09080d), deep violet (#100f18),
antique gold (#a87c28, #c8a040), muted white (#d8d4f0).
No genre-specific colour. No artist imagery. No lyrics.
```

## Variants to explore

- **Shiny / Holographic**: same composition, iridescent foil layer over the vinyl grooves,
  rainbow shimmer along the filigree border edges.
- **Parchment / Print edition**: swap background to parchment (#f0e8d4),
  replace gold with ink (#1a1208), suitable for physical print or promo materials.
- **Collector / Deep Violet**: background shifted to #100818 (deep violet variant),
  border in slightly brighter gold — signals ultra-rare or event packs.

## Storage

Save generated images as:
- `assets/cards/artworks/generated/card-back-v1.png`
- `assets/cards/artworks/generated/card-back-shiny-v1.png`
- Include a `metadata.json` alongside each image (see `docs/ai-card-generation.md`).
