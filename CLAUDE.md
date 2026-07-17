# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`@coreuix/ui` — a standalone, publishable shared component library (shadcn/ui + Tailwind + a custom token-based theme system). There is **no monorepo wrapper and no consumer app in this repo**; it's built and shipped via `dist/` for other projects to install (tarball, git dependency, or registry).

## Commands

```bash
pnpm install          # install deps (runs "prepare": husky install + full build — see "Husky" below)
pnpm build             # eslint . (hard gate) && tsup -> dist/ (ESM + CJS + .d.ts) && tailwindcss -> dist/styles.css
pnpm typecheck         # tsc --noEmit
pnpm lint              # eslint .
pnpm lint:fix          # eslint . --fix
pnpm format            # prettier --write .
pnpm format:check      # prettier --check .
pnpm exec shadcn add <name>   # add a new shadcn component (see below)
```

There is no test runner configured in this repo.

### Adding a shadcn component

Never use `pnpm add <name>` for this — that's pnpm's own "install a package" command and wins over the `"add": "shadcn add"` script in `package.json`, silently installing an unrelated real npm package instead. Always use `pnpm exec shadcn add <name>`.

shadcn drops the generated file flat into `src/components/<name>.tsx`. It must then be moved by hand into the category structure:

```bash
mkdir -p src/components/<category>/<name>
mv src/components/<name>.tsx src/components/<category>/<name>/<name>.tsx
echo 'export * from "@components/<category>/<name>/<name>";' > src/components/<category>/<name>/index.ts
```

Then wire it into the barrel chain (see Architecture below): add it to `src/components/<category>/index.ts`, creating that file if the category is new, and add `export * from "./<category>";` to `src/components/index.ts` if the category itself is new.

### Releasing

`dist/` is gitignored — it's a local build artifact only, not committed. There is no CI and no npm-registry publish workflow yet, so there is currently no working install path (git dependency, tarball, or registry) for consumers: a fresh clone will not have `dist/` present until someone runs `pnpm build` locally. To produce a build, bump `version` in `package.json` and run `pnpm build`.

## Architecture

### Barrel-export chain

Every component lives in its own folder with a local barrel, and barrels aggregate upward through exactly three levels:

```
src/components/<category>/<name>/<name>.tsx   e.g. primitives/button/button.tsx
src/components/<category>/<name>/index.ts     -> export * from "./<name>", "./<name>.variants", "./<name>.types"
src/components/<category>/index.ts            -> aggregates every component barrel in that category
src/components/index.ts                       -> aggregates every category barrel (only file touched when adding a whole new category)
src/index.ts                                  -> public package API: re-exports components, utils, theme
```

