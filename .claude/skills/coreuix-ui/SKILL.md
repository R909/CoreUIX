---
name: coreuix-ui
description: Use when adding, modifying, reviewing, or scaffolding code anywhere in this repository (@coreuix/ui) — a standalone, publishable shadcn/ui + Tailwind component library with a custom --cuix-* token-based theme system. Covers the barrel-export folder structure, the component file split (.tsx/.variants.ts/.types.ts), the theme token pipeline, and the recipe for adding new shadcn components correctly.
---

# CoreUIX UI component library

## When to use this skill

Use this skill for any task inside this repo: adding a new component, editing an
existing one, touching the theme system (`src/theme/`), editing `tailwind.config.ts`
or `src/styles.css`, or reviewing a diff for convention compliance. It does not apply
to unrelated repositories — the patterns here (barrel chain, `--cuix-*` tokens) are
specific to this codebase.

For the full detail behind each section below, see the companion files in this skill
folder:

- `architecture.md` — the barrel-export chain and the theme token pipeline, in depth
- `coding-standards.md` — TypeScript/ESLint/Prettier configuration and import rules
- `component-guidelines.md` — the exact recipe for adding a new shadcn component
- `examples.md` — a fully worked component example to copy the shape of

## Project overview

`@coreuix/ui` is a **standalone, publishable shared component library** — shadcn/ui
components + Tailwind CSS + a custom token-driven theme system. There is **no
monorepo wrapper and no consumer app in this repo**. It is built via `pnpm build`
into `dist/` (ESM + CJS + `.d.ts` + a compiled `styles.css`) and consumed by other
projects as an npm-registry package or a packed tarball. There is no backend, no API
layer, and no test runner configured.

## Tech stack

- **React 19** + **TypeScript 5** (strict mode), `react`/`react-dom` as `peerDependencies`
- **Tailwind CSS 3** (own `tailwind.config.ts`, also published as a consumable preset)
- **Radix UI** primitives (`@radix-ui/react-*`) underlying most interactive components
- **class-variance-authority (cva)** for variant definitions, re-exported as `createVariants` from `src/utils/createVariants.ts`
- **clsx** + **tailwind-merge**, combined into the `cn()` helper (`src/utils/cn.ts`)
- **lucide-react** for icons
- **tsup** for the build (`src/index.ts` → `dist/index.js`/`.cjs`/`.d.ts`), Tailwind CLI compiles `dist/styles.css` separately
- **shadcn CLI** (`shadcn` package) to scaffold new components, configured via `components.json`
- **ESLint 9 flat config** (`@typescript-eslint` recommendedTypeChecked, `eslint-plugin-react`, `react-hooks`, `jsx-a11y`, `eslint-config-prettier`) + **Prettier** (no `.prettierrc` — pure defaults)
- **pnpm** as the package manager
- **Husky** + **lint-staged** for a pre-commit gate

## Folder structure

```
src/
  index.ts                    # public package entry: re-exports components, theme, utils
  styles.css                  # @tailwind directives + :root/.dark --cuix-* variable values
  components/
    index.ts                  # aggregates every category barrel (only file touched when adding a new category)
    primitives/                # atoms with no internal composition
      index.ts
      button/
        Button.tsx
        Button.types.ts
        button.variants.ts
        index.ts
      badge/  input/  label/  textarea/  checkbox/  switch/  radio-group/
      avatar/  separator/  skeleton/  toggle/  progress/  slider/  aspect-ratio/
    layout/                    # structural / composing components
      index.ts
      card/  accordion/  tabs/  collapsible/  scroll-area/
  theme/                       # token-driven theme system, see architecture.md
    tokens/*.ts  models/Theme.ts  core/{defaultTheme,mergeTheme,createTheme}.ts
    utils/{normalize,generateCssVariables,applyTheme,runtimeUpdate}.ts
    ThemeContext.tsx  ThemeProvider.tsx  useTheme.ts  index.ts
  utils/
    cn.ts  createVariants.ts  deepMerge.ts  index.ts
dist/                          # tsup + tailwindcss build output — gitignored, not committed
components.json                # shadcn CLI config (aliases here are NOT real TS paths)
tailwind.config.ts              # design-token-mapped config; also published as a preset
CLAUDE.md / README.md / COMMANDS.md / docs/   # project docs (see note in coding-standards.md about drift)
```

