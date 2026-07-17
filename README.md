# @coreuix/ui

Shared component library for CoreUIX, built on shadcn/ui + Tailwind CSS.

## Structure

- `src/components/<category>/<name>/` — each component lives in its own folder (e.g. `src/components/primitives/button/button.tsx`), with a local `index.ts` barrel that re-exports through the aliased path (`export * from "@components/primitives/button/button"` — relative imports are banned by lint, see "Linting & formatting" below). Co-locating a component's tests/stories/types alongside it later is a drop-in, not a restructure.
- `src/components/<category>/index.ts` — aggregates every component barrel within that category (e.g. `primitives/index.ts` re-exports `button`, `badge`, `input`, `label`, `textarea`).
- `src/components/index.ts` — aggregates every category barrel; this is the only file that changes when a whole new category is introduced.
- `src/utils/` — shared utilities (`cn`, `createVariants`, `deepMerge`).
- `src/hooks/` — shared React hooks (e.g. `use-mobile.tsx` / `useIsMobile`), imported via the `@hooks/*` alias.
- `src/index.ts` — the package's public API (barrel export), re-exports `src/components`, `src/utils`, and `src/theme`.
- `dist/` — build output from `tsup`, this is what gets published/consumed. **Gitignored, not committed** — `npm pack`/`npm publish` bundle it into the tarball directly off disk via the `"files"` field in `package.json`, independent of git tracking, so it never needs to live in git history. Run `pnpm build` locally before packing/publishing — see "Using it in another project" below.

Current categories:

