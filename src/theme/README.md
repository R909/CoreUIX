# CoreUIX Theme System

Token-driven, framework-agnostic theming. A theme is a plain TypeScript object
(`CoreUIXTheme`) built from small token primitives, merged with user
overrides, and pushed to the DOM as CSS custom properties (`--cuix-*`).

## Folder / file reference

| Path                            | Responsibility                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `tokens/colors.ts`              | Raw color palette (background, primary, destructive, border, ring, …).                                         |
| `tokens/radius.ts`              | Border-radius scale (`sm` / `md` / `lg`).                                                                      |
| `tokens/spacing.ts`             | Spacing scale (`xs` / `sm` / `md` / `lg`).                                                                     |
| `tokens/typography.ts`          | Font family, font size, line height.                                                                           |
| `tokens/shadows.ts`             | Box-shadow scale (`sm` / `md` / `lg`).                                                                         |
| `tokens/breakpoints.ts`         | Responsive breakpoints (`sm` / `md`).                                                                          |
| `tokens/index.ts`               | Barrel export of all token modules.                                                                            |
| `models/Theme.ts`               | `CoreUIXTheme` — the full theme shape every token/module conforms to.                                          |
| `models/DeepPartial.ts`         | Recursive partial helper type, used for theme overrides.                                                       |
| `models/index.ts`               | Barrel export of models.                                                                                       |
| `core/defaultTheme.ts`          | Assembles `tokens/*` + hardcoded `zIndex` into one complete default `CoreUIXTheme`.                            |
| `core/mergeTheme.ts`            | Deep-merges a partial theme override onto a base theme (built on `@coreuix/utils/deepMerge`).                  |
| `core/createTheme.ts`           | Public entry point: `mergeTheme(defaultTheme, override)`.                                                      |
| `core/index.ts`                 | Barrel export of core.                                                                                         |
| `utils/normalize.ts`            | Normalizes a resolved theme (currently: expands shorthand hex colors).                                         |
| `utils/generateCssVariables.ts` | Flattens a nested `CoreUIXTheme` and converts each key directly into a `--cuix-*` CSS variable name/value map. |
| `utils/applyTheme.ts`           | Writes a `--cuix-*` variable map onto `document.documentElement`.                                              |
| `utils/runtimeUpdate.ts`        | Orchestrates normalize → generateCssVariables → applyTheme.                                                    |
| `utils/index.ts`                | Barrel export of utils.                                                                                        |
| `ThemeContext.tsx`              | React context, defaults to `defaultTheme`.                                                                     |
| `useTheme.ts`                   | Hook that reads `ThemeContext`.                                                                                |
| `ThemeProvider.tsx`             | React provider: builds the theme via `createTheme`, provides it via context, applies it to the DOM via utils.  |
| `index.ts`                      | Public barrel — everything above, importable via the `@coreuix/theme/*` path alias.                            |

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
2. It calls **`createTheme(theme)`** (memoized), which merges the partial override onto **`defaultTheme`** (built from `tokens/*`) via **`mergeTheme`**.
3. The resulting complete `CoreUIXTheme` is provided to the tree via **`ThemeContext`**, readable by any component with **`useTheme()`**.
4. In a `useEffect`, the provider calls **`applyRuntimeThemeUpdate(mergedTheme)`**, which:
   - **normalizes** colors (expands `#fff` → `#ffffff`),
   - **generates** the `--cuix-*` CSS variable map from the nested theme,
   - **applies** it to `document.documentElement`.
5. Components can consume the theme either via **React** (`useTheme()` → typed JS values) or via **CSS** (`var(--cuix-colors-primary)` etc.) — both stay in sync because both derive from the same merged theme object.

## How to extend

- **Add a new token / color**: add the key to `models/Theme.ts` and give it a default value in the matching `tokens/*.ts` file. No other file needs to change — `generateCssVariables.ts` iterates `Object.entries` on each section automatically and derives the CSS variable name from the key.
- **Add a new output target** (e.g. React Native styles, JSON export): the pipeline is single-target (CSS variables) by design. Supporting another target would mean introducing a small pluggable seam at `utils/applyTheme.ts` rather than writing straight to `document.documentElement`.

## Usage example

```tsx
import { ThemeProvider, useTheme } from "@coreuix/theme";

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
