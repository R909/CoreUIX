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
│   │   │   │   ├── button.tsx
│   │   │   │   ├── button.types.ts
│   │   │   │   ├── button.variants.ts
│   │   │   │   └── index.ts         # export * from "@components/primitives/button/button"
│   │   │   ├── badge/
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── badge.types.ts
│   │   │   │   ├── badge.variants.ts
│   │   │   │   └── index.ts
│   │   │   ├── input/
│   │   │   │   ├── input.tsx
│   │   │   │   ├── input.types.ts
│   │   │   │   ├── input.variants.ts
│   │   │   │   └── index.ts
│   │   │   ├── label/
│   │   │   │   ├── label.tsx
│   │   │   │   ├── label.types.ts
│   │   │   │   ├── label.variants.ts
│   │   │   │   └── index.ts
│   │   │   └── textarea/
│   │   │       ├── textarea.tsx
│   │   │       ├── textarea.types.ts
│   │   │       ├── textarea.variants.ts
│   │   │       └── index.ts
│   │   └── layout/                  # Structural components
│   │       ├── index.ts
│   │       ├── card/
│   │       │   ├── card.tsx         # Card + 5 sub-parts (Header/Title/Description/Content/Footer)
│   │       │   ├── card.types.ts
│   │       │   ├── card.variants.ts
│   │       │   └── index.ts
│   │       └── sidebar/             # Large family: SidebarProvider, Sidebar, SidebarTrigger,
│   │           │                    # SidebarRail/Inset/Input, Header/Footer/Separator/Content,
│   │           │                    # SidebarGroup*, SidebarMenu* family, useSidebar
│   │           ├── sidebar.tsx
│   │           ├── sidebar.types.ts
│   │           ├── sidebar.variants.ts
│   │           ├── sidebar-constant.ts   # SIDEBAR_WIDTH, SIDEBAR_COOKIE_NAME, etc.
│   │           ├── separator.tsx
│   │           ├── sheet.tsx
│   │           ├── skeleton.tsx
│   │           ├── tooltip.tsx
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
│   │   │   ├── widthTokens.ts
│   │   │   ├── heightTokens.ts
│   │   │   ├── sidebarTokens.ts
│   │   │   ├── flexTokens.ts        # Pre-composed Tailwind class strings, not CSS values
│   │   │   ├── zIndexTokens.ts
│   │   │   └── index.ts
│   │   └── utils/                   # Runtime theme → CSS pipeline
│   │       ├── normalize.ts         # normalizeTheme: expand shorthand hex, etc.
│   │       ├── generateCssVariables.ts  # Flatten theme object → { "--cuix-*": value } map
│   │       ├── applyTheme.ts        # Write that map onto document.documentElement
│   │       ├── runtimeUpdate.ts     # applyRuntimeThemeUpdate = normalize → generate → apply
│   │       └── index.ts
│   │
│   ├── hooks/                        # Small React hooks, imported via @hooks/*
│   │   └── use-mobile.tsx            # useIsMobile()
│   │
│   └── utils/                       # Small shared, framework-agnostic helpers
│       ├── cn.ts                    # clsx + tailwind-merge class combiner
│       ├── deepMerge.ts             # Recursive plain-object merge (theme system's foundation)
│       ├── createVariants.ts        # Thin re-export of cva
│       └── index.ts
│
├── dist/                            # Built output (ESM/CJS/.d.ts/styles.css) — gitignored, local only
├── docs/                            # You are here
├── components.json                  # shadcn CLI config; its `aliases` block mirrors the real
│                                     # tsconfig path mappings below
├── tailwind.config.ts                # Design-token-mapped Tailwind config; also published as a preset
├── tsconfig.json                    # Real path aliases: @components/*, @theme/*, @utils/*, @hooks/*
│                                     # (plus an unused-by-convention @/* catch-all)
├── tsconfig.build.json               # Extends tsconfig.json for tsup's build-time type generation
├── tsup.config.ts                   # Build config for dist/ (ESM + CJS + .d.ts)
├── eslint.config.js                  # Also gates `pnpm build` (build script runs `eslint .` first)
├── .prettierrc.json                  # Explicit Prettier config (semi, double quotes, printWidth 80, ...)
├── .prettierignore                   # dist, pnpm-lock.yaml, pnpm-workspace.yaml
├── CLAUDE.md                         # Agent-facing instructions: commands, conventions, releasing
├── COMMANDS.md
└── README.md
```

## The barrel-export chain

Every component lives in its own folder with a local barrel, and barrels aggregate upward
through exactly three levels:

```
src/components/<category>/<name>/<name>.tsx   e.g. primitives/button/button.tsx
src/components/<category>/<name>/index.ts     → export * from "@components/<category>/<name>/<name>"
src/components/<category>/index.ts            → aggregates every component barrel in that category
src/components/index.ts                       → aggregates every category barrel (only file touched
                                                  when adding a whole new category)
src/index.ts                                  → public package API
```

Current categories: `primitives/` (button, badge, input, label, textarea — atoms with no
internal composition) and `layout/` (card, and the larger `sidebar/` family — structural
components). `form/` (react-hook-form-aware composites) hasn't been started yet. New categories
(`overlay/`, `form/`, `feedback/`, ...) are added only once a component that fits arrives —
empty categories are not pre-created.

## Naming conventions inside a component folder

| File                 | Purpose                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| `<name>.tsx`         | The component implementation                                                         |
| `<name>.types.ts`    | Prop types (`React.ComponentProps<...> & VariantProps<...> & { asChild?: boolean }`) |
| `<name>.variants.ts` | `cva` variant definitions                                                            |
| `index.ts`           | Local barrel: re-exports the component itself                                        |

Every current component folder (`button`, `badge`, `input`, `label`, `textarea`, `card`,
`sidebar`) follows the `.tsx` / `.types.ts` / `.variants.ts` split — `card` has been migrated
onto it too, so there is no longer a single-file exception. Each component's local `index.ts`
barrel currently re-exports only the component module itself (`sidebar/index.ts` is the
exception, since `sidebar.tsx`, `sidebar.variants.ts`, `sidebar.types.ts`, and
`sidebar-constant.ts` are separate public exports of that one component family) — check the
target folder's `index.ts` before assuming a variant map or types file is reachable through the
barrel.

## Path alias

`tsconfig.json` defines real path mappings: `@components/*` → `src/components/*`, `@theme/*` →
`src/theme/*`, `@utils/*` → `src/utils/*`, `@hooks/*` → `src/hooks/*`. Every barrel and component
in the codebase imports through these category-scoped aliases, not through relative paths.
`components.json`'s `aliases` block mirrors the same paths for the shadcn CLI to use when
scaffolding new files. A catch-all `@/*` → `src/*` mapping also exists in `tsconfig.json` but
isn't used by convention — and it, along with any relative import (`./`, `../`), is now actively
banned by an ESLint `no-restricted-imports` rule (see [system-patterns.md](./system-patterns.md)).
