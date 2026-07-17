# Architecture

## What this repo is

`@coreuix/ui` is a shared, publishable React component library:

- **shadcn/ui**-style components (generated via `shadcn add`, then relocated into a category
  structure — see [folder-structure.md](./folder-structure.md)).
- **Tailwind CSS** for utility classes.
- A custom **token-based theme system** (`src/theme/`) that is independent of Tailwind's own
  config and works for both React components and raw CSS.

There is no monorepo wrapper and no consumer app in this repo. It is built and shipped via
`dist/` (ESM + CJS + `.d.ts` + `styles.css`), installed by other projects as a tarball, git
dependency, or registry package.

## Three pillars, one entry point

`src/index.ts` is the sole public entry point (`@coreuix/ui`) and re-exports exactly three
things:

1. **Components** (`src/components`) — the UI primitives and layout components.
2. **Theme** (`src/theme`) — the token/CSS-variable system and its React bindings.
3. **Utils** (`src/utils`) — small framework-agnostic helpers components/theme are built on.

Nothing is imported from deeper internal paths by consumers; everything flows through this one
barrel.

## The theme pipeline (core architectural spine)

This is the piece most other decisions in the repo hang off of. Full pipeline, in order:

```
tokens/*.ts  ─▶  core/defaultTheme.ts  ─▶  core/createTheme(overrides)
                                                    │
                                          core/mergeTheme(default, overrides)
                                       (deep merge via src/utils/deepMerge)
                                                    │
                                            CoreUIXTheme (merged)
                                          ╱                        ╲
                          ThemeContext.Provider          utils/runtimeUpdate.applyRuntimeThemeUpdate
                          (consumed via useTheme())                 │
                                                          utils/normalize.normalizeTheme
                                                          (expand #fff → #ffffff)
                                                                     │
                                                utils/generateCssVariables
                                                (flatten nested theme → --cuix-* map)
                                                                     │
                                                     utils/applyTheme
                                                (write onto document.documentElement)
```

- **Build the theme**: `createTheme(overrides)` deep-merges a consumer's
  `DeepPartial<CoreUIXTheme>` onto `defaultTheme` (assembled from `theme/tokens/*.ts`).
- **React consumers**: `ThemeProvider` builds the merged theme once (`useMemo`), provides it via
  `ThemeContext`, and any component reads it with `useTheme()`.
- **CSS consumers**: the same `ThemeProvider`, in a `useEffect`, pushes the merged theme onto
  `document.documentElement` as `--cuix-*` custom properties, so plain CSS (`var(--cuix-colors-primary)`)
  and Tailwind's semantic classes (mapped in `tailwind.config.ts`) stay in sync with whatever
  React sees.

Both paths derive from the _same_ merged theme object, so there is exactly one source of truth
per render.

## Where components fit relative to the theme

Components consume theme values one of two ways:

- **Preferred pattern**: literal Tailwind arbitrary-value classes bound directly to `--cuix-*`
  vars, e.g. `bg-[var(--cuix-colors-primary)]`. This stays in sync with runtime theme overrides
  automatically. Every current `primitives/` component (`button`, `badge`, `input`, `label`,
  `textarea`, `toggle`, `checkbox`, `text`, `tabs`, `select`, `command`, `popover`,
  `multi-select`) and `layout/card`/`layout/table` (including their sub-parts) follows this
  pattern now.
- **Legacy pattern**: bare Tailwind semantic classes (`bg-primary`, `text-foreground`,
  `text-muted-foreground`) that `tailwind.config.ts` maps onto the same `--cuix-*` variables.
  Functionally equivalent at the CSS-variable layer, but bypasses `useTheme()` for any component
  logic that needs the value in JS. This still shows up in a few sub-parts of the
  `layout/sidebar` family — `sheet.tsx`, `tooltip.tsx`, and `skeleton.tsx`.

New components should default to the `--cuix-*`-var-driven pattern.

## Build & release flow

The build script is a single gated pipeline (`package.json`'s `"build"` script):

```
pnpm build
   │
   ├─ eslint .        lints the whole repo first — any lint error (banned import path, missing
   │                  return type, missing variable type annotation, unformatted file) fails the
   │                  build before compilation runs
   ├─ tsup            src/index.ts → dist/index.js (ESM), dist/index.cjs (CJS), dist/index.d.ts
   └─ tailwindcss      src/styles.css → dist/styles.css (minified)
```

`dist/` is **gitignored**, not committed — it's a local build artifact only. There is no CI and
no npm-registry publish workflow yet, so there is currently no working install path (git
dependency, tarball, or registry) for consumers: a fresh clone has no `dist/` until someone runs
`pnpm build` locally.

`package.json`'s `"prepare": "husky && npm run build"` script means `pnpm install` **does**
install the Husky pre-commit hook and run a full `pnpm build` automatically (unlike a typical
library where install is side-effect-free) — this is a deliberate departure from "no lifecycle
scripts," not an oversight. See [security.md](./security.md) for the supply-chain implications
and [CLAUDE.md](../CLAUDE.md) for the exact release steps (bump `version`, run `pnpm build`).

## Consumer integration surface

A consuming app typically:

1. Imports components/hooks from `@coreuix/ui`.
2. Imports `@coreuix/ui/styles.css` once, globally.
3. Optionally imports `@coreuix/ui/tailwind.config` as a Tailwind preset to reuse the same
   design tokens in its own custom components (note: Tailwind ignores `content` on a preset, so
   the consumer must declare its own `content` globs).
4. Optionally wraps its tree in `<ThemeProvider theme={...}>` to override tokens at runtime.
