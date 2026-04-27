# The Music Deck

A collectible music card game where players build lineups, open boosters, and battle through genre-based strategy.

## Table of Contents

- [Concept](#concept)
- [Core Gameplay Snapshot](#core-gameplay-snapshot)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [External Link](#external-link)

## Concept

The Music Deck combines music discovery with collectible card mechanics:

- Collect song cards and special cards.
- Open boosters from the currently active content pack.
- Build battle-ready lineups using stack and genre synergies.
- Progress through daily enigmas, missions, and MusicTree completion.

## Core Gameplay Snapshot

- **Card catalog**: Song and special cards, designed to expand over time.
- **Pack model**: Only one pack is active at a time, and boosters draw from that active pack.
- **Collection size**: Unlimited.
- **Battle format**: 10 active slots per festival battle.
- **Stack rule**: Only cards from the same subgenre can stack; the strongest card is the base, and each supplementary stacked card adds `+15%`.
- **Economy**: Point-driven progression from battles, boosters, enigmas, and optional freemium bundles.

## Tech Stack

- Expo
- React Native + React Native Web
- Expo Router
- TypeScript
- ESLint

## Prerequisites

- Node.js (current LTS recommended)
- npm (or another package manager, with npm commands adapted accordingly)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the web development server:

   ```bash
   npm run dev
   ```

3. Optional platform targets:

   ```bash
   npm run ios
   npm run android
   ```

## Available Scripts

- `npm run dev`: Start Expo in web mode.
- `npm run ios`: Start Expo targeting iOS.
- `npm run android`: Start Expo targeting Android.
- `npm run build`: Export a web build.
- `npm run lint`: Run ESLint.

## Project Structure

- `app/`: Route-level screens and Expo Router entry points.
- `components/`: Reusable UI and gameplay components.
- `lib/`: Shared data, tokens, and domain constants.
- `docs/`: Product specs, game rules, and design decisions.
- `assets/`: Source assets used during content/design workflows.
- `public/`: Public static assets for web/export usage.

## Documentation

Start with:

- [Documentation Index](./docs/INDEX.md)

Detailed specifications:

- [Card System](./docs/card-system.md)
- [Pack Rotation Rules](./docs/pack-rotation.md)
- [Battle System](./docs/battle-system.md)
- [Economy and Marketplace](./docs/economy-marketplace.md)
- [Progression and Enigmas](./docs/progression-and-enigmas.md)
- [MusicTree View](./docs/musictree.md)
- [Missions and Challenges](./docs/missions-and-challenges.md)
- [AI Card Generation and Asset Storage](./docs/ai-card-generation.md)

Reference material:

- [Glossary](./docs/glossary.md)
- [Decisions](./docs/decisions.md)
- [Open Questions](./docs/open-questions.md)
- [Genres](./docs/genres.md)

## Contributing

- Create a dedicated feature branch.
- Keep commits focused and concise.
- Run `npm run lint` before opening a PR.
- Update docs when changing gameplay rules or data models.

## External Link

- [grow.themusictree.org](https://grow.themusictree.org)
