# Card System

Defines card categories, attributes, rarity, and value logic.

## Scope

This document covers:

- card types
- song variants
- card attributes
- card value model
- rarity and shiny behavior

## Card Types

- `Song`: main collectible type.
- `Artist`: rarer cards that buff linked songs and support multi-genre strategies.
- `Special`: album cards, shiny full-art cards, legendary tracks, legendary concerts, legendary events, legendary festivals, and accessories.

## Song Variants

Remix cards are normal track variants, not special cards.

Supported variants:

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

## Card Attributes

Each card can contain:

- title
- artist
- album
- card type
- genre: single-genre or multi-genre
- lyric excerpt
- popularity level
- experimental level
- computed card value
- variant type
- external links
- visual treatment

## Card Value

Card value is not a plain sum of popularity and experimentation.

Design intent:

- very popular but musically safe tracks should not automatically dominate
- tracks that are both popular and experimental should rank very high
- experimental but niche tracks can become strong in specific genre or lineup combos

Examples:

- `Shape of You`: very high popularity, low experimental score -> medium final card value
- `Stairway to Heaven`: high popularity and high experimental score -> high final card value

## Rarity and Shiny Variants

Suggested rarity mapping:

- `Common`: regular song cards
- `Uncommon`: stronger or more distinctive song cards
- `Rare`: artist cards
- `Ultra Rare`: album cards and some premium special cards
- `Secret Rare`: legendary special cards
- `Shiny`: alternate visual versions of selected iconic songs

Shiny behavior:

- same gameplay stats as normal version
- different frame and visual treatment
- lower drop rate
- reserved for culturally iconic songs

## See Also

- [Battle System](./battle-system.md)
- [Economy and Marketplace](./economy-marketplace.md)
- [Glossary](./glossary.md)
- [Documentation Index](./INDEX.md)
