# API Patterns

Conventions every component's public API follows. New components should match these so the
library feels consistent to consumers.

## Prop types

- Extend the native element's props first, then the `cva` variant props, then any component-
  specific additions:

  ```ts
  export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    };
  ```

- `Badge` now also uses `React.ComponentPropsWithoutRef<"span">`, matching `Button`'s pattern —
  prefer `ComponentPropsWithoutRef<"tag">` for new components.
- Types live in a sibling `<name>.types.ts` file, not inline in the component file.

## Variant props (`cva`)

- Every variant map is created with `createVariants`/`cva` in `<name>.variants.ts` and exported
  by name (`buttonVariants`, `badgeVariants`) — both for internal use and so consumers can call
  the variant function directly if they need raw class strings.
- Every variant map declares `defaultVariants` so omitting `variant`/`size` never produces
  unstyled output.
- Variant keys are semantic (`default`, `secondary`, `destructive`, `outline`, `ghost`, `link` /
  `default`, `sm`, `lg`, `icon`), not visual (`red`, `large`) — keep new variants semantic too.

## `asChild` for polymorphism

Any interactive/renderable primitive that might need to render as a different element (a link
styled as a button, an anchor styled as a badge) accepts:

```ts
asChild?: boolean;
```

and implements it as:

```tsx
const Comp = asChild ? Slot : "button"; // or the component's default tag
return <Comp data-slot="button" className={cn(...)} {...props} />;
```

Don't invent an `as="a"` string-prop API instead — `asChild` + Radix `Slot` is the established
pattern here (see [system-patterns.md](./system-patterns.md#4-aschild--radix-slot-for-polymorphic-rendering)).

## `data-slot` attributes

Interactive primitives set a `data-slot="<component-name>"` attribute on their rendered root
(`data-slot="button"`, `data-slot="badge"`). This gives consumers a stable CSS/JS hook that
survives `asChild` swapping the underlying element. Add this to new primitives.

## `className` merging

Every component's className prop is merged last, through `cn()`, so caller-supplied classes can
override the component's own defaults:

```tsx
className={cn(buttonVariants({ variant, size }), className)}
```

Never merge in the other order (`cn(className, variants(...))`) — that would let internal
variant classes win over consumer overrides for conflicting Tailwind utilities.

## Exports per component

A component's local `index.ts` barrel re-exports the component module for its category barrel to
aggregate:

```ts
export * from "@components/primitives/button/button";
```

Currently every primitive/layout component barrel (`button`, `badge`, `input`, `label`,
`textarea`, `card`) re-exports only the component's own `.tsx` module this way — `.variants.ts`
and `.types.ts` are not currently re-exported through the barrel as separate `export *` lines
(the `sidebar` family is the exception: its `index.ts` separately re-exports `sidebar`,
`sidebar.variants`, `sidebar.types`, and `sidebar-constant`). If you need `buttonVariants` or
`ButtonProps` reachable from the package root, verify against the actual `index.ts` you're
touching rather than assuming all three are always re-exported — this has been in flux recently
(see git history on `button/index.ts` and `badge/index.ts`).

## Theme-facing API

- `ThemeProvider` accepts a single optional prop: `theme?: DeepPartial<CoreUIXTheme>`. Partial
  at any depth — a consumer can override `theme={{ colors: { primary: "#7c3aed" } }}` without
  specifying every other color.
- `useTheme()` takes no arguments and returns the full merged `CoreUIXTheme`; it never throws —
  outside a `ThemeProvider` it returns `defaultTheme`.
- Theme values are exposed identically through React (`useTheme().colors.primary`) and CSS
  (`var(--cuix-colors-primary)`) — pick whichever fits the call site, both stay in sync.

## What's intentionally _not_ part of the public API

- Nothing under `theme/core/*`, `theme/utils/*`, or `theme/tokens/*` is meant to be imported by
  path — consumers go through `@coreuix/ui`'s top-level exports (`ThemeProvider`, `useTheme`,
  `createTheme`, `defaultTheme`, `mergeTheme`, `generateCssVariables`, etc.), all re-exported
  from `src/theme/index.ts` → `src/index.ts`.
- `components.json`'s `aliases` (`@components`, `@utils`, `@hooks`, `@theme`) are shadcn-CLI-only
  and are not part of the package's API surface.
