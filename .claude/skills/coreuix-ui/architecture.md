# Architecture

## The barrel-export chain

Every component lives in its own folder with a local barrel, aggregated upward
through exactly three levels:

```
src/components/<category>/<name>/<name>.tsx     e.g. primitives/button/button.tsx
src/components/<category>/<name>/index.ts       -> export * from "@components/<category>/<name>/<name>"
src/components/<category>/index.ts              -> aggregates every component barrel in that category
src/components/index.ts                         -> aggregates every category barrel
src/index.ts                                    -> public package API (components + theme + utils)
```

Every barrel uses the full category-scoped alias to import its own sibling file —
never a relative `"./<name>"`. The `no-restricted-imports` ESLint rule bans
relative imports (and the bare `@/*` catch-all) repo-wide, with no exception for a
barrel referencing a file in the same folder; e.g.
`src/components/primitives/button/index.ts` is
`export * from "@components/primitives/button/button";`.

`src/components/index.ts` is the **only** file that changes when a whole new
category is introduced; every other barrel only changes when a component is
added/removed within its own folder or category.

`src/index.ts` re-exports exactly three things, nothing deeper:

```ts
export * from "@utils/index";
export * from "@components/index";
export * from "@theme/index";
```

Consumers only ever import from the package root (`@coreuix/ui`) — no internal path
is part of the public API.

## The theme token pipeline

This is the architectural spine most component styling decisions hang off of.

```
tokens/*.ts  ->  core/defaultTheme.ts  ->  core/createTheme(overrides)
                                                  |
                                        core/mergeTheme(default, overrides)   (deep merge via src/utils/deepMerge)
                                                  |
                                          CoreUIXTheme (merged)
                                        /                        \
                        ThemeContext.Provider          utils/runtimeUpdate.applyRuntimeThemeUpdate
                        (consumed via useTheme())                |
                                                       utils/normalize.normalizeTheme  (expand #fff -> #ffffff)
                                                                  |
                                              utils/generateCssVariables  (flatten nested theme -> --cuix-* map)
                                                                  |
                                                       utils/applyTheme  (write onto document.documentElement)
```

Step by step:

1. **`theme/tokens/*.ts`** — one file per theme section (`colorsTokens.ts`,
   `radiusTokens.ts`, `spacingTokens.ts`, `shadowsTokens.ts`, `typographyTokens.ts`,
   `breakpointsTokens.ts`, `flexTokens.ts`, `zIndexTokens.ts`, `widthTokens.ts`,
   `heightTokens.ts`, `sidebarTokens.ts`), each exporting the default values for
   that section, typed against the matching slice of `CoreUIXTheme`.
2. **`core/defaultTheme.ts`** assembles all token modules into one complete
   `CoreUIXTheme` object.
3. **`core/createTheme(overrides)`** is the public entry point: it calls
   **`core/mergeTheme(defaultTheme, overrides)`**, a deep merge built on
   **`src/utils/deepMerge.ts`**, to layer a consumer's `DeepPartial<CoreUIXTheme>`
   onto the default.
