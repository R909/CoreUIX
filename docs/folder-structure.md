# Folder Structure

```
CoreUIX/
├── src/
│   ├── index.ts                     # Public package entry point (re-exports components, theme, utils)
│   ├── styles.css                   # @tailwind directives + :root/.dark --cuix-* variable values
│   │
│   ├── components/
│   │   ├── index.ts                 # Aggregates every category barrel
│   │   ├── primitives/              # Atoms with no internal composition
│   │   │   ├── index.ts             # Aggregates every component barrel in this category
│   │   │   ├── button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   ├── button.variants.ts
│   │   │   │   └── index.ts         # export * from "./Button" / "./button.variants" / "./Button.types"
│   │   │   └── badge/
│   │   │       ├── badge.tsx
│   │   │       ├── badge.types.ts
│   │   │       ├── badge.variants.ts
│   │   │       └── index.ts
│   │   └── layout/                  # Structural components
│   │       ├── index.ts
│   │       └── card/
│   │           ├── card.tsx         # Single-file: Card + sub-parts (predates the variants/types split)
│   │           └── index.ts
│   │
│   ├── theme/                       # Token-driven theme system (see modules/theme.md)
│   │   ├── index.ts                 # Public barrel for the whole theme system
│   │   ├── README.md                # Original, detailed theme system writeup
│   │   ├── ThemeContext.tsx         # React context, defaults to defaultTheme
│   │   ├── ThemeProvider.tsx        # "use client"; builds + provides + applies the theme
│   │   ├── useTheme.ts              # Hook: reads ThemeContext
│   │   ├── core/
│   │   │   ├── defaultTheme.ts      # Assembles tokens/* into the full default CoreUIXTheme
│   │   │   ├── mergeTheme.ts        # Deep-merge override onto base (built on utils/deepMerge)
│   │   │   ├── createTheme.ts       # Public entry point: mergeTheme(defaultTheme, override)
│   │   │   └── index.ts
│   │   ├── models/
│   │   │   ├── Theme.ts             # CoreUIXTheme interface — the canonical theme shape
│   │   │   ├── DeepPartial.ts       # Recursive partial type for override props
│   │   │   └── index.ts
│   │   ├── tokens/                  # One file per theme section; each is a default value set
│   │   │   ├── colorsTokens.ts
│   │   │   ├── radiusTokens.ts
│   │   │   ├── spacingTokens.ts
│   │   │   ├── shadowsTokens.ts
│   │   │   ├── typographyTokens.ts
│   │   │   ├── breakpointsTokens.ts
│   │   │   ├── flexTokens.ts
│   │   │   ├── zIndexTokens.ts
│   │   │   └── index.ts
│   │   └── utils/                   # Runtime theme → CSS pipeline
│   │       ├── normalize.ts         # normalizeTheme: expand shorthand hex, etc.
│   │       ├── generateCssVariables.ts  # Flatten theme object → { "--cuix-*": value } map
│   │       ├── applyTheme.ts        # Write that map onto document.documentElement
│   │       ├── runtimeUpdate.ts     # applyRuntimeThemeUpdate = normalize → generate → apply
│   │       └── index.ts
│   │
│   └── utils/                       # Small shared, framework-agnostic helpers
│       ├── cn.ts                    # clsx + tailwind-merge class combiner
│       ├── deepMerge.ts             # Recursive plain-object merge (theme system's foundation)
│       ├── createVariants.ts        # Thin re-export of cva
│       └── index.ts
│
├── dist/                            # Built output (ESM/CJS/.d.ts/styles.css) — committed to git
├── docs/                            # You are here
├── components.json                  # shadcn CLI config (aliases here are NOT real TS path mappings)
├── tailwind.config.ts                # Design-token-mapped Tailwind config; also published as a preset
├── tsconfig.json                    # `@/*` → `src/*` path alias, used at build time by tsup
├── tsup.config.ts                   # Build config for dist/ (ESM + CJS + .d.ts)
├── eslint.config.js
├── CLAUDE.md                         # Agent-facing instructions: commands, conventions, releasing
├── COMMANDS.md
└── README.md
```

## The barrel-export chain

Every component lives in its own folder with a local barrel, and barrels aggregate upward
through exactly three levels:

```
src/components/<category>/<name>/<name>.tsx   e.g. primitives/button/Button.tsx
src/components/<category>/<name>/index.ts     → export * from "./<name>"
src/components/<category>/index.ts            → aggregates every component barrel in that category
src/components/index.ts                       → aggregates every category barrel (only file touched
                                                  when adding a whole new category)
src/index.ts                                  → public package API
```

Current categories: `primitives/` (button, badge) and `layout/` (card). New categories
(`overlay/`, `form/`, `feedback/`, ...) are added only once a component that fits arrives —
empty categories are not pre-created.

## Naming conventions inside a component folder

| File                 | Purpose                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| `<name>.tsx`         | The component implementation                                                         |
| `<name>.types.ts`    | Prop types (`React.ComponentProps<...> & VariantProps<...> & { asChild?: boolean }`) |
| `<name>.variants.ts` | `cva` variant definitions                                                            |
| `index.ts`           | Local barrel: re-exports the component (+ variants/types where present)              |

`card/` predates this split and keeps everything in a single `card.tsx` file — new components
should follow the `button`/`badge` split instead.

## Path alias

All internal imports use `@/*` → `src/*`, defined in `tsconfig.json` and resolved at build time
by tsup. `components.json`'s `aliases` block (`@components`, `@utils`, `@hooks`, `@theme`) is
only consumed by the shadcn CLI when scaffolding new files — it does **not** resolve as a real
TypeScript path mapping, so don't rely on it in hand-written code.