- `primitives/` — atoms with no internal composition: `button`, `badge`, `input`, `label`, `textarea`, `toggle`, `checkbox`, `text`, `tabs`, `select`, `command` (built on `cmdk`, not Radix), `popover`, and `multi-select` (composes `popover` + `command` + `button` + `badge`; the one primitive with no underlying Radix primitive, so it tracks selection state via its own `MultiSelectContext` instead)
- `layout/` — structural components (`card`, `table` — static Table/TableHeader/TableBody/TableFooter/TableRow/TableHead/TableCell/TableCaption with no sorting/filtering/pagination logic of its own, and a much larger `sidebar/` set — `SidebarProvider`, `Sidebar`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`, the `SidebarGroup*`/`SidebarMenu*` families, a `useSidebar` hook, plus sibling primitives it depends on: `separator`, `sheet`, `skeleton`, `tooltip`)
- `form/` hasn't been started yet — don't add it until components arrive that fit.

Add new categories (`overlay/`, `form/`, `feedback/`, ...) as components arrive that fit them — don't pre-create empty ones.

## Developing

```bash
pnpm install
```

`pnpm install` runs the `prepare` script automatically, which runs `husky` (installs the
git hooks, including the pre-commit hook below) **and** a full `pnpm build` — so, unlike a
typical library, installing this repo's own deps has real side effects: it builds `dist/`
and wires up Husky in one step. There is no separate manual init command to run.

## Linting & formatting

```bash
pnpm lint            # eslint .
pnpm lint:fix        # eslint . --fix
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .
```

`pnpm build` itself runs `eslint .` first, as a gate — the full command is
`eslint . && tsup && tailwindcss ...`, so any lint violation (a relative import,
a missing return-type annotation, an untyped variable/destructure, an unformatted
file) fails the build before any compilation happens. Beyond the standard
recommended/React/jsx-a11y/Prettier presets, `eslint.config.js` also enforces:

- `@typescript-eslint/explicit-function-return-type` — every function/method needs a declared return type.
- `@typescript-eslint/typedef` — every variable declaration and destructuring pattern needs an explicit type annotation.
- `no-restricted-imports` — relative imports (`./`, `../`) and the catch-all `@/*` alias are banned repo-wide; use the category-scoped aliases `@components/*`, `@theme/*`, `@utils/*`, `@hooks/*` instead, even for a barrel re-exporting its own sibling file.
- `@typescript-eslint/no-unused-vars` — also catches unused imports.
- Prettier runs as a real ESLint rule (`eslint-plugin-prettier`), not just a separate `prettier --check` step; formatting is defined explicitly in `.prettierrc.json` (semicolons, double quotes, trailing commas, 80-col width, 2-space tabs, LF) and `.prettierignore` (`dist`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`).

Since `pnpm install` already runs `prepare` (see "Developing" above), the Husky
pre-commit hook (`.husky/pre-commit`, tracked in git) is active for anyone who installs
this repo. It runs `lint-staged` on every commit: staged `.ts`/`.tsx` files are
auto-fixed with ESLint and formatted with Prettier (other staged `.js`/`.cjs`/`.mjs`/
`.json`/`.md`/`.css` files are formatted with Prettier only), and the commit is blocked
if lint errors remain unresolved.

## Path aliases

`tsconfig.json` (mirrored in `components.json`) maps `@components/*` → `src/components/*`,
`@theme/*` → `src/theme/*`, `@utils/*` → `src/utils/*`, and `@hooks/*` → `src/hooks/*`.
A catch-all `@/*` → `src/*` also exists but isn't used by convention and is actively
banned by the `no-restricted-imports` lint rule above — always prefer the category-scoped
alias that matches where the target file lives.

## Adding more shadcn components

```bash
pnpm exec shadcn add button
```

Don't use `pnpm add button` for this — `pnpm add` is pnpm's own built-in
"install a package" command and always wins over the `"add": "shadcn add"`
script in `package.json`, so it silently installs an unrelated real npm
package named `button` instead of running shadcn.

shadcn drops the generated file flat into `src/components/<name>.tsx`. Move it into
its own folder under the right category and add a local barrel:

```bash
mkdir -p src/components/<category>/<name>
mv src/components/<name>.tsx src/components/<category>/<name>/<name>.tsx
echo 'export * from "@components/<category>/<name>/<name>";' > src/components/<category>/<name>/index.ts
```

Then re-export it from `src/components/<category>/index.ts` (create that file if the
category is new, and add `export * from "@components/<category>";` to
`src/components/index.ts`).

## Building the library

```bash
pnpm build
```

Outputs ESM + CJS + type declarations to `dist/`, plus a fully compiled
`dist/styles.css` (run through the real Tailwind CLI against this repo's own
`tailwind.config.ts`, not just copied — see "Using it in another project"
below for why that matters).

## Using it in another project

This repo _is_ `@coreuix/ui` — there's no monorepo wrapper and no consumer
app here. To use it from another project, you have a few options:

**A. Published to a registry** (recommended — public npm or a private one):

```bash
# from this repo, once per release:
pnpm build
npm publish              # or `npm publish --access public` for a scoped package's first publish

# in the other project
pnpm add @coreuix/ui
```

This is the only method covered here that ships a _built_ package without
requiring the consumer's package manager to run any script — `npm
pack`/`npm publish` bundle `dist/` into the tarball straight off disk (via
the `"files"` field), independent of git, so `dist/` never needs to be
committed. It also sidesteps pnpm's git-dependency build-script restriction
entirely (see below).

**B. Pack it and install the tarball** — for a separate, unrelated repo/project
without publishing anywhere:

```bash
# from this repo
pnpm build                    # dist/ is gitignored — build it first
pnpm pack                     # produces coreuix-ui-0.1.0.tgz

# in the other project
pnpm add /path/to/coreuix-ui-0.1.0.tgz
```

**C. Local development across two repos** — symlink it in:

```bash
# in this repo
pnpm build
pnpm link --global

# in the other project
pnpm link --global @coreuix/ui
```

**Not supported: installing directly from a git URL.** `dist/` is
intentionally gitignored (not committed), so a bare git checkout has no
built output for a consumer to use. Building it automatically on install
would require a `prepare`/`postinstall` script, but pnpm (v9+) hard-blocks
`preinstall`/`install`/`postinstall`/`prepare` scripts for _any_ git-hosted
dependency by default (`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`) unless the
consumer explicitly allowlists the package in their own
`pnpm-workspace.yaml` — so this path can't be made to work out of the box
across package managers. Use option A or B instead.

Whichever route you use, then in the consuming project:

```tsx
import { Button, Card, CardContent, Badge } from "@coreuix/ui";
import "@coreuix/ui/styles.css"; // once, e.g. in your root layout
```

That's it — `dist/styles.css` is fully compiled at build time (not just a raw
`@tailwind` directive file), so every variant/size class every component uses
(`bg-primary`, `bg-destructive`, `hover:bg-secondary/80`, etc.) already has
real CSS behind it. **You do not need your own Tailwind `content` config to
point at `node_modules/@coreuix/ui` for the shipped components to render
correctly** — that used to be required and was a common source of "the
component renders but `variant`/`size` do nothing" bugs.

Extending the shared Tailwind preset is still available, but now purely
**optional** — only needed if you want to use the same design tokens
(`bg-primary`, `text-muted-foreground`, etc.) in _your own_ custom components:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import uiPreset from "@coreuix/ui/tailwind.config";

export default {
  presets: [uiPreset],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
} satisfies Config;
```
