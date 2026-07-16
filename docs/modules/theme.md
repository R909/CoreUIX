# Module: Theme System (`src/theme/`)

Token-driven, framework-agnostic theming. A theme is a plain TypeScript object (`CoreUIXTheme`)
built from small token primitives, merged with user overrides, and pushed to the DOM as CSS
custom properties (`--cuix-*`). See [architecture.md](../architecture.md) for the full pipeline
diagram and [../src/theme/README.md](../../src/theme/README.md) for the original detailed writeup
this doc summarizes.

## File-by-file reference

| Path                            | Responsibility                                                                                                                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens/colorsTokens.ts`        | Light-theme color palette (background, primary/secondary/destructive + foregrounds, border/input/ring, muted/accent/popover/card, `transparent`). Dark overrides live in `src/styles.css`, not here.                  |
| `tokens/radiusTokens.ts`        | Border-radius scale (`sm`/`md`/`lg`).                                                                                                                                                                                 |
| `tokens/spacingTokens.ts`       | Spacing scale (`xs`/`sm`/`md`/`lg`/`tight`).                                                                                                                                                                          |
| `tokens/typographyTokens.ts`    | `fontFamily` (`body`/`heading`), `fontSize` (`xs`/`sm`/`md`/`lg`), `fontWeight` (`medium`/`semibold`), `letterSpacing` (`normal`/`tight`), plus flat `lineHeight`/`lineHeightTight`.                                  |
| `tokens/shadowsTokens.ts`       | Box-shadow scale (`sm`/`md`/`lg`).                                                                                                                                                                                    |
| `tokens/breakpointsTokens.ts`   | Responsive breakpoints (`sm`/`md`).                                                                                                                                                                                   |
| `tokens/flexTokens.ts`          | Ready-to-use Tailwind flex utility-class strings (not raw CSS values, unlike other token sections) — deliberately excluded from CSS-variable generation, see below.                                                   |
| `tokens/zIndexTokens.ts`        | Z-index values for modals/tooltips.                                                                                                                                                                                   |
| `tokens/widthTokens.ts`         | Width scale (`full`/`screen`/`auto`/`fit`/`min`/`max`).                                                                                                                                                               |
| `tokens/heightTokens.ts`        | Height scale (`full`/`screen`/`auto`/`fit`/`min`/`max`).                                                                                                                                                              |
| `tokens/sidebarTokens.ts`       | Sidebar-specific color palette (`background`/`foreground`/`primary`/`primaryForeground`/`accent`/`accentForeground`/`border`/`ring`), consumed by the `layout/sidebar` component.                                     |
| `tokens/index.ts`               | Barrel: aggregates every token module.                                                                                                                                                                                |
| `models/Theme.ts`               | `CoreUIXTheme` — the canonical theme shape every token section conforms to. Top-level sections: `colors`, `radius`, `spacing`, `shadow`, `zIndex`, `breakpoints`, `width`, `height`, `typography`, `flex`, `sidebar`. |
| `models/DeepPartial.ts`         | Recursive partial type, used for `ThemeProvider`'s `theme` override prop.                                                                                                                                             |
| `models/index.ts`               | Barrel for the type layer.                                                                                                                                                                                            |
| `core/defaultTheme.ts`          | Assembles `tokens/*` into one complete default `CoreUIXTheme` — a plain `{ ...tokens }` spread; every section (including `zIndex`) now comes from a `tokens/*.ts` file, none are hardcoded inline.                    |
| `core/mergeTheme.ts`            | Deep-merges a partial override onto a base theme (built on `utils/deepMerge`).                                                                                                                                        |
| `core/createTheme.ts`           | Public entry point: `mergeTheme(defaultTheme, override)`.                                                                                                                                                             |
| `core/index.ts`                 | Barrel for core.                                                                                                                                                                                                      |
| `utils/normalize.ts`            | `normalizeTheme` — currently expands 3-digit shorthand hex colors (`#fff` → `#ffffff`) on the `colors` section only.                                                                                                  |
| `utils/generateCssVariables.ts` | Flattens a nested `CoreUIXTheme` into its final `--cuix-*` CSS variable names via a hand-enumerated allowlist (see below) — **throws** at runtime if a top-level section isn't accounted for.                         |
| `utils/applyTheme.ts`           | Writes a `{ "--cuix-*": value }` map onto `document.documentElement.style`. Browser-only.                                                                                                                             |
| `utils/runtimeUpdate.ts`        | `applyRuntimeThemeUpdate` — composes normalize → generateCssVariables → applyTheme into one call.                                                                                                                     |
| `utils/index.ts`                | Barrel for the runtime pipeline.                                                                                                                                                                                      |
| `ThemeContext.tsx`              | React context; defaults to `defaultTheme` when read outside a provider.                                                                                                                                               |
| `useTheme.ts`                   | Hook that reads `ThemeContext`.                                                                                                                                                                                       |
| `ThemeProvider.tsx`             | `"use client"` component: builds the theme via `createTheme` (memoized on the `theme` prop), provides it via context, applies it to the DOM in a `useEffect`.                                                         |
| `index.ts`                      | Public barrel for the whole theme system.                                                                                                                                                                             |

## Data flow

```
tokens/*  ──▶ core.defaultTheme ──▶ core.createTheme(overrides)
                                              │
                                    core.mergeTheme(default, overrides)
                                              │
                                       CoreUIXTheme (merged)
                                     ╱                    ╲
                     ThemeContext.Provider      utils.applyRuntimeThemeUpdate
                     (React tree reads via              │
                      useTheme())               utils.normalizeTheme (hex expand)
                                                          │
                                            utils.generateCssVariables (flatten + name)
                                                          │
                                            utils.applyTheme (write to DOM)
                                                          │
                                       document.documentElement.style
                                         --cuix-colors-primary: #2563eb ...
```

1. **`ThemeProvider`** receives an optional `theme` override prop (`DeepPartial<CoreUIXTheme>`).
2. It calls **`createTheme(theme)`** (memoized on the `theme` prop), which merges the partial
   override onto **`defaultTheme`** via **`mergeTheme`**.
3. The resulting complete `CoreUIXTheme` is provided to the tree via **`ThemeContext`**, readable
   by any component with **`useTheme()`**.
4. In a `useEffect`, the provider calls **`applyRuntimeThemeUpdate(mergedTheme)`**, which
   normalizes colors, generates the `--cuix-*` variable map, and applies it to
   `document.documentElement`.
5. Components consume the theme either via **React** (`useTheme()`) or via **CSS**
   (`var(--cuix-colors-primary)`) — both stay in sync, since both derive from the same merged
   object.

## CSS variable naming

`generateCssVariables.ts` is **not** a generic walk over `Object.entries(theme)` — it flattens
each top-level section through one of three hand-enumerated constants:

- **`FLAT_SECTIONS`** — sections that flatten straight to `--cuix-<prefix>-<kebab-key>` (e.g.
  `colors.primaryForeground` → `--cuix-colors-primary-foreground`). Currently: `colors`,
  `radius`, `spacing`, `shadow`, `zIndex` (prefixed `z-index`), `breakpoints` (prefixed
  `breakpoint`), `width`, `height`, `sidebar`. The CSS prefix per section is looked up in
  `SECTION_CSS_PREFIX`, a required (non-optional) `Record`, so a missing entry is a compile
  error rather than a runtime `--cuix-undefined-*` variable.
- **`TYPOGRAPHY_SECTIONS`** — the nested sub-sections of `typography` that each flatten the same
  way, via `TYPOGRAPHY_CSS_PREFIX`: `fontFamily` → `font-family`, `fontSize` → `font-size`,
  `fontWeight` → `font-weight`, `letterSpacing` → `letter-spacing`. `typography.lineHeight` and
  `typography.lineHeightTight` are handled as two one-off direct assignments
  (`--cuix-line-height`, `--cuix-line-height-tight`) rather than through either constant.
- **`EXCLUDED_SECTIONS`** — sections deliberately left out of CSS-variable generation. Currently
  just `flex`: its tokens are pre-composed Tailwind class strings (e.g. `"flex flex-row"`), not
  CSS values, so components read `theme.flex.*` directly via `useTheme()` instead of via
  `var(--cuix-*)`.

After flattening, `flattenTheme` builds an `accountedFor` set from `FLAT_SECTIONS` +
`EXCLUDED_SECTIONS` + `"typography"` and checks every key of the actual `theme` object against
it. If a top-level `CoreUIXTheme` section exists that isn't in any of the three lists, it
**throws** (`generateCssVariables: unhandled theme section(s): ...`) instead of silently dropping
it — this is a safety net added specifically because `flex` used to fall through unnoticed before
`EXCLUDED_SECTIONS` existed. **Practical consequence:** adding a whole new top-level theme
section to `models/Theme.ts` requires adding it to one of these three lists in
`generateCssVariables.ts`, or the app will throw at runtime the first time the theme is applied
— this is stricter than "the CSS variable is just missing."

## How to extend

- **Add a new token/color within an existing section**: add the key to `models/Theme.ts`, give
  it a default in the matching `tokens/*.ts` file. That's the only change needed —
  `generateCssVariables.ts` already iterates every key of that section.
- **Add a whole new top-level section**: add it to `models/Theme.ts`, add a `tokens/*.ts` default
  for it, wire it into `core/defaultTheme.ts`'s spread (automatic if it's included in
  `tokens/index.ts`'s barrel), and — critically — add it to `FLAT_SECTIONS` (with a
  `SECTION_CSS_PREFIX` entry) or `EXCLUDED_SECTIONS` in `generateCssVariables.ts`. Skipping this
  step means the app throws at runtime instead of silently missing a variable. If it needs
  Tailwind semantic-class mapping, add a corresponding entry in `tailwind.config.ts` too.
- **Add a new output target** (e.g. React Native styles, a JSON export): the pipeline is
  single-target (CSS variables) by design. Introduce a pluggable seam at `utils/applyTheme.ts`
  rather than writing straight to `document.documentElement` from a new caller.

## Usage example

```tsx
import { ThemeProvider, useTheme } from "@coreuix/ui";

function App() {
  return (
    <ThemeProvider theme={{ colors: { primary: "#7c3aed" } }}>
      <Page />
    </ThemeProvider>
  );
}

function Page() {
  const theme = useTheme();
  return <div style={{ color: theme.colors.primary }}>Hello</div>;
  // or, in CSS: color: var(--cuix-colors-primary);
}
```

See also: [security.md](../security.md#theme-override-input-is-not-sanitized--treat-it-as-trusted)
for the trust boundary on the `theme` override prop.
