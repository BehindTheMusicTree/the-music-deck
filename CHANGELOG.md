# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Changelog Best Practices

- Changelogs are for humans, not machines.
- Group changes under: Added, Changed, Improved, Removed, Fixed, Documentation, Performance.
- **"Test" is not a standalone category** — mention tests within the related feature or fix entry.
- Use an `[Unreleased]` section for upcoming changes.
- Use ISO 8601 date format: YYYY-MM-DD.

## [Unreleased]

### Changed

- **Genre colours**: Rock → flashy red (`#d01828`), Electronic → royal blue (`#2850c8`), Disco/Funk → hot pink (`#c0387a`), Reggae/Dub → grass green (`#3a9030`), Pop → near-white (`#c0b8d0`), World → red (`#a01818`), Vintage → grey (`#787878`)
- **Metal**: Reclassified as Rock subgenre, colour changed to dark red (`#7a0810`)
- **World**: Defined as a pattern genre — dotted white overlay on host genre colour, no fixed colour of its own

### Documentation

- **docs/charte-graphique.md**: Full visual charter added covering palette, genre colour system, subgenre blending rules, typography, and rarities
- **docs/genres.md**: Updated all genre dominant colours, added Metal as Rock subgenre, added subgenre colour system section
- **assets/charte-graphique/**: Static HTML charter reference (`the-music-deck-charter-v72.html`) with interactive genre colour wheel
