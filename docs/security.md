# Security

This is a UI component library, not a service — the relevant risk surface is: what a consuming
app can be exposed to by using this package, and what the supply chain (dependencies, install,
publish) can do. This doc records the current posture and what to watch for when changing things.

## No unsafe DOM injection

- No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `new Function` anywhere in `src/`
  (verified by grep; re-check this if you add anything that renders raw strings as markup).
- The only direct DOM write in the library is `theme/utils/applyTheme.ts`, which calls
  `document.documentElement.style.setProperty(name, value)` for each `--cuix-*` variable. This
  writes CSS custom-property values, not markup — it cannot execute scripts or inject HTML, so
  it is not an XSS vector in the traditional sense.

## Theme override input is not sanitized — treat it as trusted

`ThemeProvider`'s `theme` prop (`DeepPartial<CoreUIXTheme>`) flows through `mergeTheme` →
`normalizeTheme` → `generateCssVariables` → `applyTheme` with no validation beyond
`normalizeTheme`'s shorthand-hex expansion. Implications:

- If a consuming app passes **user-controlled** values into `theme` (e.g. a color picker backed
  by unescaped user input), a malformed value gets written as a CSS custom property value. CSS
  custom properties are not parsed as executable code, so this is a robustness/rendering-breakage
  risk, not a script-injection risk — but it's still worth flagging in review if you see a PR
  wiring untrusted input directly into `theme`.
- This library does not attempt to validate/sanitize theme values itself and shouldn't need to —
  that's a consumer-side concern for whatever generates the override object. Don't add validation
  here speculatively; it's not a demonstrated need.

## `asChild` / Radix `Slot` prop passthrough

`Button` and `Badge` spread `...props` onto whatever element `asChild` resolves to (see
[api-patterns.md](./api-patterns.md#aschild-for-polymorphism)). This is standard React prop
spreading — it doesn't introduce injection risk on its own, but as with any spread API, avoid
ever spreading values sourced from unsanitized user input as attribute names/values in consumer
code (a pre-existing React-level concern, not specific to this library).

## Supply chain / install-time execution

- `package.json`'s `"prepare": "husky && npm run build"` script means `pnpm install` **does**
  run lifecycle scripts here, deliberately: it installs the Husky pre-commit hook and runs a
  full `pnpm build` for every clone/install. This is a real departure from a typical
  side-effect-free library install — anyone running `pnpm install` on this repo executes
  `eslint`, `tsup`, and `tailwindcss` locally. Because `pnpm build` itself is
  `eslint . && tsup && tailwindcss ...`, a lint error in the working tree at install time will
  fail the `prepare` step.
- `dist/` is **gitignored**, not committed. There is currently no CI and no publish workflow, so
  there is no working install path (git dependency, tarball, or registry) for an external
  consumer yet — `dist/` only exists locally after `pnpm build` runs (via `prepare` or
  manually). Don't assume a git-dependency install "just works" today; it doesn't produce a
  `dist/` on its own without lifecycle scripts enabled.
- Runtime dependencies (`@radix-ui/*`, `class-variance-authority`, `clsx`, `cmdk`, `lucide-react`,
  `tailwind-merge`, `tailwindcss-animate`) are all well-known, widely-used packages with no
  native/postinstall build steps. Before adding a new runtime dependency, check it doesn't
  introduce one.
- Since `pnpm install` now executes a full build (via `prepare`), treat `devDependencies` with
  the same install-time-execution scrutiny as `dependencies` — a compromised dev tool in the
  chain (ESLint plugin, tsup, Tailwind, Husky, Prettier) would run during `pnpm install`, not
  just during an explicit `pnpm build`/`pnpm lint` invocation.

## Husky / lint-staged as a quality gate, not a security gate

`lint-staged` runs `eslint --fix` + `prettier --write` on staged `.ts`/`.tsx` files (and
`prettier --write` on `.js/.cjs/.mjs/.json/.md/.css`) via a Husky pre-commit hook, and blocks the
commit if lint errors remain. `.husky/pre-commit` (running `npx lint-staged`) **is tracked in
git**, so this gate is active for anyone who clones and runs `pnpm install` — no separate manual
setup step is needed. This is a code-quality control, not a security control: ESLint here is not
configured with a security-focused ruleset (its rules are `explicit-function-return-type`,
`typedef`, `no-restricted-imports` for import-path hygiene, `no-unused-vars`, and Prettier
formatting) — don't rely on it to catch injection-class bugs.

## Publishing hygiene

- Before tagging a release: bump `version` in `package.json` and run `pnpm build`. Since `dist/`
  is gitignored, there's no `git diff` of build output to sanity-check — verify by re-running
  `pnpm build` locally and smoke-testing the emitted `dist/index.js`/`dist/index.cjs`/
  `dist/styles.css` directly instead.
- `package.json`'s `files` field (`dist`, `tailwind.config.ts`) controls what actually ships in
  the published tarball — review it if you add new top-level assets that should or shouldn't
  ship. There is currently no CI and no registry-publish workflow, so "publishing" today means
  producing a tarball or git dependency by hand.
- No secrets, tokens, or `.env` files are expected in this repo; `.gitignore` covers `.env*.local`.
  If you ever see a credential-shaped string staged for commit, stop and double-check before
  proceeding, per standard practice — this repo has no legitimate reason to contain one. As a
  general rule, keep `.env`/config files with secrets out of version control entirely (confirm
  they're covered by `.gitignore`, not just untracked by omission).

## Dependency updates

- `peerDependencies` (`react`, `react-dom` `>=18`, and `react-hook-form ^7`) are intentionally
  loose/version-ranged — this library doesn't bundle these, so it doesn't pin a consumer's
  installed version. `react-hook-form` is a peer (not a bundled `dependency`) specifically
  because its `FormProvider`/`useFormContext` rely on a singleton React context; bundling a
  second copy would risk a version mismatch with whatever the consumer already has installed —
  the same reasoning as `react`/`react-dom`. Runtime `dependencies` should still be kept current
  for upstream security patches; there's no automated dependency-update tooling configured in
  this repo currently, so updates are manual (`pnpm update` + `pnpm typecheck` + `pnpm build`).

## What's out of scope here

This library renders UI and manages a theme token pipeline — it has no network calls, no auth,
no data persistence, and no server-side code. Typical web-app security concerns (auth, session
handling, SSRF, injection into a backend) don't apply within this repo; they're the consuming
application's responsibility.