Current categories: `primitives/` and `layout/` (see the list above for the exact
components in each — check the folder tree before assuming a component category, as
this list changes over time).

## Architecture patterns

Two systems define almost every decision in this repo — full detail in `architecture.md`:

1. **Barrel-export chain** — every component lives in its own folder with a local
   `index.ts`, aggregated upward through exactly three levels: component barrel →
   category barrel (`primitives/index.ts`) → `components/index.ts` → `src/index.ts`.
2. **Theme token pipeline** — `theme/tokens/*.ts` values flow through
   `defaultTheme` → `createTheme(overrides)` → `mergeTheme` → a `CoreUIXTheme` object
   that is both provided to React via `ThemeContext`/`useTheme()` and pushed onto
   `document.documentElement` as `--cuix-*` CSS custom properties.

## Coding standards

See `coding-standards.md` for the full ESLint/TS ruleset. Highlights:

- Strict TypeScript (`strict: true`), no `any`-permissive escape hatches added casually.
- `@typescript-eslint/consistent-type-imports` is a warning — prefer `import type` for type-only imports (see every existing component file).
- `react/prop-types` is off (TypeScript is the source of truth for prop shapes).
- No Prettier config file exists — formatting is 100% Prettier defaults; don't add a `.prettierrc` without discussing it first, since every existing file was written to match the defaults.

## Component conventions

Every component (see `component-guidelines.md` for the step-by-step recipe):

- Lives in `src/components/<category>/<name>/`.
- Splits into up to four files: `<name>.tsx` (implementation), `<name>.variants.ts`
  (`cva` definitions), `<name>.types.ts` (prop types), `index.ts` (local barrel).
  Components with zero styling/variants of their own (pure Radix re-exports, e.g.
  `aspect-ratio`, `collapsible`) skip `.variants.ts`.
- Uses `React.forwardRef` for anything wrapping a DOM element or a Radix primitive,
  and sets `.displayName`.
- Exposes variants via `VariantProps<typeof xVariants>` intersected with the native
  element's props (`React.ComponentPropsWithoutRef<typeof RadixPrimitive.Root>` or
  `React.ComponentProps<"input">` for plain HTML elements).
- Multi-part components (e.g. `Card` + `CardHeader`/`CardTitle`/...) give **each
  sub-part its own `cva` export** in the shared `.variants.ts` file, even when a part
  has no variant options of its own (see `cardHeaderVariants`, `avatarImageVariants`)
  — this keeps every part consistently overridable via `className`.

## Styling conventions

- **Preferred pattern**: bind Tailwind arbitrary-value classes directly to the
  theme's CSS variables, e.g. `bg-[var(--cuix-colors-primary)]`,
  `rounded-[var(--cuix-radius-md)]`, `text-[var(--cuix-font-size-sm)]`,
  `shadow-[var(--cuix-shadow-sm)]`. This is what every component in the repo
  currently uses.
