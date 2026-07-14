# @coreuix/ui

Shared component library for CoreUIX, built on shadcn/ui + Tailwind CSS.

## Structure

- `src/components/<category>/<name>/` — each component lives in its own folder (e.g. `src/components/primitives/button/button.tsx`), with a local `index.ts` barrel (`export * from "./button"`). Co-locating a component's tests/stories/types alongside it later is a drop-in, not a restructure.
- `src/components/<category>/index.ts` — aggregates every component barrel within that category (e.g. `primitives/index.ts` re-exports `button` and `badge`).
- `src/components/index.ts` — aggregates every category barrel; this is the only file that changes when a whole new category is introduced.
- `src/lib/` — shared utilities (`cn`, etc).
- `src/index.ts` — the package's public API (barrel export), re-exports `src/components` and `src/lib/utils`.
- `dist/` — build output from `tsup`, this is what gets published/consumed. **Gitignored, not committed** — `npm pack`/`npm publish` bundle it into the tarball directly off disk via the `"files"` field in `package.json`, independent of git tracking, so it never needs to live in git history. Run `pnpm build` locally before packing/publishing — see "Using it in another project" below.

Current categories:

- `primitives/` — atoms with no internal composition (`button`, `badge`)
- `layout/` — structural components (`card`)

Add new categories (`overlay/`, `form/`, `feedback/`, ...) as components arrive that fit them — don't pre-create empty ones.

## Developing

```bash
pnpm install
pnpm husky:init      # one-time: installs the Husky pre-commit hook
```

`husky:init` is a manual step, not an automatic `prepare` script — pnpm (v9+) refuses to
run `prepare`/`postinstall` for a git-hosted dependency unless a consumer explicitly
allowlists it, so this package intentionally ships with no lifecycle scripts at all (see
`COMMANDS.md` → "Setup" for the full explanation).

## Linting & formatting

```bash
pnpm lint            # eslint .
pnpm lint:fix        # eslint . --fix
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .
```

Once `pnpm husky:init` has been run, a Husky pre-commit hook runs `lint-staged` on
every commit: staged `.ts`/`.tsx` files are auto-fixed with ESLint and formatted with
Prettier, and the commit is blocked if lint errors remain unresolved. VS Code users get
the same checks live via the recommended extensions in `.vscode/extensions.json`.

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
echo 'export * from "./<name>";' > src/components/<category>/<name>/index.ts
```

Then re-export it from `src/components/<category>/index.ts` (create that file if the
category is new, and add `export * from "./<category>";` to `src/components/index.ts`).

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
