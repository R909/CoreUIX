# System Patterns

Recurring design patterns used across the codebase. If you're adding a new component or theme
token, match these rather than inventing a new approach.

## 1. Barrel-export aggregation (three levels up)

Every component/module exports through a chain of `index.ts` barrels rather than being imported
by deep path from outside its folder:

```
<name>/<name>.tsx  →  <name>/index.ts  →  <category>/index.ts  →  components/index.ts  →  src/index.ts
```

Adding a component never requires touching more than: its own folder, its category barrel (if
new to that category), and — only for a brand-new category — `src/components/index.ts`. See
[folder-structure.md](./folder-structure.md).

## 2. Token → default → merge → context/DOM (the theme pipeline)

The theme system is the clearest example of a layered, single-direction data flow:

```
tokens (raw values) → defaultTheme (assembled) → createTheme (merge overrides) → CoreUIXTheme
                                                                                 ↙            ↘
                                                                    React context      DOM CSS variables
```

Adding a token **within an existing section** means adding one key to `theme/models/Theme.ts`
and one default to the matching `theme/tokens/*.ts` file — no other file changes.
`generateCssVariables.ts`'s `flattenTheme` is a hand-enumerated per-section list
(`FLAT_SECTIONS`/`SECTION_CSS_PREFIX`, plus `TYPOGRAPHY_SECTIONS` for nested `typography.*`
sub-sections), not a generic walk — it throws at runtime if a top-level `CoreUIXTheme` section
isn't accounted for in `FLAT_SECTIONS` or the deliberate `EXCLUDED_SECTIONS` list (currently just
`flex`, whose tokens are pre-composed Tailwind class strings, not CSS values). So adding a whole
new top-level theme **section** does require hand-wiring it into `flattenTheme` in
`generateCssVariables.ts`. See [modules/theme.md](./modules/theme.md).

## 3. `cva` for variants, split into a sibling file

