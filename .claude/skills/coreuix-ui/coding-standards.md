# Coding standards

## TypeScript

`tsconfig.json`:

- `target: ES2020`, `module: esnext`, `moduleResolution: bundler`
- `strict: true`, `isolatedModules: true`, `jsx: preserve`
- `baseUrl: "."` with five path aliases: `@/*` -> `./src/*` (catch-all, **not used
  by convention** — see "Import conventions" below), `@theme/*` -> `./src/theme/*`,
  `@components/*` -> `./src/components/*`, `@utils/*` -> `./src/utils/*`, and
  `@hooks/*` -> `./src/hooks/*` (backing `src/hooks/use-mobile.tsx`'s
  `useIsMobile()`). These mirror the `aliases` block in `components.json`, which the
  shadcn CLI reads when scaffolding.
- `tsconfig.build.json` extends it with `incremental: false` for the tsup build

`pnpm typecheck` runs `tsc --noEmit` against the base config (includes all
`.ts`/`.tsx`, excludes `node_modules`/`dist`).

## ESLint

Flat config (`eslint.config.js`), built from:

- `js.configs.recommended`
- `tseslint.configs.recommendedTypeChecked` (type-aware linting — parser uses
  `parserOptions.project: "./tsconfig.json"` with `tsconfigRootDir:
import.meta.dirname`). This preset already includes
  `@typescript-eslint/no-unused-vars`, so unused imports/variables are lint errors
  without any repo-specific override needed.
- `react.configs.flat.recommended` + `react.configs.flat["jsx-runtime"]`
  (automatic JSX runtime, so no `import React` needed just to use JSX)
- `eslint-plugin-react-hooks` recommended rules (`reactHooks.configs.flat.recommended.rules`)
- `jsx-a11y.flatConfigs.recommended`
- `eslint-plugin-prettier/recommended` (**not** `eslint-config-prettier` alone) —
  this composes `eslint-config-prettier`'s conflict-disabling _and_ turns on
  `"prettier/prettier": "error"`, so Prettier formatting violations are themselves
  ESLint errors, not just a separate `prettier --check` concern.

Repo-specific rule overrides (`**/*.{ts,tsx}`):

- `"react/prop-types": "off"` — TypeScript prop types are the source of truth.
- `"@typescript-eslint/consistent-type-imports": "warn"` — prefer `import type` for
  type-only imports; every existing file follows this.
- `"@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }]`
  — every function and method declaration must state its return type explicitly.
  `allowExpressions: true` means a bare arrow function passed as a callback
  argument (e.g. `.map((x) => x.id)`) doesn't need one, but a `function` declaration
  or a named `const` holding an arrow function does, e.g.:

  ```ts
  function useTheme(): CoreUIXTheme { ... }
  const Comp: React.ElementType = asChild ? Slot : "button";
  const onChange: () => void = (): void => setIsMobile(...);
  ```

- `"@typescript-eslint/typedef"` (error) with `variableDeclaration`,
  `memberVariableDeclaration`, `propertyDeclaration`, `arrayDestructuring`, and
  `objectDestructuring` all `true` — **every** variable declaration needs an
  explicit type annotation. This reaches further than most repos' style guides:
  - Destructured `useState` tuples need the full tuple type spelled out:
    ```ts
    const [isMobile, setIsMobile]: [
      boolean,
      React.Dispatch<React.SetStateAction<boolean>>,
    ] = React.useState<boolean>(getIsMobile);
    ```
  - Destructured props inside a `React.forwardRef` callback need the prop type
    written directly on the destructured parameter, not just inferred from the
    `forwardRef<Ref, Props>` generic:
    ```ts
    React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, variant, size, asChild = false, ...props }: ButtonProps, ref) => { ... }
    );
    ```
  - **The one deliberate exception**: `cva(...)` variant exports (e.g.
    `buttonVariants`, `badgeVariants`, `sidebarMenuButtonVariants`) are left
    uninferred and silenced with a targeted comment immediately above the export:
    ```ts
    // eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers like `buttonVariants({ variant, size })`.
    export const buttonVariants = cva(...)
    ```
    Annotating these with `ReturnType<typeof cva>` (or any other explicit type)
    widens the return type away from the call's literal variant-key union, which
    breaks every caller that invokes it with a specific variant/size. See
    `examples.md` for a full worked instance of this pattern.