4. **`ThemeProvider`** (`"use client"`) calls `createTheme(theme)` once via
   `useMemo`, provides the merged result through **`ThemeContext`** (readable via
   **`useTheme()`**), and in a `useEffect` also pushes it to the DOM:
   - **`utils/normalize.normalizeTheme`** expands shorthand hex colors (`#fff` ->
     `#ffffff`).
   - **`utils/generateCssVariables`** flattens the nested theme object and derives a
     `--cuix-*` CSS variable name for every leaf value (e.g. `colors.primary` ->
     `--cuix-colors-primary`, `typography.fontSize.sm` -> `--cuix-font-size-sm`).
     Contrary to what this doc previously claimed, this is **not** a generic
     `Object.entries` walk over arbitrary top-level keys — `flattenTheme` walks a
     hand-enumerated `FLAT_SECTIONS` list (`colors`, `radius`, `spacing`, `shadow`,
     `zIndex`, `breakpoints`, `width`, `height`, `sidebar`) plus a separate
     `TYPOGRAPHY_SECTIONS` list for `typography`'s nested sub-sections, each with a
     matching `SECTION_CSS_PREFIX`/`TYPOGRAPHY_CSS_PREFIX` entry. `flex` is
     deliberately listed in `EXCLUDED_SECTIONS` instead — its tokens are pre-composed
     Tailwind class strings, not CSS values, so they aren't meaningful as `var()`
     targets and are only consumed via `useTheme()` in variant files. `flattenTheme`
     throws at runtime if any top-level `CoreUIXTheme` key isn't accounted for in one
     of these three lists, so a new top-level section can't silently fall through the
     way `flex` once did. **Adding a key within an already-listed section** (e.g. a
     new `colors.*` token) needs no change here — `Object.entries(theme[section])`
     picks it up automatically. **Adding a whole new top-level section** does require
     hand-adding it to `FLAT_SECTIONS`/`SECTION_CSS_PREFIX` (or `EXCLUDED_SECTIONS` if
     it's not meaningful as a CSS variable, like `flex`).
   - **`utils/applyTheme`** writes that variable map onto
     `document.documentElement.style`.
5. Both consumption paths — React (`useTheme()`) and CSS (`var(--cuix-colors-primary)`
   / Tailwind semantic classes mapped in `tailwind.config.ts`) — derive from the
   _same_ merged theme object, so there's exactly one source of truth per render.

### Adding a new token

Add the key to `theme/models/Theme.ts` and a default value in the matching
`theme/tokens/*.ts` file. If the key belongs to a section already listed in
`generateCssVariables.ts`'s `FLAT_SECTIONS`/`TYPOGRAPHY_SECTIONS` (true for every
existing section except `flex`), nothing else needs to change for the JS/React
side — it's picked up automatically. (Adding a whole new top-level section, not
just a new key within one, does require hand-editing `generateCssVariables.ts` —
see above.) In practice this repo also keeps two other files in sync by hand:

- `src/styles.css` — the static `:root`/`.dark` variable values used before
  `ThemeProvider`'s `useEffect` has run (first paint / non-React consumers).
- `tailwind.config.ts` — only needed if the token should also be usable as a plain
  Tailwind utility class (e.g. `text-xs`) rather than only via the arbitrary-value
  syntax (`text-[var(--cuix-font-size-xs)]`).

### Two styling patterns components use

- **Preferred**: literal Tailwind arbitrary-value classes bound directly to
  `--cuix-*` vars (e.g. `bg-[var(--cuix-colors-primary)]`). Every component in this
  repo currently uses this pattern. Stays in sync with runtime `ThemeProvider`
  overrides automatically, including for component logic that reads the value via
  `useTheme()` in JS.
- **Bare Tailwind semantic classes** (`bg-card`, `text-muted-foreground`) —
  `tailwind.config.ts` maps these names onto the same `--cuix-*` variables, so
  they're functionally equivalent at the CSS layer, but bypass `useTheme()` for any
  component logic that needs the value in JS rather than just CSS. Avoid for new
  components.

## Build & release flow

```
pnpm build
   |
   +- eslint .       lints the whole repo first — any error (banned import path,
   |                  missing type annotation, unformatted file) fails the build
   |                  before tsup/tailwindcss ever run
   +- tsup          src/index.ts -> dist/index.js (ESM), dist/index.cjs (CJS), dist/index.d.ts / .d.cts
   +- tailwindcss    src/styles.css -> dist/styles.css (minified, via tailwind.config.ts)
```

`package.json`'s `"build"` script is literally `"eslint . && tsup && tailwindcss -i
src/styles.css -o dist/styles.css --config tailwind.config.ts --minify"` — lint is
a hard gate, not a separate concern from compilation.

`dist/` is listed in `.gitignore` and has zero files tracked in git (verify with
`git ls-files dist` if in doubt). `package.json`'s `"files"` field includes `dist`
and `tailwind.config.ts`, so `npm pack`/`npm publish` bundle the freshly built
output into the tarball straight off disk regardless of git tracking — run
`pnpm build` before packing/publishing. `package.json`'s `"prepare": "husky && npm
run build"` script also means `pnpm install` runs a full build (and installs the
Husky hook) as a side effect in this repo.

## Consumer integration surface

A project depending on `@coreuix/ui` typically:

1. Imports components/hooks from the package root.
2. Imports `@coreuix/ui/styles.css` once, globally.
3. Optionally imports `@coreuix/ui/tailwind.config` as a Tailwind preset to reuse the
   same design tokens in its own custom components — Tailwind ignores a preset's
   `content` field, so the consumer must declare its own `content` globs.
4. Optionally wraps its tree in `<ThemeProvider theme={...}>` to override tokens at
   runtime with a `DeepPartial<CoreUIXTheme>`.
