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

- `package.json` currently has a `prepare` script (`husky && npm run build`). **Note:**
  CLAUDE.md documents this repo as intentionally having _no_ `prepare` script, since pnpm blocks
  lifecycle scripts by default and this was meant to keep `pnpm install` from silently building
  or installing hooks. The current `package.json` and CLAUDE.md have drifted out of sync — worth
  reconciling: either remove the `prepare` script to match the documented intent, or update
  CLAUDE.md if the script was added back deliberately. Either way, understand _why_ before
  changing it, since lifecycle scripts run arbitrary code for every consumer on `install`.
- `dist/` is committed to git rather than generated on install, specifically so consumers using a
  git-dependency install don't need any lifecycle script to run at all.
- Runtime dependencies (`@radix-ui/*`, `class-variance-authority`, `clsx`, `lucide-react`,
  `tailwind-merge`, `tailwindcss-animate`) are all well-known, widely-used packages with no
  native/postinstall build steps. Before adding a new runtime dependency, check it doesn't
  introduce one.

## Husky / lint-staged as a quality gate, not a security gate

`lint-staged` runs `eslint --fix` + `prettier --write` on staged files via a Husky pre-commit
hook and blocks the commit if lint errors remain. Note: `.husky/pre-commit` itself is **not
currently tracked in git** (only Husky's internal `.husky/_` machinery is) — if you need this
gate enforced, run `pnpm husky:init` and add a `pre-commit` script per CLAUDE.md. This is a code
-quality control, not a security control (ESLint here is not configured with a security-focused
ruleset) — don't rely on it to catch injection-class bugs.

## Publishing hygiene

- Before tagging a release: bump `version`, run `pnpm build`, review the `dist/` diff (a
  same-source-different-output diff usually means a stale/uncommitted source change or a build
  tool change — check both), commit, then tag.
- `package.json`'s `files` field (`dist`, `tailwind.config.ts`) controls what actually ships in
  the published tarball — review it if you add new top-level assets that should or shouldn't
  ship.
- No secrets, tokens, or `.env` files are expected in this repo; `.gitignore` covers `.env*.local`.
  If you ever see a credential-shaped string staged for commit, stop and double-check before
  proceeding, per standard practice — this repo has no legitimate reason to contain one.

## Dependency updates

- `peerDependencies` (`react`, `react-dom` `>=18`) are intentionally loose — this library doesn't
  pin a consumer's React version. Runtime `dependencies` should still be kept current for
  upstream security patches; there's no automated dependency-update tooling configured in this
  repo currently, so updates are manual (`pnpm update` + `pnpm typecheck` + `pnpm build`).

## What's out of scope here

This library renders UI and manages a theme token pipeline — it has no network calls, no auth,
no data persistence, and no server-side code. Typical web-app security concerns (auth, session
handling, SSRF, injection into a backend) don't apply within this repo; they're the consuming
application's responsibility.