- `"no-restricted-imports": "error"` with two `patterns` entries:
  - `group: ["./*", "../*"]` — bans every relative import, including a barrel
    importing its own sibling file in the same folder.
  - `group: ["@/*"]` — bans the catch-all alias too, even though it's a valid
    `tsconfig.json` path mapping; the message directs authors to the
    category-scoped aliases instead.
    Always import via `@components/*`, `@theme/*`, `@utils/*`, `@hooks/*`.

`eslint.config.js` itself is exempted from type-aware linting
(`tseslint.configs.disableTypeChecked`) since it isn't part of the TS project.

`pnpm lint` / `pnpm lint:fix` run `eslint .` / `eslint . --fix`. `pnpm build`'s
script is `eslint . && tsup && tailwindcss ...` — a lint failure blocks the build
entirely, before `tsup`/`tailwindcss` ever run.

## Prettier

**A real `.prettierrc.json` now exists** at the repo root (this doc previously
claimed otherwise — that claim is stale). Its settings:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

i.e. semicolons required, double quotes, trailing commas everywhere valid, 80-char
line width, 2-space indent, LF line endings. This is also enforced as an ESLint
rule (`"prettier/prettier": "error"` via `eslint-plugin-prettier/recommended` — see
the ESLint section above), so an unformatted file fails `pnpm lint` and `pnpm
build`, not just `pnpm format:check`.

`pnpm format` / `pnpm format:check` run `prettier --write .` / `prettier --check .`.

## Husky / lint-staged

Verified current state (re-check `package.json`/`.gitignore`/`git ls-files` directly
if it's been a while, since these are exactly the kind of claims that drift):

- `.husky/pre-commit` **exists and is tracked in git**, containing `npx lint-staged`.
- `package.json` has a `"lint-staged"` block: `eslint --fix` + `prettier --write` on
  staged `.ts`/`.tsx`, and `prettier --write` on staged
  `.js`/`.cjs`/`.mjs`/`.json`/`.md`/`.css`.
- `package.json` has `"prepare": "husky && npm run build"`. This **does** run
  automatically on `pnpm install` in this repo — it installs the Husky hooks and
  builds `dist/` (running the `eslint . && tsup && tailwindcss ...` build script) in
  one step. Unlike a typical library, `pnpm install` here is not side-effect-free.
- `dist/` **is** listed in `.gitignore` and has zero files tracked in git — it is a
  local build artifact only, never committed.

Note: `CLAUDE.md` (repo root) is the up-to-date canonical source for these facts;
if any other doc in the repo (`README.md`, `COMMANDS.md`) still disagrees with the
above, treat this file's and `CLAUDE.md`'s statements as correct and flag the
other doc as stale rather than propagating its claim.

## Import conventions

- Always use the category-scoped alias that matches where the target file lives —
  `@components/*`, `@theme/*`, `@utils/*`, `@hooks/*` — never a relative path and
  never the bare `@/*` catch-all, both of which are `no-restricted-imports` ESLint
  errors (e.g. `@components/primitives/button/button.variants`, not
  `../../button/button.variants` and not `@/components/primitives/button/button.variants`).
  This applies even within a single folder — a component's own `index.ts` imports
  its sibling `.tsx` file via the full `@components/...` path, not `"./button"`.
- `import type { X } from "..."` for type-only imports, matching
  `@typescript-eslint/consistent-type-imports`.
- Named exports only — no default exports anywhere in `src/`.
