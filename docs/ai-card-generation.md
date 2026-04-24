# AI Card Generation and Asset Storage

Defines how to generate card examples with AI and where to store generated assets.

## Scope

This document covers:

- prompt templates for AI card generation
- output format expectations
- repository storage rules for generated images
- naming conventions for traceability

## Recommended Storage Locations

Use this structure:

- `assets/cards/prompts/` for reusable prompt templates
- `assets/cards/generated/` for production-like generated card assets
- `assets/examples/cards/` for illustration-only sample cards

Use `assets/examples/cards/` when the content is only for demos, mockups, or documentation.

Suggested nested structure under generated assets:

- `assets/cards/generated/<pack-id>/<card-slug>/`

Suggested nested structure for illustration examples:

- `assets/examples/cards/<example-id>/`

Example:

- `assets/cards/generated/pack-2026-04/money-pink-floyd/`
- `assets/examples/cards/card-example-001/`

Store image versions and metadata together:

- `card-v1.png`
- `card-v2.png`
- `metadata.json`

For illustration examples, use explicit suffixes to avoid confusion:

- `card.example.json`
- `card.example-v1.png`
- `metadata.example.json`

## Metadata File

Create `metadata.json` next to each image with:

- prompt source file
- model/provider
- generation date
- seed (if available)
- parameters (size, style, steps)
- rights/licensing note

Example schema:

```json
{
  "card_slug": "money-pink-floyd",
  "pack_id": "pack-2026-04",
  "source_prompt": "assets/cards/prompts/song-card-json-template.txt",
  "model": "your-model-name",
  "provider": "your-provider",
  "generated_at": "2026-04-17T12:00:00Z",
  "seed": "optional-seed",
  "params": {
    "size": "1024x1024",
    "style": "illustrated",
    "steps": 30
  },
  "license_note": "Internal concept art only"
}
```

## Prompt Template (Card JSON)

Use this prompt when asking an AI to generate one complete card object.

```text
You are generating one complete card example for a music card game called "The Music Track List".

Goal:
Create a single card example, including every card element listed below.

Output format:
Return valid JSON only. No markdown, no explanation.

Card rules to follow:
- card_type must be one of: "song", "artist", "special"
- variant_type must describe a track variant (use "original" unless another variant is explicitly requested)
- genre can be a list if multi-genre
- card_value is NOT a plain sum; it should reflect the balance of popularity and experimental profile
- lyric_excerpt must be short and legal-safe (very short quote or non-infringing excerpt style)
- include external links with placeholders if exact URLs are unknown
- include visual_treatment details that could guide image generation
- include rarity tier and shiny flag

Required fields:
- title
- artist
- album
- card_type
- genre
- lyric_excerpt
- popularity_level (0-100)
- experimental_level (0-100)
- card_value (0-100)
- rarity_tier (Common, Uncommon, Rare, Ultra Rare, Secret Rare, Shiny)
- is_shiny (true/false)
- variant_type
- external_links:
  - grow_music_tree
  - spotify
  - youtube
  - apple_music
- visual_treatment:
  - frame_style
  - color_palette
  - artwork_prompt
  - animation_fx
- battle_tags (array of short tags for synergy/matchup use)
- design_notes (short explanation of why this score/rarity choice makes sense)

Input values:
Track: "<track-title>"
Artist: "<artist-name>"
Album: "<album-name-or-null>"

Now generate the card for the provided input values.
```

## Workflow

1. Generate card JSON with the template prompt.
2. Generate image from `visual_treatment.artwork_prompt`.
3. Decide target path:

- production-like output: `assets/cards/generated/<pack-id>/<card-slug>/`
- illustration-only output: `assets/examples/cards/<example-id>/`

4. Save image(s) and JSON/metadata in that folder.
5. If prompt was customized, save the exact prompt text in `assets/cards/prompts/`.

## See Also

- [Card System](./card-system.md)
- [Glossary](./glossary.md)
- [Documentation Index](./INDEX.md)