- Only tokenize a bare Tailwind value when it **exactly matches** an existing token
  (e.g. `p-6` → `p-[var(--cuix-spacing-lg)]` because `spacing.lg` is exactly `24px`).
  Leave values with no exact match as plain Tailwind utilities (e.g. Toggle's
  `sm` size keeps bare `px-1.5`, `min-w-8` — there's no matching spacing token).
- If a component needs a value the theme doesn't have yet, add the token to
  `theme/models/Theme.ts` **and** its default in the matching `theme/tokens/*.ts`
  file **and** the literal value in `src/styles.css`'s `:root`/`.dark` blocks **and**
  (if it should be usable as a plain Tailwind class, not just an arbitrary value)
  `tailwind.config.ts`. No other file needs touching — `generateCssVariables` walks
  every theme section automatically.
- Avoid the older bare-semantic-class pattern (`bg-card`, `text-muted-foreground`)
  even though `tailwind.config.ts` still maps those names to the same `--cuix-*`
  variables for backward compatibility — it bypasses `useTheme()` for any component
  logic that needs the value in JS, not just CSS.

## Import conventions

- All internal imports use the `@/*` → `src/*` alias (defined in `tsconfig.json`,
  resolved at build time by `tsup`). Never use relative `../../` imports across
  component/category boundaries.
- `components.json`'s `aliases` block (`@components`, `@utils`, `@hooks`, `@theme`)
  is consumed **only** by the shadcn CLI when scaffolding new files into
  `@components/ui/...` — it is not a real TypeScript path mapping and will not
  resolve in hand-written code. Always rewrite shadcn's scaffolded imports to `@/...`
  before moving the file into place.
- Type-only imports use `import type { X } from "..."` (not just `import { type X }`),
  matching every existing `.types.ts` file.

## File naming conventions

- Folder name and most file names are lowercase-kebab, matching the shadcn
  component's registry name (`radio-group/`, `scroll-area/`, `toggle-group/`).
- `button/` is the one legacy exception — `Button.tsx`/`Button.types.ts` are
  PascalCase while `button.variants.ts`/`index.ts` are lowercase. Every component
  added since `button` (including `badge`, `card`, and everything under
  `primitives/`/`layout/`) uses fully lowercase file names matching the folder —
  follow that (fully lowercase) convention for new components, not `button`'s.

## State management patterns

This is a component library, not an app — there is no global state library
(no Redux/Zustand/etc.) and no data-fetching layer. The only state-sharing patterns
present are:

- **`ThemeContext`** (`src/theme/ThemeContext.tsx`) — a plain `React.createContext`
  defaulting to `defaultTheme`, read via the `useTheme()` hook. It does not throw
  when used outside a provider; it silently falls back to the default theme.
- **Per-component internal state** via `React.useState`/`useId`/`useContext` scoped
  to a single component tree, used when a compound component needs to share a value
  between parent and children without prop-drilling (e.g. a toggle-group-style
  component sharing `variant`/`size` from its root down to each item via its own
  local context — check the component's own file for the exact pattern before
  assuming one exists, since not every multi-part component needs this).
- Controlled/uncontrolled behavior for form-like primitives (`Checkbox`, `Switch`,
  `RadioGroup`, `Slider`, etc.) is delegated entirely to the underlying Radix
  primitive — this repo's wrapper components don't add their own value/state logic.

## API patterns

None. There is no API/data-fetching layer in this repo (no `fetch` wrappers, no
REST/GraphQL client, no server actions). If a future component needs external data,
it should accept it via props/callbacks from the consuming application rather than
fetching internally — that keeps the library framework-agnostic on the data layer,
consistent with how the theme system stays framework-agnostic on styling.

## Error handling patterns

Minimal by design — this is a presentational library:

- No custom error boundaries, no try/catch wrappers around rendering.
- Components rely on TypeScript + Radix's own prop validation rather than runtime
  checks; there is no established "throw if used outside required provider" pattern
  in the current codebase (`useTheme()` degrades gracefully to `defaultTheme` instead
  of throwing) — don't assume every hook should throw without checking precedent
  in the specific area you're touching.

## Testing patterns

**No test runner is configured** (`package.json` has no `test` script, no Jest/Vitest/
Playwright dependency). Verification in this repo is `pnpm typecheck` + `pnpm lint` +
`pnpm build` succeeding, plus manual/visual verification. Do not introduce a test
framework as a side effect of an unrelated task — that's a standalone decision for
the user to make.

## Build commands

```bash
pnpm build             # tsup -> dist/ (ESM + CJS + .d.ts) + tailwindcss -> dist/styles.css
```

## Development commands

```bash
pnpm install            # installs deps; also runs the "prepare" script (husky && npm run build) — see coding-standards.md
pnpm typecheck          # tsc --noEmit
pnpm lint               # eslint .
pnpm lint:fix           # eslint . --fix
pnpm format             # prettier --write .
pnpm format:check       # prettier --check .
pnpm exec shadcn add <name>   # scaffold a new shadcn component (never `pnpm add <name>` — see component-guidelines.md)
```

## Common utilities

- `cn(...)` (`src/utils/cn.ts`) — `clsx` + `tailwind-merge`; use this (not template
  literals or plain string concatenation) to combine a component's base classes with
  a caller-supplied `className`.
- `createVariants` (`src/utils/createVariants.ts`) — a thin re-export of `cva`; also
  re-exports the `VariantProps` type. New `.variants.ts` files can import `cva`
  directly from `class-variance-authority` (matching existing files) or via this
  re-export — both are equivalent, but stay consistent with whichever the rest of
  that category already uses.
- `deepMerge` (`src/utils/deepMerge.ts`) — recursive plain-object merge; only
  consumed by the theme system's `mergeTheme`, not expected to be used by components
  directly.

## Reusable patterns

- **Multi-part component with a shared variants file**: see `card/` — one
  `.variants.ts` exporting a `cva` per sub-part, one `.types.ts` intersecting each
  part's native props with its own `VariantProps`, one `.tsx` with a
  `React.forwardRef` per part.
- **Variant-map component**: see `button/` or `toggle/` — a single `cva` call with a
  `variants: { variant: {...}, size: {...} }` map and `defaultVariants`.
- **Zero-styling passthrough**: see `aspect-ratio/` or `collapsible/` — when a
  shadcn component is just `const X = RadixPrimitive.Root` with no classes at all,
  skip `.variants.ts` (and skip `.types.ts` too if there are no props of the
  component's own to type) rather than creating an empty file for structural
  symmetry.

## Things to avoid

- Never run `pnpm add <name>` to scaffold a shadcn component — it is pnpm's own
  "install a package" command and wins over the `"add": "shadcn add"` script,
  silently installing an unrelated real npm package instead.
- Never leave a shadcn-scaffolded file using `@components/...` imports or sitting in
  the flat `src/components/<name>.tsx` (or the literal `@components/ui/` folder the
  CLI actually writes to) — always relocate and rewrite imports before considering
  the component done.
- Don't invent a new component category (`overlay/`, `feedback/`, ...) speculatively;
  only add one when a component that genuinely needs it is being added.
- Don't add bare Tailwind semantic classes (`bg-primary`, `text-muted-foreground`) to
  a _new_ component — use the `--cuix-*` var pattern (see "Styling conventions").
- Don't add a testing framework, a global state library, or an API/data client as a
  side effect of another task — none currently exist in this repo, and adding one is
  an explicit, standalone decision.
- Be aware `CLAUDE.md`, `README.md`, and `COMMANDS.md` disagree with each other and
  with the actual repository state on a few points (whether `dist/` is committed,
  whether a `prepare` script exists) — see `coding-standards.md` for the verified
  ground truth and don't take any single doc file's claim at face value without
  checking `package.json`/`.gitignore` first.

## Checklist before creating new code

1. Does the component/category already exist? Check the actual folder tree
   (`find src/components -maxdepth 2 -type d`), not just what a doc file claims.
2. Scaffold via `pnpm exec shadcn add <name>` (never `pnpm add`), then relocate out
   of the flat/`@components/ui` output into `src/components/<category>/<name>/`.
3. Split into `.tsx` / `.variants.ts` / `.types.ts` / `index.ts` (skip `.variants.ts`
   for genuinely style-less passthroughs).
4. Rewrite every bare Tailwind semantic color/radius/shadow/font-size class to the
   matching `--cuix-*` arbitrary-value class; add a new theme token only if nothing
   existing matches (four files to touch — see "Styling conventions").
5. Rewrite `@components/...` imports to `@/...`.
6. Wire the component into `<category>/index.ts`, and into `components/index.ts` too
   if the category itself is new.
7. Run `pnpm typecheck && pnpm lint && pnpm build` — all three must pass clean.
8. Update the "current categories"/component list in `CLAUDE.md` (and this skill's
   folder-structure section, if it's materially out of date) to include the new
   component.
