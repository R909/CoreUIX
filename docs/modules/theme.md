# Module: Theme System (`src/theme/`)

Token-driven, framework-agnostic theming. A theme is a plain TypeScript object (`CoreUIXTheme`)
built from small token primitives, merged with user overrides, and pushed to the DOM as CSS
custom properties (`--cuix-*`). See [architecture.md](../architecture.md) for the full pipeline
diagram and [../src/theme/README.md](../../src/theme/README.md) for the original detailed writeup
this doc summarizes.

## File-by-file reference

| Path                            | Responsibility                                                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens/colorsTokens.ts`        | Light-theme color palette (background, primary/secondary/destructive + foregrounds, border/input/ring, muted/accent/popover/card). Dark overrides live in `src/styles.css`, not here. |
| `tokens/radiusTokens.ts`        | Border-radius scale (`sm`/`md`/`lg`).                                                                                                                                                 |
| `tokens/spacingTokens.ts`       | Spacing scale (`xs`/`sm`/`md`/`lg`).                                                                                                                                                  |
| `tokens/typographyTokens.ts`    | Font families, font sizes, line height.                                                                                                                                               |
| `tokens/shadowsTokens.ts`       | Box-shadow scale (`sm`/`md`/`lg`).                                                                                                                                                    |
| `tokens/breakpointsTokens.ts`   | Responsive breakpoints (`sm`/`md`).                                                                                                                                                   |
| `tokens/flexTokens.ts`          | Ready-to-use Tailwind flex utility-class strings (not raw CSS values, unlike other token sections).                                                                                   |
| `tokens/zIndexTokens.ts`        | Z-index values for modals/tooltips.                                                                                                                                                   |
| `tokens/index.ts`               | Barrel: aggregates every token module.                                                                                                                                                |
| `models/Theme.ts`               | `CoreUIXTheme` — the canonical theme shape every token section conforms to.                                                                                                           |
| `models/DeepPartial.ts`         | Recursive partial type, used for `ThemeProvider`'s `theme` override prop.                                                                                                             |
| `models/index.ts`               | Barrel for the type layer.                                                                                                                                                            |
| `core/defaultTheme.ts`          | Assembles `tokens/*` into one complete default `CoreUIXTheme`.                                                                                                                        |
| `core/mergeTheme.ts`            | Deep-merges a partial override onto a base theme (built on `utils/deepMerge`).                                                                                                        |
| `core/createTheme.ts`           | Public entry point: `mergeTheme(defaultTheme, override)`.                                                                                                                             |
| `core/index.ts`                 | Barrel for core.                                                                                                                                                                      |
| `utils/normalize.ts`            | `normalizeTheme` — currently expands 3-digit shorthand hex colors (`#fff` → `#ffffff`).                                                                                               |
| `utils/generateCssVariables.ts` | Flattens a nested `CoreUIXTheme` into dot-path keys, then maps each to its final `--cuix-*` CSS variable name.                                                                        |
| `utils/applyTheme.ts`           | Writes a `{ "--cuix-*": value }` map onto `document.documentElement.style`. Browser-only.                                                                                             |
| `utils/runtimeUpdate.ts`        | `applyRuntimeThemeUpdate` — composes normalize → generateCssVariables → applyTheme into one call.                                                                                     |
| `utils/index.ts`                | Barrel for the runtime pipeline.                                                                                                                                                      |
| `ThemeContext.tsx`              | React context; defaults to `defaultTheme` when read outside a provider.                                                                                                               |
| `useTheme.ts`                   | Hook that reads `ThemeContext`.                                                                                                                                                       |
| `ThemeProvider.tsx`             | `"use client"` component: builds the theme via `createTheme` (memoized), provides it via context, applies it to the DOM in a `useEffect`.                                             |
| `index.ts`                      | Public barrel for the whole theme system.                                                                                                                                             |

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

`generateCssVariables.ts` derives `--cuix-<section>-<kebab-key>` for most sections (e.g.
`colors.primaryForeground` → `--cuix-colors-primary-foreground`), with two special cases:

- Nested sections use a dotted lookup in `SECTION_CSS_PREFIX`
  (`typography.fontFamily` → prefix `font-family`, `typography.fontSize` → prefix `font-size`).
- A few keys map straight to a specific name via `DIRECT_CSS_NAME`
  (`typography.lineHeight` → `--cuix-line-height`, no per-key suffix).

`flattenTheme` explicitly walks each theme section (colors, radius, spacing, shadow, zIndex,
breakpoints, typography) — unlike `defaultTheme`, this is **not** generic over
`Object.entries(theme)`, so adding a new top-level theme section requires adding a corresponding
block here too (in addition to `models/Theme.ts` and a `tokens/*.ts` default).

## How to extend

- **Add a new token/color**: add the key to `models/Theme.ts`, give it a default in the matching
  `tokens/*.ts` file. If it's a new value _within_ an existing section (e.g. one more color),
  that's the only change needed. If it's a whole new top-level section, also add a block to
  `flattenTheme` in `generateCssVariables.ts` and, if it needs Tailwind semantic-class mapping,
  a corresponding entry in `tailwind.config.ts`.
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
