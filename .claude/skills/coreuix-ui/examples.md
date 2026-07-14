# Worked examples

These are verbatim excerpts of existing files in this repo (as of this writing),
kept here as templates to copy the _shape_ of for a new component. Don't assume
they're still byte-identical to what's on disk — always check the live file if the
exact content matters, these are for pattern reference.

## Example 1 — single Radix-backed component with a real `cva` variant

`src/components/primitives/separator/separator.variants.ts`:

```ts
// Style variants for Separator, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

export const separatorVariants = cva(
  "shrink-0 bg-[var(--cuix-colors-border)]",
  {
    variants: {
      orientation: {
        horizontal: "h-[1px] w-full",
        vertical: "h-full w-[1px]",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);
```

`src/components/primitives/separator/separator.types.ts`:

```ts
// Prop types for the Separator component.
import type * as React from "react";
import type * as SeparatorPrimitive from "@radix-ui/react-separator";
import type { VariantProps } from "class-variance-authority";

import type { separatorVariants } from "@/components/primitives/separator/separator.variants";

export type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
> &
  VariantProps<typeof separatorVariants>;
```

`src/components/primitives/separator/separator.tsx`:

```tsx
// Separator component for visually dividing content.
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/utils/cn";

import { separatorVariants } from "@/components/primitives/separator/separator.variants";
import type { SeparatorProps } from "@/components/primitives/separator/separator.types";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation ?? undefined}
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
```

`src/components/primitives/separator/index.ts`:

```ts
// Re-exports Separator.
export * from "@/components/primitives/separator/separator";
```

Notice: the `orientation` variant key is a real `cva` `variants` map (not a manual
`className` ternary), and it's also a genuine Radix prop — the component destructures
it with a default, passes it straight through to the primitive, and also feeds it
into `separatorVariants({ orientation })`. This is the pattern to copy whenever a
prop is both a Radix behavior input _and_ a style switch.

## Example 2 — zero-styling passthrough (skip `.variants.ts`)

`src/components/primitives/aspect-ratio/aspect-ratio.tsx` (entire file):

```tsx
// AspectRatio component for constraining content to a fixed width/height ratio.
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
```

No `.variants.ts`, no `.types.ts` — there are no classes to tokenize and no props
beyond what `AspectRatioPrimitive.Root` already provides. `index.ts` still exists
and still re-exports from the `.tsx` file, same as every other component.

## Example 3 — multi-part component, one `cva` per sub-part

`src/components/layout/card/card.variants.ts` (illustrative excerpt — see the live
file for the full set of sub-parts):

```ts
// Style variants for Card and its sub-parts, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-[var(--cuix-radius-lg)] border border-[var(--cuix-colors-border)] bg-[var(--cuix-colors-card)] text-[var(--cuix-colors-card-foreground)] shadow-[var(--cuix-shadow-sm)]",
);

export const cardHeaderVariants = cva(
  "flex flex-col space-y-1.5 p-[var(--cuix-spacing-lg)]",
);
```

Every sub-part (`Card`, `CardHeader`, `CardTitle`, `CardDescription`,
`CardContent`, `CardFooter`) gets its own `cva` export even where — like
`CardHeader` above — there's no `variants` map, just base classes. This keeps every
sub-part independently overridable via `className` and consistent with parts that
_do_ have real variants.

## Example 4 — variant-map component (`variant` + `size`)

The canonical shape (see `src/components/primitives/button/button.variants.ts` or
`src/components/primitives/toggle/toggle.variants.ts` for the live version):

```ts
export const xVariants = cva("<base classes shared by every instance>", {
  variants: {
    variant: {
      default: "<classes>",
      outline: "<classes>",
      // ...
    },
    size: {
      default: "<classes>",
      sm: "<classes>",
      lg: "<classes>",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

The component then does `cn(xVariants({ variant, size, className }))` (or
`cn(xVariants({ variant, size }), className)` — both forms appear in the repo;
either is fine, `cva`'s own `className` merging inside the call and `cn`'s
`tailwind-merge` outside it produce the same result).

## Anti-pattern — what NOT to write for a new component

```tsx
// Don't do this in a new component:
<div
  className={cn("bg-primary text-primary-foreground rounded-md", className)}
/>
```

```tsx
// Do this instead:
<div
  className={cn(
    "bg-[var(--cuix-colors-primary)] text-[var(--cuix-colors-primary-foreground)] rounded-[var(--cuix-radius-md)]",
    className,
  )}
/>
```

The bare-class version still renders identically today (`tailwind.config.ts` maps
`bg-primary` to the same `--cuix-colors-primary` variable), but it bypasses
`useTheme()` for any JS logic that needs the value, which is why it's the pattern to
avoid going forward, not a hard runtime bug.
