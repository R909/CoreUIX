# Coding standards

## TypeScript

`tsconfig.json`:

- `target: ES2020`, `module: esnext`, `moduleResolution: bundler`
- `strict: true`, `isolatedModules: true`, `jsx: preserve`
- `@/*` -> `./src/*` path alias
- `tsconfig.build.json` extends it with `incremental: false` for the tsup build

`pnpm typecheck` runs `tsc --noEmit` against the base config (includes all
`.ts`/`.tsx`, excludes `node_modules`/`dist`).

## ESLint

Flat config (`eslint.config.js`), built from:

- `js.configs.recommended`
- `tseslint.configs.recommendedTypeChecked` (type-aware linting — parser uses
  `projectService: true`)
- `react.configs.flat.recommended` + `react.configs.flat["jsx-runtime"]`
  (automatic JSX runtime, so no `import React` needed just to use JSX)
- `eslint-plugin-react-hooks` recommended rules
- `jsx-a11y` recommended rules
- `eslint-config-prettier` last, to disable any formatting rules that would
  conflict with Prettier

Repo-specific rule overrides (`**/*.{ts,tsx}`):

- `"react/prop-types": "off"` — TypeScript prop types are the source of truth.
- `"@typescript-eslint/consistent-type-imports": "warn"` — prefer `import type` for
  type-only imports; every existing file follows this.

`eslint.config.js` itself is exempted from type-aware linting
(`tseslint.configs.disableTypeChecked`) since it isn't part of the TS project.

`pnpm lint` / `pnpm lint:fix` run `eslint .` / `eslint . --fix`.

## Prettier

**No `.prettierrc`, `.prettierrc.json`, `.prettierrc.js`, or `prettier.config.*`
file exists anywhere in the repo.** Formatting is 100% Prettier's built-in defaults
(2-space indent, double quotes, trailing commas where valid, etc. — whatever the
installed Prettier version defaults to). Every file in the repo was written to match
those defaults; don't introduce a config file that would reformat the whole tree
without discussing it first.

`pnpm format` / `pnpm format:check` run `prettier --write .` / `prettier --check .`.

## Husky / lint-staged

Verified current state (check these directly rather than trusting a doc file — see
"Documentation drift" below):

- `.husky/pre-commit` **exists and is tracked in git**, containing `npx lint-staged`.
- `package.json` has a `"lint-staged"` block: `eslint --fix` + `prettier --write` on
  staged `.ts`/`.tsx`, and `prettier --write` on staged
  `.js`/`.cjs`/`.mjs`/`.json`/`.md`/`.css`.
- `package.json` has `"prepare": "husky && npm run build"`. This **does** run
  automatically on `pnpm install` in this repo (verified by observing a full
  `tsup` + `tailwindcss` build fire during `pnpm install` in this working tree) —
  it installs the Husky hooks and builds `dist/` in one step. There is no separate
  `husky:init` script in `package.json`, despite `README.md`/`COMMANDS.md`
  referencing one.

## Documentation drift — verify before trusting

`CLAUDE.md`, `README.md`, and `COMMANDS.md` disagree with each other and, on some
points, with the actual repository state. Verified ground truth as of the last
check (re-verify if it's been a while, since these are exactly the kind of claims
that drift):

| Claim                           | `CLAUDE.md` says                                        | Actual repo state                                                                                      |
| ------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Is `dist/` committed to git?    | "committed to git (not gitignored)"                     | `.gitignore` line `dist/` ignores it; `git ls-files dist` returns zero files — it is **not** committed |
| Does a `prepare` script exist?  | "There is no `prepare` script... intentionally removed" | `package.json` has `"prepare": "husky && npm run build"`, and it does run on `pnpm install`            |
| Is `.husky/pre-commit` tracked? | "not currently tracked in git"                          | `git ls-files .husky/pre-commit` shows it **is** tracked                                               |

`README.md`/`COMMANDS.md` independently claim `dist/` is gitignored (correct) but
also reference a `pnpm husky:init` script that does not exist in `package.json`.

Don't propagate any of these specific claims into new work without re-checking
`package.json`/`.gitignore`/`git ls-files` yourself first — and if you're asked to
touch these docs, fixing this drift is a reasonable thing to flag to the user before
doing it, since it's a separate concern from whatever feature/component task
prompted you to open the file.

## Import conventions

- Always `@/*` for internal imports, never deep relative paths across
  component/category boundaries (e.g. `@/components/primitives/button/button.variants`,
  not `../../button/button.variants`).
- `import type { X } from "..."` for type-only imports, matching
  `@typescript-eslint/consistent-type-imports`.
- Named exports only — no default exports anywhere in `src/`.
