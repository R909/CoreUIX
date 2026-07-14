# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`@coreuix/ui` — a standalone, publishable shared component library (shadcn/ui + Tailwind + a custom token-based theme system). There is **no monorepo wrapper and no consumer app in this repo**; it's built and shipped via `dist/` for other projects to install (tarball, git dependency, or registry).

## Commands

```bash
pnpm install          # install deps (runs "prepare": husky install + full build — see "Husky" below)
pnpm build             # tsup -> dist/ (ESM + CJS + .d.ts) + tailwindcss -> dist/styles.css
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
echo 'export * from "./<name>";' > src/components/<category>/<name>/index.ts
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

Current categories: `primitives/` (button, badge, input, label, textarea, checkbox, switch, radio-group, avatar, separator, skeleton, toggle, progress, slider, aspect-ratio — atoms with no internal composition), `layout/` (card, accordion, tabs, collapsible, scroll-area — structural components), and `form/` (select, toggle-group, form — react-hook-form-aware composites). Don't pre-create empty categories; add them (`overlay/`, `feedback/`, ...) only as components arrive that fit.

`form/form` wraps [react-hook-form](https://react-hook-form.com/), which is a `peerDependency` (not a bundled `dependency`) — like `react`/`react-dom`, its `FormProvider`/`useFormContext` rely on a singleton React context, so bundling a second copy would risk a version mismatch with whatever the consuming app already uses.

Variant definitions (`cva`) live in a sibling `<name>.variants.ts` file, and prop types in `<name>.types.ts`, next to the component (see `button/`). `badge/` and `card/` follow the same split. `button/` and `badge/`'s barrels also re-export their `.variants`/`.types` files alongside the component (`export * from "./<name>.variants"`, `export * from "./<name>.types"`) — `input/`, `label/`, `textarea/`, and `card/` currently only re-export the component itself.

### Path alias

All internal imports use `@/*` -> `src/*` (defined in `tsconfig.json`, resolved at build time by tsup). Note: `components.json`'s `aliases` block (`@components`, `@utils`, `@hooks`, `@theme`) is only consumed by the **shadcn CLI** when scaffolding new files — it is not a real TypeScript path mapping. Don't rely on those aliases resolving in code; always use `@/...`.

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

## Husky / lint-staged

`lint-staged` runs `eslint --fix` + `prettier --write` on staged `.ts`/`.tsx` (and `prettier --write` on `.js/.cjs/.mjs/.json/.md/.css`) via a Husky pre-commit hook, and blocks the commit if lint errors remain. `.husky/pre-commit` (running `npx lint-staged`) is tracked in git, so the hook is active for anyone who installs. `package.json` has a `"prepare": "husky && npm run build"` script, so `pnpm install` **does** install the Husky hook and run a full build automatically — unlike a typical library where install is side-effect-free.
