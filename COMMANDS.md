# Commands

Quick reference for developing, building, and releasing `@coreuix/ui`.

## Setup

```bash
pnpm install          # installs deps only — no lifecycle scripts run
pnpm husky:init       # one-time: installs the Husky pre-commit hook (contributors only)
```

There is deliberately **no** `prepare`/`postinstall`/`install` script in `package.json`.
pnpm (v9+) treats any of those as a "build script" and refuses to run them for a
git-hosted dependency unless the _consumer_ explicitly allowlists the package in their own
`pnpm-workspace.yaml` (`onlyBuiltDependencies`) — it fails the whole `pnpm add
<git-url>` outright (`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`) rather than skipping quietly.
This package is distributed via the npm registry / tarball (see "Ship it to another
project" below), not via git-based installs, so no consumer ever needs that script to run
— but keeping it out of `package.json` entirely means installing this repo by git URL by
accident (e.g. before reading the docs) fails fast instead of silently misbehaving on some
package managers and not others. Run `pnpm husky:init` manually once after cloning this
repo to develop it; it never runs for anyone who installs `@coreuix/ui` as a dependency.

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

Commits are also gated by a Husky pre-commit hook (`.husky/pre-commit`) that
runs `lint-staged` — see `README.md` → "Linting & formatting".

## Build

```bash
pnpm build            # tsup -> dist/ (ESM + CJS + .d.ts) + dist/styles.css
```

## Add a new shadcn component

```bash
pnpm exec shadcn add <name>         # e.g. pnpm exec shadcn add dialog
```

Don't use `pnpm add <name>` for this — `pnpm add` is pnpm's own built-in
"install a package" command and always wins over the `"add": "shadcn add"`
script in `package.json`, so it silently installs an unrelated real npm
package with that name instead of running shadcn.

Then move the generated file into its own folder under a category and add a
local barrel (see `README.md` → "Adding more shadcn components" for the exact
steps and current categories: `primitives/`, `layout/`).

## Ship it to another project

```bash
pnpm build                                   # dist/ is gitignored — always build first
pnpm pack                                    # -> coreuix-ui-<version>.tgz, install that tarball elsewhere
pnpm link --global                           # then `pnpm link --global @coreuix/ui` in the other project
```

Installing directly from a git URL is **not supported** — `dist/` isn't committed (see
"Setup" above for why), so a git checkout has no built output. Use the npm registry
(below) or a packed tarball instead.

## Release a new version

```bash
# bump "version" in package.json first, then:
pnpm build                          # dist/ is gitignored, not committed — build right before publishing
npm publish                         # bundles dist/ into the tarball via the "files" field, regardless of git
git add -A                          # commit everything except dist/ (still gitignored)
git commit -m "Release vX.Y.Z"
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin main --tags        # once a remote is configured
```

## Useful checks

```bash
git status                          # what's uncommitted
git log --oneline --decorate        # commit history + tags
git tag                             # list all release tags
```
