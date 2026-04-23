# Contributing

This project is in early active development by a solo developer. Contributions, suggestions, and feedback are welcome.

## Table of Contents

- [Development Workflow](#development-workflow)
  - [Setup](#setup)
  - [Branching](#branching)
  - [Committing](#committing)
  - [Pull Requests](#pull-requests)
- [Changelog](#changelog)
- [Code Style](#code-style)
- [License](#license)

## Development Workflow

### Setup

**Prerequisites:** Node.js 20+, npm, Git.

```bash
git clone https://github.com/mignot/the-music-deck.git
cd the-music-deck
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Branching

We follow Git Flow:

| Branch | Purpose |
|---|---|
| `main` | Production-ready, stable |
| `develop` | Integration branch — all features merge here |
| `feature/<name>` | New features, branch from `develop` |
| `fix/<name>` | Bug fixes, branch from `develop` |
| `hotfix/<name>` | Urgent production fixes, branch from `main` |
| `chore/<name>` | Maintenance, CI, dependencies |

No direct commits to `main` or `develop`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
```

### Committing

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <summary>
```

| Type | Use for |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `chore` | Maintenance / dependencies |
| `refactor` | Code restructuring |
| `style` | Formatting only |
| `perf` | Performance |
| `ci` | CI/CD changes |

**Examples:**
- `feat(battle): add card combo system`
- `fix(pack): correct booster opening animation`
- `docs(genres): update subgenre colour rules`
- `chore: update dependencies`

Rules: imperative mood, under 70 characters, lowercase type and scope.

### Pull Requests

1. Ensure your branch is up to date with `develop`
2. Run `npm run build` and `npm run lint` — both must pass
3. Update `CHANGELOG.md` under `[Unreleased]`
4. Open a PR targeting `develop` (or `main` for hotfixes)
5. Use the same `type(scope): summary` format for the PR title

**Pre-PR checklist:**
- [ ] No console.log or debug code
- [ ] No accidental commits (`.env`, large binaries, personal configs)
- [ ] `CHANGELOG.md` updated
- [ ] Branch targets the correct base (`develop` for features/fixes/chores)

## Changelog

Update `CHANGELOG.md` with every PR. Add entries to the `[Unreleased]` section under the appropriate category. Be descriptive and user-focused — avoid dumping raw git logs.

See [CHANGELOG.md](CHANGELOG.md) for format examples.

## Code Style

- **TypeScript** — strict types, no `any`
- **Components** — functional, no class components
- **CSS** — genre themes via `.g-*` classes in `app/globals.css`; `globals.css` is the source of truth for all design tokens
- **No comments** unless the *why* is non-obvious
- **No dead code** — remove unused variables, imports, and components

## License

All contributions are made under the project's license. You retain authorship of your code.
