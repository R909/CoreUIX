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

Adding a new design token means adding **one key** to `theme/models/Theme.ts` and **one default**
to the matching `theme/tokens/*.ts` file — `generateCssVariables` walks each theme section via
`Object.entries` automatically, so no other file changes. See
[modules/theme.md](./modules/theme.md).

## 3. `cva` for variants, split into a sibling file

Every styled component defines its variant classes with `class-variance-authority` (re-exported
as `createVariants` from `src/utils/createVariants.ts`) in a sibling `<name>.variants.ts` file,
not inline in the component. This keeps the component body focused on structure/behavior and
makes the variant map independently importable (`buttonVariants` is re-exported for consumers
who want it directly).

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
  theme overrides.
- **Legacy** (`card`, partially `badge`): bare Tailwind semantic classes (`bg-card`,
  `text-muted-foreground`) mapped in `tailwind.config.ts`. Works, but doesn't route through
  `useTheme()` for any JS-side logic.

New components should default to the first pattern. See [architecture.md](./architecture.md).

## 7. Deep merge instead of shallow spread for overrides

Both the theme system (`mergeTheme`) and its foundation (`utils/deepMerge`) recurse into nested
plain objects so a caller can override a single leaf (`{ colors: { primary: "#7c3aed" } }`)
without needing to repeat every sibling key. Arrays, functions, and non-plain objects are treated
as leaf values and replaced wholesale, never merged — this is intentional (merging an array by
index is rarely what a caller wants).

## 8. `forwardRef` for DOM-composable components

Components that render a DOM element directly (`Card` and its sub-parts) use
`React.forwardRef` so consumers can attach refs through to the underlying `<div>`. Components
built on Radix `Slot` (`Button`, `Badge`) don't currently forward refs the same way — check
existing usage before assuming ref-forwarding is universal.

## 9. Config-as-code, not generated at install time

There is no `prepare` lifecycle script; `dist/` is built and committed explicitly, and pnpm's
lifecycle-script blocking is treated as a feature, not a gap to work around. Don't add
`postinstall`/`prepare` scripts to "fix" this — see [security.md](./security.md) for why.

## 10. shadcn CLI output is relocated, never left flat

New components generated via `pnpm exec shadcn add <name>` land flat in
`src/components/<name>.tsx` and must be moved by hand into the category/file-split structure
described in [folder-structure.md](./folder-structure.md) — the flat output is a scaffolding
step, not the final location.
