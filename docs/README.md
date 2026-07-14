# CoreUIX Documentation

`@coreuix/ui` is a standalone, publishable shared component library (shadcn/ui + Tailwind + a
custom token-based theme system), shipped as a built `dist/` for other projects to install.
There is no monorepo wrapper and no consumer app in this repo.

## Contents

| Doc                                              | Covers                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| [architecture.md](./architecture.md)             | High-level system design, the theme data-flow pipeline, build/release flow |
| [folder-structure.md](./folder-structure.md)     | Directory layout and what lives where                                      |
| [system-patterns.md](./system-patterns.md)       | Recurring design patterns used across the codebase                         |
| [api-patterns.md](./api-patterns.md)             | Component API conventions (props, variants, `asChild`, exports)            |
| [utilities.md](./utilities.md)                   | The shared helpers in `src/utils/`                                         |
| [security.md](./security.md)                     | Security posture: dependencies, build/publish, runtime DOM writes          |
| [modules/components.md](./modules/components.md) | `src/components/` — primitives and layout components                       |
| [modules/theme.md](./modules/theme.md)           | `src/theme/` — the token-driven theme system                               |
| [modules/utils.md](./modules/utils.md)           | `src/utils/` — shared helpers, module by module                            |

## Quick orientation

```
tokens (src/theme/tokens) → defaultTheme → createTheme(overrides) → CoreUIXTheme
                                                                    ↙            ↘
                                                    ThemeContext (React)   --cuix-* CSS variables (DOM)
                                                            ↓                        ↓
                                                       useTheme()          plain CSS (var(--cuix-colors-primary))
```

Components (`src/components/`) consume the theme either via `--cuix-*` CSS variables
(preferred, e.g. `button`) or via bare Tailwind semantic classes that map to the same
variables through `tailwind.config.ts` (older pattern, e.g. `card`).

See [CLAUDE.md](../CLAUDE.md) in the repo root for day-to-day commands (build, lint, adding a
shadcn component, releasing). This `docs/` folder is the deeper reference; CLAUDE.md stays
short and task-oriented.

## Note on `.gitignore`

This repo's `.gitignore` currently has a blanket `*.md` rule, so newly created files under
`docs/` (like this one) are **not tracked by git** yet — the same is true of the existing
`README.md`, `CLAUDE.md`, and `COMMANDS.md`. If you want `docs/` version-controlled, either
add `!docs/**` to `.gitignore` or `git add -f` these files.
