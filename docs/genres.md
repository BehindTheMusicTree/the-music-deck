# Genres

Defines the 10 genre archetypes, their visual identity, gameplay role, and synergy logic.

## Scope

This document covers:

- genre list with colors and archetypes
- gameplay identity per genre
- synergy rules

## Genre Archetypes

Each genre has a dominant color used for card frames and UI, and a gameplay archetype that defines how it behaves in battles.

### 1. Rock / Metal

- **Couleur dominante** : Bleu acier (`#4a6e8a`)
- **Archétype** : Guerriers, brutes, tanks
- **Description** : Spécialistes de la puissance brute et de la résistance, ils boostent les alliés du même genre. Leur force vient du collectif et de la rage scénique.

### 2. Reggae / Dub

- **Couleur dominante** : Vert sauge (`#4a7a52`)
- **Archétype** : Mages soigneurs, chamans nature
- **Description** : Maîtres de la guérison et de la réduction des malus, ils protègent et soignent à base de vibes naturelles. Attribut : Nature, harmonie.

### 3. Jazz (Vintage)

- **Couleur dominante** : Ocre chaud (`#8a7028`)
- **Archétype** : Virtuoses, improvisateurs, manipulateurs de tempo
- **Description** : Experts en improvisation, ils gagnent en puissance au fil des rounds et manipulent le rythme du jeu.

### 4. World

- **Couleur dominante** : Terre cuite (`#8a3820`)
- **Archétype** : Voyageurs, adaptatifs, bonus multiculturels
- **Description** : Bénéficient de la diversité : plus il y a de genres différents dans le lineup, plus ils sont puissants. Adaptabilité et ouverture.

### 5. Classique

- **Couleur dominante** : Bois brun (`#5c2a0a`)
- **Archétype** : Invocateurs, deïtiques, effets uniques puissants
- **Description** : Cartes à effet unique, invocation de puissances supérieures, bonus de stack, mais non cumulables entre elles.

### 6. Electronic

- **Couleur dominante** : Acier gris (`#506070`)
- **Archétype** : Ingénieurs, accumulateurs, générateurs de ressources
- **Description** : Génèrent des bonus de stack chaque round, accumulent des ressources sur la durée.

### 7. Country

- **Couleur dominante** : Sienne brûlée (`#7a4e20`)
- **Archétype** : Survivants, immunisés, robustes
- **Description** : Immunité temporaire aux malus, très résistants en début de partie.

### 8. Disco / Funk

- **Couleur dominante** : Mauve poussiéreux (`#6a3878`)
- **Archétype** : Boosters collectifs, ambianceurs
- **Description** : Plus il y a de stacks actifs dans le lineup, plus tout le monde est boosté. Synergie de groupe.

### 9. Hip-Hop

- **Couleur dominante** : Or antique (`#7a5e18`)
- **Archétype** : Leaders, solistes, "gangs"
- **Description** : Fonctionnent en solo ou en groupe : bonus si seul dans le lineup, mais aussi synergies de "crew". Immunité aux debuffs en solo.

### 10. Pop

- **Couleur dominante** : Blanc perle (`#989098`)
- **Archétype** : Universels, diffuseurs, connecteurs
- **Description** : Partagent leurs bonus avec les cartes adjacentes. Grande accessibilité et popularité.

## Synergy Logic

Genres interact in battles like type matchups (see [Battle System](./battle-system.md)):

- some genres are strong against others
- some genres are weak against others
- World cards gain power proportional to the number of distinct genres in the lineup
- Classique effects are unique and non-stackable with other Classique cards
- Disco / Funk effects scale with the total number of active stacks
- Hip-Hop cards gain solo immunity to debuffs when they are the only card of their genre in the lineup

## See Also

- [Card System](./card-system.md)
- [Battle System](./battle-system.md)
- [Glossary](./glossary.md)
- [Documentation Index](./INDEX.md)