Every styled component defines its variant classes with `class-variance-authority` (re-exported
as `createVariants` from `src/utils/createVariants.ts`) in a sibling `<name>.variants.ts` file,
not inline in the component. This keeps the component body focused on structure/behavior and
makes the variant map independently importable. Note: as of the current source, every component
barrel (`button`, `badge`, `input`, `label`, `textarea`, `toggle`, `checkbox`, `text`, `tabs`,
`select`, `command`, `popover`, `multi-select`, `card`, `table`) only re-exports the component's
own module, not the sibling `.variants.ts`/`.types.ts` files (`sidebar` is the exception) — see
[api-patterns.md](./api-patterns.md#exports-per-component) for what's actually reachable through
each barrel today.

A `cva(...)` call with a real `variants` map (e.g. `button`, `badge`, `toggle`, `text`) must stay
uninferred behind the `// eslint-disable-next-line @typescript-eslint/typedef` exemption — never
an explicit `ReturnType<typeof cva>` annotation, which widens the type and erases the literal
variant-key narrowing (`text.variants.ts`'s `textVariants` hit this exact regression: annotating
it made `VariantProps<typeof textVariants>` stop exposing `variant`/`color` at all). A `cva(...)`
call with **no** `variants` map at all (base classes only — `card`, `table`, `popover`'s
`popoverContentVariants`) is the one case where the explicit annotation is actually safe, since
there's no variant-key narrowing to lose.

## 4. `asChild` + Radix `Slot` for polymorphic rendering

`Button` and `Badge` both accept an `asChild?: boolean` prop. When true, the component renders
via Radix's `<Slot>` instead of its default element (`<button>`, `<span>`), merging its own
props/styling onto whatever single child element the caller passes — e.g. rendering button
styles onto a router `<Link>`. This is the standard shadcn/ui polymorphism pattern; follow it for
any new interactive primitive rather than adding an `as` prop or a custom polymorphic-component
implementation.

## 5. `cn()` at every className boundary

Every component merges its own computed classes with a caller-supplied `className` through
`cn()` (`clsx` + `tailwind-merge`), always as the **last** merge argument so caller overrides win:

```tsx
className={cn(buttonVariants({ variant, size }), className)}
```

This guarantees conflicting Tailwind utilities (`"p-2 p-4"` → `"p-4"`) resolve predictably.

## 6. Two theme-consumption patterns, one preferred

- **Preferred**: literal Tailwind arbitrary-value classes bound to `--cuix-*` vars
  (`bg-[var(--cuix-colors-primary)]`), as in `button.variants.ts`. Stays in sync with runtime
  theme overrides. Every current `primitives/` component and `card`/`table` (including their
  sub-parts) follows this now.
- **Legacy**: bare Tailwind semantic classes (`bg-primary`, `text-muted-foreground`) mapped in
  `tailwind.config.ts`. Works, but doesn't route through `useTheme()` for any JS-side logic. This
  shows up in a few `layout/sidebar` sub-parts — `sheet.tsx`, `tooltip.tsx`, `skeleton.tsx`.

New components should default to the first pattern. See [architecture.md](./architecture.md).

## 7. Deep merge instead of shallow spread for overrides

Both the theme system (`mergeTheme`) and its foundation (`utils/deepMerge`) recurse into nested
plain objects so a caller can override a single leaf (`{ colors: { primary: "#7c3aed" } }`)
without needing to repeat every sibling key. Arrays, functions, and non-plain objects are treated
as leaf values and replaced wholesale, never merged — this is intentional (merging an array by
index is rarely what a caller wants).

## 8. `forwardRef` everywhere a DOM element is rendered

`React.forwardRef` is used consistently, not just for structural components. `Card` and its
sub-parts forward refs to their underlying `<div>`s, and so do the Radix-`Slot`-based primitives
`Button` and `Badge` (`React.ForwardRefExoticComponent<Props & React.RefAttributes<Element>>`,
wrapping `asChild ? Slot : <tag>`), as does essentially every exported piece of the `sidebar`
family. Treat ref-forwarding as the default for any new DOM-rendering component.

## 9. Build is gated by lint, and `pnpm install` builds the package

`package.json`'s `"prepare": "husky && npm run build"` script means `pnpm install` installs the
Husky pre-commit hook **and** runs a full `pnpm build` — this repo intentionally accepts
lifecycle-script execution on install, rather than avoiding it. The `"build"` script itself is
`eslint . && tsup && tailwindcss ...`, so any lint violation blocks the build (and therefore
blocks `pnpm install` completing cleanly) before compilation even runs. `dist/` stays gitignored
either way — it's never committed. See [security.md](./security.md) for the supply-chain
implications of running a full build on install.

## 10. shadcn CLI output is relocated, never left flat

New components generated via `pnpm exec shadcn add <name>` land flat in
`src/components/<name>.tsx` and must be moved by hand into the category/file-split structure
described in [folder-structure.md](./folder-structure.md) — the flat output is a scaffolding
step, not the final location.

## 11. ESLint rules enforce the conventions above, not just style

Beyond the standard recommended/react/jsx-a11y/prettier presets, `eslint.config.js` adds rules
that make several of the patterns above mechanically enforced rather than just documented:

- `no-restricted-imports` bans relative imports (`./`, `../`) and the `@/*` catch-all — every
  import must go through `@components/*`, `@theme/*`, `@utils/*`, or `@hooks/*` (pattern 1 above),
  even for a barrel re-exporting its own sibling file.
- `@typescript-eslint/explicit-function-return-type` (`allowExpressions: true`) requires every
  function/method to declare its return type.
- `@typescript-eslint/typedef` requires an explicit type annotation on every variable
  declaration, including destructuring. The one deliberate exception: `cva(...)` variant exports
  (e.g. `buttonVariants`) carry a targeted `// eslint-disable-next-line @typescript-eslint/typedef`
  — annotating them as `ReturnType<typeof cva>` would collapse `cva`'s literal variant-key type
  narrowing and break real call sites like `buttonVariants({ variant, size })`.
- `@typescript-eslint/no-unused-vars` catches unused imports too.
- Prettier runs as a real lint rule (`eslint-plugin-prettier`), against an explicit
  `.prettierrc.json` (semi, double quotes, trailing commas, printWidth 80, tabWidth 2, LF) and
  `.prettierignore` (`dist`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) — formatting drift is an
  ESLint error, not just a `prettier --check` warning.

Since `pnpm build` runs `eslint .` first (pattern 9 above), any violation of these rules blocks
the build, not just the pre-commit hook.

## 12. Component-scoped `Context` when there's no Radix primitive to delegate to

Every Radix-backed component in this repo delegates its interactive state (open/closed,
checked/unchecked, selected value) to the underlying `@radix-ui/react-*` primitive — there's no
custom state-tracking code to write. Two components have no such primitive to delegate to, and
both independently converge on the same fix: a component-scoped `React.createContext`, read via a
`useX()` hook, holding just enough state to coordinate the compound component's own sub-parts:

- `layout/sidebar`'s `SidebarContext`/`useSidebar()` — `useSidebar()` throws if called outside a
  `SidebarProvider`.
- `primitives/multi-select`'s `MultiSelectContext`/`useMultiSelect()` — since there's no
  `@radix-ui/react-multi-select`, selection state (`selectedValues`, `toggleValue`, open state,
  registered `items`) lives here instead, with `values`/`onValuesChange` for external control and
  `defaultValues` for an uncontrolled fallback.

When building a new compound component that has no first-party Radix primitive, follow this
shape rather than inventing prop-drilling or an external state library — see
[modules/components.md](./modules/components.md#primitivesmulti-select) for the multi-select
specifics.
