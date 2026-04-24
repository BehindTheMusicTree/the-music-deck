# Charte Graphique — The Music Deck

Visual identity reference for UI, card frames, and genre theming.

---

## Palette de base

Couleurs globales de l'interface (variables CSS `:root`).

| Token        | Hex       | Usage                              |
| ------------ | --------- | ---------------------------------- |
| `--bg`       | `#09080d` | Fond principal (near-black violet) |
| `--surface`  | `#100f18` | Surfaces secondaires               |
| `--card`     | `#16141f` | Fond de carte                      |
| `--border`   | `#1e1c2c` | Bordures UI génériques             |
| `--gold`     | `#a87c28` | Accent principal, boutons, labels  |
| `--gold-hi`  | `#c8a040` | Highlight or                       |
| `--rust`     | `#7a3020` | Accent secondaire chaud            |
| `--white`    | `#d8d4f0` | Texte principal                    |
| `--muted`    | `#6a6480` | Texte secondaire, placeholders     |
| `--dim`      | `#28263a` | Séparateurs, zones inactives       |

---

## Typographie

| Famille              | Usage                                      |
| -------------------- | ------------------------------------------ |
| `Cinzel`             | Titres, labels genre, navigation, boutons  |
| `Cormorant Garamond` | Corps de texte, descriptions de cartes     |
| `Space Mono`         | Données chiffrées, codes, tags techniques  |

---

## Thèmes genre

Chaque genre définit un jeu de variables CSS appliqué sur la classe `.g-<genre>`. Ces variables colorent bordures, fonds de carte, textes et barres de stats.

### Variables par genre

| Genre       | Classe      | Couleur dominante          | Hex bordure |
| ----------- | ----------- | -------------------------- | ----------- |
| Rock        | `.g-rock`   | Rouge clinquant            | `#d01828`   |
| Metal       | `.g-metal`  | Rouge sombre (ss-genre Rock)| `#7a0810`  |
| Reggae/Dub  | `.g-reggae` | Vert gazon                 | `#3a9030`   |
| Vintage     | `.g-vintage`| Gris                       | `#787878`   |
| World       | `.g-world`  | Rouge                      | `#a01818`   |
| Classical   | `.g-classic`| Brun bois                  | `#5c2a0a`   |
| Electronic  | `.g-electro`| Bleu roi                   | `#2850c8`   |
| Country     | `.g-country`| Brun sienna                | `#7a4e20`   |
| Disco/Funk  | `.g-funk`   | Rose chaud                 | `#c0387a`   |
| Hip-hop     | `.g-hiphop` | Or antique                 | `#c8960a`   |
| Pop         | `.g-pop`    | Blanc cassé                | `#c0b8d0`   |

### Variables CSS par thème genre

Chaque classe `.g-*` expose :

| Variable          | Rôle                          |
| ----------------- | ----------------------------- |
| `--border-color`  | Bordure et accent de la carte |
| `--card-bg`       | Fond sombre de la carte       |
| `--header-bg`     | Fond de l'en-tête de carte    |
| `--text-main`     | Texte principal               |
| `--text-body`     | Texte secondaire              |
| `--bar-pop`       | Gradient barre Popularité     |
| `--bar-exp`       | Gradient barre Expérience     |
| `--bar-glow-pop`  | Lueur barre Popularité        |
| `--bar-glow-exp`  | Lueur barre Expérience        |

---

## Système de couleurs des sous-genres

Les sous-genres héritent de la couleur de leur genre parent. Lorsqu'un sous-genre se situe à l'intersection de deux genres, sa couleur mélange les deux teintes proportionnellement à sa distance thématique.

**Principe :** `couleur ss-genre = parent_dominant + (influence second genre)`

### Exemples définis

| Sous-genre         | Parents           | Couleur résultante                                      |
| ------------------ | ----------------- | ------------------------------------------------------- |
| Metal              | Rock              | Bleu marine (`#1a2e6a`) — variation foncée du rouge rock|
| Dub (ss-genres)    | Reggae + Electro  | Turquoise (`~#20a898`) — vert gazon + bleu roi électro  |
| Reggae (ss-genres) | Reggae            | Vert pomme (`~#78d828`) — vert gazon plus lumineux      |
| Funk Metal         | Rock + Funk       | Indigo (`~#8020a0`) — rouge rock tirant au rose funk    |
| Pop Rap            | Hip-hop + Pop     | Jaune très clair (`~#f0e890`) — or hip-hop pastel       |

> Ce tableau s'enrichit au fur et à mesure que les sous-genres sont définis.

---

## Raretés

Les raretés utilisent des couleurs d'accent fixes, indépendantes du genre.

| Rareté    | Couleur texte | Hex      |
| --------- | ------------- | -------- |
| Legendary | Or            | `#c8a040`|
| Epic      | Violet        | `#a070e0`|
| Rare      | Bleu ciel     | `#6090e0`|
| Common    | Gris          | `#8888a0`|

---

## See Also

- [Genres](./genres.md)
- [Card System](./card-system.md)
- [Documentation Index](./INDEX.md)
