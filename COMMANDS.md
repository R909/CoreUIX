# Commands

Quick reference for developing, building, and releasing `@coreuix/ui`.

## Setup

```bash
pnpm install          # installs deps AND runs "prepare": husky install + a full pnpm build
```

`package.json` has `"prepare": "husky && npm run build"`, so `pnpm install` in this repo
has real side effects, unlike a typical library: it installs the Husky git hooks
(`.husky/pre-commit`, tracked in git) and runs a full `pnpm build`, producing `dist/`.
There is no separate manual init step — cloning and running `pnpm install` is enough to
get a working `dist/` and an active pre-commit hook.

Note this only applies to developing this repo directly. If you instead try to install
`@coreuix/ui` itself as a git dependency from another project, pnpm (v9+) blocks
`prepare`/`postinstall`/etc. for _any_ git-hosted dependency by default
(`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`) unless the consumer explicitly allowlists it in
their own `pnpm-workspace.yaml` — one more reason installing this package via a bare git
URL isn't a supported path; see "Ship it to another project" below.

## Typecheck

```bash
pnpm typecheck        # tsc --noEmit
```

## Lint & format

```bash
pnpm lint             # eslint .
pnpm lint:fix         # eslint . --fix
pnpm format           # prettier --write .
pnpm format:check     # prettier --check .
```

Beyond the standard recommended/React/jsx-a11y/Prettier presets, `eslint.config.js`
enforces explicit function return types (`@typescript-eslint/explicit-function-return-type`),
explicit types on every variable declaration and destructuring pattern
(`@typescript-eslint/typedef`), a ban on relative imports and the `@/*` catch-all in favor
of `@components/*`/`@theme/*`/`@utils/*`/`@hooks/*` (`no-restricted-imports`), and
unused-import/-variable detection (`@typescript-eslint/no-unused-vars`). Prettier runs as
a real lint rule (`eslint-plugin-prettier`), governed by an explicit `.prettierrc.json`
and `.prettierignore` rather than Prettier's implicit defaults.

Commits are also gated by a Husky pre-commit hook (`.husky/pre-commit`, tracked in git,
active for anyone who has run `pnpm install` — see "Setup" above) that runs
`lint-staged` — see `README.md` → "Linting & formatting".

## Path aliases

`tsconfig.json` (mirrored in `components.json`) maps `@components/*` → `src/components/*`,
`@theme/*` → `src/theme/*`, `@utils/*` → `src/utils/*`, `@hooks/*` → `src/hooks/*`. The
catch-all `@/*` → `src/*` also exists in `tsconfig.json` but isn't used by convention and
is banned by the `no-restricted-imports` lint rule above.

## Build

```bash
pnpm build            # eslint . && tsup -> dist/ (ESM + CJS + .d.ts) && tailwindcss -> dist/styles.css
```

`pnpm build` runs ESLint first as a hard gate (`eslint . && tsup && tailwindcss ...`) —
any lint violation (a relative import, a missing return-type annotation, an untyped
variable, an unformatted file) fails the build before `tsup`/Tailwind ever run.

## Add a new shadcn component

```bash
pnpm exec shadcn add <name>         # e.g. pnpm exec shadcn add dialog
```

Don't use `pnpm add <name>` for this — `pnpm add` is pnpm's own built-in
"install a package" command and always wins over the `"add": "shadcn add"`
script in `package.json`, so it silently installs an unrelated real npm
package with that name instead of running shadcn.

Then move the generated file into its own folder under a category and add a
local barrel that re-exports through the aliased path, e.g.
`echo 'export * from "@components/<category>/<name>/<name>";' > src/components/<category>/<name>/index.ts`
— a relative `"./<name>"` re-export here is banned by lint (see "Lint & format" above).
See `README.md` → "Adding more shadcn components" for the exact steps and current
categories: `primitives/`, `layout/` (`form/` hasn't been started yet).

## Ship it to another project

```bash
pnpm build                                   # dist/ is gitignored — always build first
pnpm pack                                    # -> coreuix-ui-<version>.tgz, install that tarball elsewhere
pnpm link --global                           # then `pnpm link --global @coreuix/ui` in the other project
```

Installing directly from a git URL is **not supported** — `dist/` isn't committed, so a
git checkout has no built output. Even if it were, pnpm (v9+) blocks
`prepare`/`postinstall` scripts for git-hosted dependencies by default
(`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`) unless the consumer allowlists the package in
their own `pnpm-workspace.yaml`, so a build-on-install couldn't happen automatically
anyway. Use the npm registry (below) or a packed tarball instead.

## Release a new version

```bash
# bump "version" in package.json first, then:
pnpm build                          # dist/ is gitignored, not committed — build right before publishing
npm publish                         # bundles dist/ into the tarball via the "files" field, regardless of git
git add -A                          # commit everything except dist/ (still gitignored)
git commit -m "Release vX.Y.Z"
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin master --tags      # once a remote is configured
```

## Useful checks

```bash
git status                          # what's uncommitted
git log --oneline --decorate        # commit history + tags
git tag                             # list all release tags
```
