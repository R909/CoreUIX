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
- **ESLint 9 flat config** (`@typescript-eslint` recommendedTypeChecked, `eslint-plugin-react`, `react-hooks`, `jsx-a11y`, `eslint-plugin-prettier/recommended`) with several strict repo-specific rules — `explicit-function-return-type`, `typedef`, `no-restricted-imports` banning relative/`@/*` imports — see `coding-standards.md` for the full list and the one deliberate exception (`cva()` exports)
- **Prettier** — a real `.prettierrc.json` exists (double quotes, semicolons, trailing commas, printWidth 80) and is enforced as an ESLint error via `eslint-plugin-prettier`, not just a separate formatting step
- **pnpm** as the package manager
- **Husky** + **lint-staged** for a pre-commit gate; `pnpm install` also runs a full `pnpm build` via the `prepare` script

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
        button.tsx
        button.types.ts
        button.variants.ts
        index.ts
      badge/  input/  label/  textarea/   # all lowercase, same four-file split as button/
    layout/                    # structural / composing components
      index.ts
      card/                    # Card + 5 sub-parts, one cva per sub-part
      sidebar/                 # large compound component, see below
  theme/                       # token-driven theme system, see architecture.md
    tokens/*.ts  models/Theme.ts  core/{defaultTheme,mergeTheme,createTheme}.ts
    utils/{normalize,generateCssVariables,applyTheme,runtimeUpdate}.ts
    ThemeContext.tsx  ThemeProvider.tsx  useTheme.ts  index.ts
  hooks/
    use-mobile.tsx              # useIsMobile(), consumed by sidebar
  utils/
    cn.ts  createVariants.ts  deepMerge.ts  index.ts
dist/                          # tsup + tailwindcss build output — gitignored, not committed
components.json                # shadcn CLI config; its aliases now match real tsconfig paths (see architecture.md)
tailwind.config.ts              # design-token-mapped config; also published as a preset
CLAUDE.md / README.md / COMMANDS.md / docs/   # project docs
```

`layout/sidebar/` is the newest and largest addition: `sidebar.tsx` exports
`SidebarProvider`, `Sidebar`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`,
`SidebarInput`, `SidebarHeader`/`Footer`/`Separator`/`Content`, the
`SidebarGroup*` family, the `SidebarMenu*` family, and the `useSidebar()` hook,
plus `sidebar.types.ts`, `sidebar.variants.ts` (`sidebarMenuButtonVariants`), and
`sidebar-constant.ts` (width/cookie/keyboard-shortcut constants). It also bundles
`separator.tsx`, `sheet.tsx` (wraps `@radix-ui/react-dialog`), `skeleton.tsx`, and
`tooltip.tsx` (wraps `@radix-ui/react-tooltip`) as **private implementation
helpers** used only by `sidebar.tsx` — they are not re-exported through
`sidebar/index.ts` and are not standalone primitives in their own right. Some of
these helper files still use bare Tailwind semantic classes (`bg-primary`,
`bg-background`) rather than the `--cuix-*` tokenized pattern — known drift, not
a pattern to copy into new components (see "Styling conventions").

Current categories: `primitives/` (`button`, `badge`, `input`, `label`,
`textarea`) and `layout/` (`card`, `sidebar`). `form/` does not exist yet. Check
the folder tree (`find src/components -type f`) before assuming a component or
category exists — this list changes over time.

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
- `@typescript-eslint/explicit-function-return-type` (error) — every function/method needs an explicit return type, including inline arrow functions assigned to a typed `const`.
- `@typescript-eslint/typedef` (error) — every variable declaration needs an explicit type annotation, including destructured `useState` tuples and destructured `forwardRef` props. The **one exception**: `cva(...)` variant exports (e.g. `buttonVariants`) are deliberately left uninferred, silenced with a targeted `eslint-disable-next-line` comment — see `coding-standards.md`/`examples.md` for the exact pattern.
- `no-restricted-imports` (error) — relative imports (`./`, `../`) **and** the bare `@/*` catch-all alias are both banned repo-wide, even for a barrel re-exporting its own sibling file. Always use `@components/*`, `@theme/*`, `@utils/*`, `@hooks/*`.
- `react/prop-types` is off (TypeScript is the source of truth for prop shapes).
- Prettier is enforced as an actual ESLint error (`eslint-plugin-prettier`), backed by a real `.prettierrc.json` — formatting violations fail `pnpm lint` and `pnpm build`, not just `pnpm format:check`.

## Component conventions

Every component (see `component-guidelines.md` for the step-by-step recipe):

- Lives in `src/components/<category>/<name>/`.
- Splits into up to four files: `<name>.tsx` (implementation), `<name>.variants.ts`
  (`cva` definitions), `<name>.types.ts` (prop types), `index.ts` (local barrel).
  Components with zero styling of their own (pure Radix re-exports with no
  classes) skip `.variants.ts` — see `TooltipProvider`/`Tooltip`/`TooltipTrigger`
  in `src/components/layout/sidebar/tooltip.tsx` for the current real example of
  this shape (though note that's a private helper, not a standalone primitive).
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

- All internal imports use the **category-scoped aliases** — `@components/*`,
  `@theme/*`, `@utils/*`, `@hooks/*` — defined as real path mappings in both
  `tsconfig.json` and `components.json`'s `aliases` block. Never use relative
  `./`/`../` imports, even for a barrel re-exporting its own sibling file in the
  same folder (e.g. `button/index.ts` is
  `export * from "@components/primitives/button/button";`, not `"./button"`).
- `tsconfig.json` also defines a catch-all `@/*` → `src/*` mapping, but it is **not
  used by convention** and is actively banned by the `no-restricted-imports` ESLint
  rule — always use the category-scoped alias that matches where the target file
  lives instead.
- Always rewrite shadcn's scaffolded imports (which use relative paths or its own
  `@/...`-style conventions) to the category-scoped alias form before moving the
  file into place.
- Type-only imports use `import type { X } from "..."` (not just `import { type X }`),
  matching every existing `.types.ts` file.

## File naming conventions

- Folder name and every file name are fully lowercase-kebab, matching the shadcn
  component's registry name (`button.tsx`, `button.types.ts`, `button.variants.ts`;
  a future multi-word component would follow `radio-group/`, `scroll-area/`
  naming). `button/` previously had a PascalCase exception
  (`Button.tsx`/`Button.types.ts`) — it has since been renamed to fully lowercase
  to match every other component; don't reintroduce PascalCase filenames.

## State management patterns

This is a component library, not an app — there is no global state library
(no Redux/Zustand/etc.) and no data-fetching layer. The only state-sharing patterns
present are:

- **`ThemeContext`** (`src/theme/ThemeContext.tsx`) — a plain `React.createContext`
  defaulting to `defaultTheme`, read via the `useTheme()` hook. It does not throw
  when used outside a provider; it silently falls back to the default theme.
- **Per-component internal state** via `React.useState`/`useContext` scoped to a
  single component tree, used when a compound component needs to share a value
  between parent and children without prop-drilling. The current real example is
  `SidebarContext`/`useSidebar()` in `layout/sidebar/sidebar.tsx` — unlike
  `ThemeContext`, `useSidebar()` throws if called outside a `SidebarProvider`.
  Check the component's own file for the exact pattern before assuming one exists,
  since not every multi-part component needs this (`card/` has none).
- No form-input primitives beyond `Input`/`Textarea`/`Label` currently exist in
  this repo — there's no established controlled/uncontrolled convention yet for a
  Radix-backed value primitive (e.g. a future `Checkbox`/`Switch`/`Select`). When
  one is added, delegate value/state entirely to the underlying Radix primitive
  rather than adding this repo's own value-tracking logic, consistent with how
  every other Radix-backed component here stays a thin styled wrapper.

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
pnpm build             # eslint . && tsup -> dist/ (ESM + CJS + .d.ts) && tailwindcss -> dist/styles.css
```

`pnpm build`'s script is literally `eslint . && tsup && tailwindcss ...` — a lint
error (wrong import alias, missing type annotation, unformatted file) fails the
build before any compilation happens, not just `pnpm lint` on its own.

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
- **Variant-map component**: see `button/` or `badge/` — a single `cva` call with a
  `variants: { variant: {...} }` (or `{ variant, size }`) map, `defaultVariants`,
  and the `// eslint-disable-next-line @typescript-eslint/typedef` exemption
  comment immediately above the export (see `examples.md`).
- **Zero-styling passthrough**: no standalone primitive in this repo currently does
  this, but the pattern exists as a private helper — see `TooltipProvider`/`Tooltip`/
  `TooltipTrigger` in `src/components/layout/sidebar/tooltip.tsx`
  (`const TooltipProvider: typeof TooltipPrimitive.Provider = TooltipPrimitive.Provider;`).
  When a shadcn component is just a re-exported Radix primitive with no classes,
  skip `.variants.ts` (and `.types.ts` too if there are no props of its own) rather
  than creating an empty file for structural symmetry.
- **Complex compound component with internal Context + hooks**: see `sidebar/` —
  `SidebarContext`/`useSidebar()` in `sidebar.tsx` is the richest current example of
  `typedef` (typed `useState` tuples), `explicit-function-return-type` (every
  helper function and hook declares its return type), and a component-scoped
  `React.createContext` used to share state across many sub-parts without
  prop-drilling.

## Things to avoid

- Never run `pnpm add <name>` to scaffold a shadcn component — it is pnpm's own
  "install a package" command and wins over the `"add": "shadcn add"` script,
  silently installing an unrelated real npm package instead.
- Never leave a shadcn-scaffolded file sitting in the flat `src/components/<name>.tsx`
  (or the literal `@components/ui/` folder the CLI actually writes to), or still
  using the CLI's own scaffolded import paths — always relocate into
  `src/components/<category>/<name>/` and rewrite every import to this repo's
  category-scoped aliases (`@components/*`, `@utils/*`, etc.) before considering
  the component done.
- Don't invent a new component category (`overlay/`, `feedback/`, ...) speculatively;
  only add one when a component that genuinely needs it is being added.
- Don't add bare Tailwind semantic classes (`bg-primary`, `text-muted-foreground`) to
  a _new_ component — use the `--cuix-*` var pattern (see "Styling conventions").
- Don't add a testing framework, a global state library, or an API/data client as a
  side effect of another task — none currently exist in this repo, and adding one is
  an explicit, standalone decision.
- Never write a relative (`./`, `../`) import or the bare `@/*` alias — both are
  ESLint errors (`no-restricted-imports`). Always use `@components/*`, `@theme/*`,
  `@utils/*`, `@hooks/*`.
- Don't add a variable, destructured parameter, or function without an explicit
  type annotation/return type — `@typescript-eslint/typedef` and
  `explicit-function-return-type` are ESLint errors, not warnings. The only
  exception is a `cva(...)` export, which must stay uninferred (see
  `coding-standards.md`).

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
5. Rewrite the CLI's scaffolded imports to this repo's category-scoped aliases
   (`@components/*`, `@utils/*`, `@theme/*`, `@hooks/*`) — never `@/*` or a
   relative path.
6. Wire the component into `<category>/index.ts`, and into `components/index.ts` too
   if the category itself is new.
7. Run `pnpm typecheck && pnpm lint && pnpm build` — all three must pass clean.
8. Update the "current categories"/component list in `CLAUDE.md` (and this skill's
   folder-structure section, if it's materially out of date) to include the new
   component.
