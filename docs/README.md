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

Components (`src/components/`) consume the theme via `--cuix-*` CSS variables — every current
`primitives/` component (`button`, `badge`, `input`, `label`, `textarea`, `toggle`, `checkbox`,
`text`, `tabs`, `select`, `command`, `popover`, `multi-select`) and `layout/card`/`layout/table`
follows this pattern. A few sub-parts of the `layout/sidebar` family (`sheet`, `tooltip`,
`skeleton`) still use bare Tailwind semantic classes (`bg-primary`, `text-muted-foreground`) that
map to the same variables through `tailwind.config.ts` — see [architecture.md](./architecture.md)
for which pattern is preferred for new components.

See [CLAUDE.md](../CLAUDE.md) in the repo root for day-to-day commands (build, lint, adding a
shadcn component, releasing). This `docs/` folder is the deeper reference; CLAUDE.md stays
short and task-oriented.

## Note on `.gitignore`

`.gitignore` does **not** have a blanket `*.md` rule — `docs/README.md`, the rest of `docs/`,
`README.md`, `CLAUDE.md`, and `COMMANDS.md` are all tracked in git today (verify with
`git ls-files | grep '\.md$'`). Markdown files are treated like any other source file: commit
them normally.
