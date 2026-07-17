# CoreUIX Theme System

Token-driven, framework-agnostic theming. A theme is a plain TypeScript object
(`CoreUIXTheme`) built from small token primitives, merged with user
overrides, and pushed to the DOM as CSS custom properties (`--cuix-*`).

## Folder / file reference

| Path                            | Responsibility                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens/colorsTokens.ts`        | Light-theme color palette (background, primary/secondary/destructive + foregrounds, border/input/ring, muted/accent/popover/card, `transparent`). Dark overrides live in `src/styles.css`, not here.                                                                                                                                                                                                                                               |
| `tokens/radiusTokens.ts`        | Border-radius scale (`sm` / `md` / `lg`).                                                                                                                                                                                                                                                                                                                                                                                                          |
| `tokens/spacingTokens.ts`       | Spacing scale (`xs` / `sm` / `md` / `lg` / `tight`).                                                                                                                                                                                                                                                                                                                                                                                               |
| `tokens/typographyTokens.ts`    | `fontFamily` (`body`/`heading`), `fontSize` (`xs`/`sm`/`md`/`lg`), `fontWeight` (`medium`/`semibold`), `letterSpacing` (`normal`/`tight`), flat `lineHeight` / `lineHeightTight`.                                                                                                                                                                                                                                                                  |
| `tokens/shadowsTokens.ts`       | Box-shadow scale (`sm` / `md` / `lg`).                                                                                                                                                                                                                                                                                                                                                                                                             |
| `tokens/breakpointsTokens.ts`   | Responsive breakpoints (`sm` / `md`).                                                                                                                                                                                                                                                                                                                                                                                                              |
| `tokens/flexTokens.ts`          | Ready-to-use Tailwind flex utility-class strings (e.g. `"flex flex-row"`) — not raw CSS values, so this section is deliberately excluded from CSS-variable generation (see `utils/generateCssVariables.ts` below).                                                                                                                                                                                                                                 |
| `tokens/zIndexTokens.ts`        | Z-index values for modals/tooltips.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `tokens/widthTokens.ts`         | Width scale (`full` / `screen` / `auto` / `fit` / `min` / `max`).                                                                                                                                                                                                                                                                                                                                                                                  |
| `tokens/heightTokens.ts`        | Height scale (`full` / `screen` / `auto` / `fit` / `min` / `max`).                                                                                                                                                                                                                                                                                                                                                                                 |
| `tokens/sidebarTokens.ts`       | Sidebar-specific color palette (`background`/`foreground`/`primary`/`primaryForeground`/`accent`/`accentForeground`/`border`/`ring`), consumed by `src/components/layout/sidebar`.                                                                                                                                                                                                                                                                 |
| `tokens/borderTokens.ts`        | `border.width` (`none`/`thin`/`thick`) and `border.style` (`solid`/`dashed`/`dotted`/`none`).                                                                                                                                                                                                                                                                                                                                                      |
| `tokens/opacityTokens.ts`       | `opacity` scale (`none`/`disabled`/`hover`/`full`) for disabled states, overlays, hover dimming.                                                                                                                                                                                                                                                                                                                                                   |
| `tokens/transitionTokens.ts`    | `transition.duration` (`fast`/`normal`/`slow`) and `transition.easing` (`linear`/`in`/`out`/`inOut`).                                                                                                                                                                                                                                                                                                                                              |
| `tokens/textTokens.ts`          | `text.color` (semantic text colors) plus size-keyed style presets `text.heading`/`text.body`/`text.caption`/`text.label` (each `{ fontSize, fontWeight, lineHeight }` per size), and `text.decoration`/`text.transform`/`text.overflow`/`text.whiteSpace`/`text.align`. Consumed by `src/components/primitives/text`.                                                                                                                              |
| `tokens/index.ts`               | Barrel export of all token modules.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `models/Theme.ts`               | `CoreUIXTheme` — the full theme shape every token/module conforms to. Top-level sections: `colors`, `radius`, `spacing`, `shadow`, `zIndex`, `breakpoints`, `border`, `opacity`, `transition`, `width`, `height`, `typography`, `flex`, `sidebar`, `text`.                                                                                                                                                                                         |
| `models/DeepPartial.ts`         | Recursive partial helper type, used for theme overrides.                                                                                                                                                                                                                                                                                                                                                                                           |
| `models/index.ts`               | Barrel export of models.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `core/defaultTheme.ts`          | Assembles `tokens/*` into one complete default `CoreUIXTheme` — a plain `{ ...tokens }` spread; every section (including `zIndex`) now comes from its own `tokens/*.ts` file, nothing is hardcoded inline here.                                                                                                                                                                                                                                    |
| `core/mergeTheme.ts`            | Deep-merges a partial theme override onto a base theme (built on `src/utils/deepMerge.ts`).                                                                                                                                                                                                                                                                                                                                                        |
| `core/createTheme.ts`           | Public entry point: `mergeTheme(defaultTheme, override)`.                                                                                                                                                                                                                                                                                                                                                                                          |
| `core/index.ts`                 | Barrel export of core.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `utils/normalize.ts`            | Normalizes a resolved theme (currently: expands shorthand hex colors in the `colors` section, e.g. `#fff` → `#ffffff`).                                                                                                                                                                                                                                                                                                                            |
| `utils/generateCssVariables.ts` | Flattens a nested `CoreUIXTheme` into a `--cuix-*` CSS variable name/value map — **not** a generic walk over every key; see "CSS variable naming" below.                                                                                                                                                                                                                                                                                           |
| `utils/applyTheme.ts`           | Writes a `--cuix-*` variable map onto `document.documentElement`.                                                                                                                                                                                                                                                                                                                                                                                  |
| `utils/runtimeUpdate.ts`        | Orchestrates normalize → generateCssVariables → applyTheme.                                                                                                                                                                                                                                                                                                                                                                                        |
| `utils/index.ts`                | Barrel export of utils.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `ThemeContext.tsx`              | React context, defaults to `defaultTheme`.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `useTheme.ts`                   | Hook that reads `ThemeContext`.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `ThemeProvider.tsx`             | `"use client"` React provider: builds the theme via `createTheme` (memoized on the `theme` prop), provides it via context, applies it to the DOM via `utils/runtimeUpdate.ts` in a `useEffect`.                                                                                                                                                                                                                                                    |
| `index.ts`                      | Public barrel — everything above, re-exported (alongside every other module) through the package's single entry point, `@coreuix/ui` (see `src/index.ts`). There is no separate `@coreuix/theme` package or subpath — `package.json`'s `exports` map only publishes `.`, `./styles.css`, and `./tailwind.config`. Internally, code reaches these files via the `@theme/*` TypeScript path alias (`tsconfig.json`), not a runtime import specifier. |

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

Step by step:

1. **`ThemeProvider`** receives an optional `theme` override prop (`DeepPartial<CoreUIXTheme>`).
2. It calls **`createTheme(theme)`** (memoized on the `theme` prop), which merges the partial override onto **`defaultTheme`** (built from `tokens/*`) via **`mergeTheme`**.
3. The resulting complete `CoreUIXTheme` is provided to the tree via **`ThemeContext`**, readable by any component with **`useTheme()`**.
4. In a `useEffect`, the provider calls **`applyRuntimeThemeUpdate(mergedTheme)`**, which:
   - **normalizes** colors (expands `#fff` → `#ffffff`),
   - **generates** the `--cuix-*` CSS variable map from the nested theme,
   - **applies** it to `document.documentElement`.
5. Components can consume the theme either via **React** (`useTheme()` → typed JS values) or via **CSS** (`var(--cuix-colors-primary)` etc.) — both stay in sync because both derive from the same merged theme object.

## CSS variable naming

`generateCssVariables.ts`'s internal `flattenTheme` walks each theme section through one of six
hand-enumerated constants, not a generic `Object.entries(theme)` loop:

- **`FLAT_SECTIONS`** (`colors`, `radius`, `spacing`, `shadow`, `zIndex`, `breakpoints`, `width`,
  `height`, `sidebar`, `opacity`) flatten straight to `--cuix-<prefix>-<kebab-key>`, with the
  prefix per section looked up in the required `SECTION_CSS_PREFIX` map.
- **`TYPOGRAPHY_SECTIONS`** (`fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`) are the
  nested sub-sections of `typography`, flattened the same way via `TYPOGRAPHY_CSS_PREFIX`.
  `typography.lineHeight` / `lineHeightTight` are each assigned directly to a fixed variable name
  outside of either constant.
- **`BORDER_SECTIONS`** (`width`, `style`) are the nested sub-sections of `border`, flattened via
  `BORDER_CSS_PREFIX`.
- **`TRANSITION_SECTIONS`** (`duration`, `easing`) are the nested sub-sections of `transition`,
  flattened via `TRANSITION_CSS_PREFIX`.
- **`TEXT_FLAT_SECTIONS`** (`color`, `decoration`, `transform`, `overflow`, `whiteSpace`, `align`)
  are the nested sub-sections of `text` that are already flat string maps, flattened via
  `TEXT_FLAT_CSS_PREFIX`.
- **`TEXT_PRESET_SECTIONS`** (`heading`, `body`, `caption`, `label`) are the nested sub-sections
  of `text` that are size-keyed `{ fontSize, fontWeight, lineHeight }` presets, flattened via
  `TEXT_PRESET_CSS_PREFIX` to `--cuix-<prefix>-<size>-<prop>`.
- **`EXCLUDED_SECTIONS`** (`flex`) are sections deliberately left out of CSS-variable generation.

After flattening, the function checks every top-level key of the actual theme object against the
union of `FLAT_SECTIONS` + `EXCLUDED_SECTIONS` + `"typography"`/`"text"`/`"border"`/`"transition"`
and **throws** (`generateCssVariables: unhandled theme section(s): ...`) if anything is missing —
this was added specifically because `flex` used to fall through unnoticed before
`EXCLUDED_SECTIONS` existed. In other words: adding a new top-level section to `CoreUIXTheme`
without also accounting for it here is a runtime error, not a silently-missing variable.

## How to extend

- **Add a new token / color within an existing section**: add the key to `models/Theme.ts` and give it a default value in the matching `tokens/*.ts` file. No other file needs to change for values _within_ a section already listed in `FLAT_SECTIONS`/`TYPOGRAPHY_SECTIONS`.
- **Add a whole new top-level section**: also add it to `FLAT_SECTIONS` (with a `SECTION_CSS_PREFIX` entry), a new nested-sub-section constant pair (if it has nested sub-objects, following the `BORDER_SECTIONS`/`TEXT_FLAT_SECTIONS` shape), or `EXCLUDED_SECTIONS` in `generateCssVariables.ts`, and add its key to the `accountedFor` set — otherwise the app throws at runtime the first time the theme is applied. Add a `tailwind.config.ts` mapping too if it needs a Tailwind semantic-class equivalent.
- **Add a new output target** (e.g. React Native styles, JSON export): the pipeline is single-target (CSS variables) by design. Supporting another target would mean introducing a small pluggable seam at `utils/applyTheme.ts` rather than writing straight to `document.documentElement`.

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