Current categories: `primitives/` — atoms with no internal composition: `button`, `badge`, `input`, `label`, `textarea`, `toggle`, `checkbox` (Radix `Checkbox` + `Check` icon indicator), `text` (heading/body/caption/label copy via `variant`/`color` `cva` props, backed by the theme's `text.*` token section), `tabs` (Radix `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`), `select` (Radix `Select` + its full sub-part family: `SelectGroup`/`SelectValue`/`SelectTrigger`/`SelectContent`/`SelectLabel`/`SelectItem`/`SelectSeparator`/`SelectScrollUpButton`/`SelectScrollDownButton`), `command` (searchable/filterable list backed by `cmdk`, not Radix — `Command`/`CommandInput`/`CommandList`/`CommandEmpty`/`CommandGroup`/`CommandItem`/`CommandShortcut`/`CommandSeparator`), `popover` (Radix `Popover`/`PopoverTrigger`/`PopoverContent`/`PopoverAnchor`), and `multi-select` (`MultiSelect`/`MultiSelectTrigger`/`MultiSelectValue`/`MultiSelectContent`/`MultiSelectItem`/`MultiSelectGroup`/`MultiSelectSeparator` — composes `Popover` + `Command` + `Button` + `Badge`; **the one primitive with no underlying Radix primitive of its own**, so selection state is tracked via a component-scoped `MultiSelectContext` instead of delegated to a primitive, unlike everything else in `primitives/`). And `layout/` (card — structural component; `table` — Table/TableHeader/TableBody/TableFooter/TableRow/TableHead/TableCell/TableCaption, a static styled wrapper around the native `<table>` elements with no sorting/filtering/pagination logic of its own; plus a much larger `sidebar/` — `SidebarProvider`/`Sidebar`/`SidebarTrigger`/`SidebarRail`/`SidebarInset`/`SidebarInput`/`SidebarHeader`/`SidebarFooter`/`SidebarSeparator`/`SidebarContent`, the `SidebarGroup*`/`SidebarMenu*` families, and a `useSidebar()` hook, backed by sibling files `sidebar-constant.ts`, `sidebar.types.ts`, `sidebar.variants.ts`, plus private (not re-exported) helper components `separator/`, `sheet/`, `skeleton/`, `tooltip/` — each now in its own subfolder with a local `index.ts` barrel, matching the folder shape every other component uses, even though they aren't re-exported from `sidebar/index.ts`). `form/` (react-hook-form-aware composites, e.g. `select`, `toggle-group`, `form` wrapping [react-hook-form](https://react-hook-form.com/) as a `peerDependency`) hasn't been started yet. Don't pre-create empty categories; add them (`form/`, `overlay/`, `feedback/`, ...) only as components arrive that fit.

`tsup.config.ts`'s `external` array must list every `peerDependency` that's actually imported by source (`react`, `react-dom`, `react-hook-form`) — otherwise tsup bundles that package's code straight into `dist/`, defeating the point of declaring it as a peer dependency the consumer installs themselves.

Variant definitions (`cva`) live in a sibling `<name>.variants.ts` file, and prop types in `<name>.types.ts`, next to the component (see `button/`). Every other primitive/layout component follows the same split. **Note:** every component's barrel (`button/`, `badge/`, `input/`, `label/`, `textarea/`, `toggle/`, `checkbox/`, `command/`, `popover/`, `select/`, `multi-select/`, `text/`, `card/`, `table/` — `tabs/` is the one exception, whose comment doesn't make the claim in the first place) currently only re-exports the component's own module — most of these barrels carry a comment claiming they also re-export `.variants`/`.types` (e.g. `command/index.ts`: "Re-exports Command and its sub-parts, variants, and prop types"), but the actual `export *` lines for those were never added (or were dropped from the earliest ones and not restored), so e.g. `buttonVariants`/`ButtonProps`, `commandVariants`, `checkboxVariants` are not currently reachable from the public `@coreuix/ui` barrel — only the sidebar family's `index.ts` genuinely re-exports its `.variants`/`.types`/`-constant` siblings as separate lines. Flag this before relying on a `*Variants`/`*Props` export from outside the package; verify the target `index.ts` directly rather than trusting its comment.

`cva(...)` variant exports (`buttonVariants`, `cardVariants`, etc.) are deliberately left without an explicit ESLint `@typescript-eslint/typedef` type annotation — see "Linting" below.

### Path alias

`tsconfig.json` defines real path mappings for `@components/*` -> `src/components/*`, `@theme/*` -> `src/theme/*`, `@utils/*` -> `src/utils/*`, and `@hooks/*` -> `src/hooks/*` (mirroring `components.json`'s `aliases` block, which the shadcn CLI uses for the same paths when scaffolding). Every barrel and component in the codebase imports through these category-scoped aliases (e.g. `@components/primitives/button/button`), not through relative paths — including a barrel re-exporting its own sibling file in the same folder. A catch-all `@/*` -> `src/*` mapping also exists in `tsconfig.json` but isn't used by convention. Both relative imports (`./`, `../`) and the `@/*` catch-all are hard-enforced ESLint errors (`no-restricted-imports`, see "Linting" below), not just a style preference.

### Linting

Beyond the standard `eslint:recommended` / `typescript-eslint` recommendedTypeChecked / React / `jsx-a11y` / Prettier presets, `eslint.config.js` also enforces:

- `no-restricted-imports` — bans relative imports and the `@/*` catch-all (see "Path alias" above).
- `@typescript-eslint/explicit-function-return-type` (`allowExpressions: true`) — every function/method needs a declared return type.
- `@typescript-eslint/typedef` (`variableDeclaration`, `memberVariableDeclaration`, `propertyDeclaration`, `arrayDestructuring`, `objectDestructuring` all `true`) — every variable declaration and destructuring pattern (including `useState` tuples and `forwardRef` callback params) needs an explicit type annotation. Deliberate exception: `cva(...)` variant exports are left uninferred with a `// eslint-disable-next-line @typescript-eslint/typedef` comment explaining why — annotating them with `ReturnType<typeof cva>` collapses cva's literal variant-key narrowing and breaks real call sites like `buttonVariants({ variant, size })`.
- `@typescript-eslint/no-unused-vars` (from recommendedTypeChecked) — also catches unused imports.
- Prettier runs as an actual ESLint rule via `eslint-plugin-prettier` (`prettier/prettier: "error"`), governed by an explicit `.prettierrc.json` (semi, double quotes, `trailingComma: "all"`, 80-col width, 2-space tabs, LF) and `.prettierignore` (`dist`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) rather than Prettier's implicit defaults.

`pnpm build` runs `eslint .` first as a hard gate before `tsup`/Tailwind — any violation of the above fails the build.

### Theme system (`src/theme/`)

A token-driven, framework-agnostic theme, independent of Tailwind's own config, that both React components and raw CSS can consume. Full pipeline, in order:

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

- The full theme shape is `CoreUIXTheme` in `theme/models/Theme.ts`. Adding a new token _within an existing section_: add the key there and give it a default in the matching `theme/tokens/*.ts` file — no other file needs to change. Note `generateCssVariables.ts`'s `flattenTheme`/`SECTION_CSS_PREFIX` is actually a hand-enumerated per-section list, not a generic `Object.entries` walk; this holds for every section except `flex`, which is deliberately omitted (its tokens are pre-composed Tailwind class strings, consumed directly in variant files, not meaningful as CSS variable values). Adding a whole new top-level theme _section_ does require adding it to `flattenTheme`/`SECTION_CSS_PREFIX` by hand.
- `ThemeProvider` (`"use client"`) takes an optional `theme` prop (`DeepPartial<CoreUIXTheme>`), builds the merged theme once via `useMemo`, provides it through context, and pushes it to the DOM as `--cuix-*` custom properties in a `useEffect`.
- Components should consume theme values either via CSS (`var(--cuix-colors-primary)`, as `button.variants.ts` does with literal `bg-[var(--cuix-colors-primary)]` classes) or via `useTheme()` in React — both stay in sync since they derive from the same merged object.
- `tailwind.config.ts` maps semantic Tailwind color/radius/spacing/shadow/etc. names (`bg-primary`, `text-muted-foreground`, ...) directly to the same `--cuix-*` variables, and `src/styles.css` defines the actual `:root` / `.dark` variable values. New components should prefer the `--cuix-*`-var-driven pattern (`button`, `badge`, `card`) over bare Tailwind semantic classes (`bg-card`, `text-muted-foreground`) — the latter bypasses `useTheme()`/runtime overrides.
- `tailwind.config.ts` is also published (`./tailwind.config` export) as an optional preset for consumers who want the same design tokens in their own custom components; Tailwind ignores its `content` field when used as a preset, so it's only present here to satisfy this repo's own linting.

### Utilities (`src/utils/`)

- `cn.ts` — `clsx` + `tailwind-merge` class combiner, used by every component.
- `createVariants.ts` — thin re-export of `cva` (`class-variance-authority`), used to define per-component variant maps.
- `deepMerge.ts` — recursive plain-object merge; the theme system's `mergeTheme` is built on this.

### Hooks (`src/hooks/`)

- `use-mobile.tsx` — `useIsMobile()`, an SSR-safe `matchMedia`-backed hook (lazy `useState` initializer, no synchronous `setState` in the effect body). Imported via `@hooks/use-mobile`. Used internally by `layout/sidebar`'s `SidebarProvider` to switch between the desktop and mobile (`Sheet`-based) sidebar rendering.

## Husky / lint-staged

`lint-staged` runs `eslint --fix` + `prettier --write` on staged `.ts`/`.tsx` (and `prettier --write` on `.js/.cjs/.mjs/.json/.md/.css`) via a Husky pre-commit hook, and blocks the commit if lint errors remain. `.husky/pre-commit` (running `npx lint-staged`) is tracked in git, so the hook is active for anyone who installs. `package.json` has a `"prepare": "husky && npm run build"` script, so `pnpm install` **does** install the Husky hook and run a full build automatically — unlike a typical library where install is side-effect-free.
