# Worked examples

These are verbatim excerpts of existing files in this repo (as of this writing),
kept here as templates to copy the _shape_ of for a new component. Don't assume
they're still byte-identical to what's on disk — always check the live file if the
exact content matters, these are for pattern reference.

All internal imports below use this repo's category-scoped aliases
(`@components/*`, `@utils/*`, `@theme/*`, `@hooks/*`) — never a relative path and
never the bare `@/*` catch-all, both of which are `no-restricted-imports` ESLint
errors (see `coding-standards.md`).

## Example 1 — variant-map component (`variant` + `size`), with the `cva` typedef exemption

`src/components/primitives/button/button.variants.ts` (real, current file):

```ts
// Style variants for Button, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// Base classes apply to every button; `variant` sets the color style, `size` sets dimensions.
// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant/size keys; annotating with ReturnType<typeof cva> widens it and breaks callers like `buttonVariants({ variant, size })`.
export const buttonVariants = cva(
  `${flex.inlineCenter} gap-[var(--cuix-spacing-sm)] whitespace-nowrap rounded-[var(--cuix-radius-md)] text-[var(--cuix-font-size-sm)] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ...`,
  {
    variants: {
      variant: {
        default:
          "bg-[var(--cuix-colors-primary)] text-[var(--cuix-colors-primary-foreground)] ...",
        destructive: "bg-[var(--cuix-colors-destructive)] ...",
        outline: "border border-[var(--cuix-colors-border)] ...",
        secondary: "bg-[var(--cuix-colors-secondary)] ...",
        ghost: "hover:bg-[var(--cuix-colors-accent)] ...",
        link: "text-[var(--cuix-colors-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 px-[var(--cuix-spacing-md)] py-[var(--cuix-spacing-sm)] has-[>svg]:px-3",
        sm: "h-8 rounded-[var(--cuix-radius-md)] gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-[var(--cuix-radius-md)] px-[var(--cuix-spacing-lg)] has-[>svg]:px-[var(--cuix-spacing-md)]",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
```

`src/components/primitives/button/button.tsx` (real, current file — full):

```tsx
// Button component for clickable actions.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@utils/cn";
import { buttonVariants } from "@components/primitives/button/button.variants";
import type { ButtonProps } from "@components/primitives/button/button.types";

// asChild lets the button render as a different element (e.g. a Link).
const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, ...props }: ButtonProps,
    ref,
  ) => {
    const Comp: React.ElementType = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
```

`src/components/primitives/button/index.ts`:

```ts
// Re-exports Button, its variants, and its prop types.
export * from "@components/primitives/button/button";
```

Notice everything the strict ESLint rules require here:

- `buttonVariants` has the `@typescript-eslint/typedef` exemption comment
  immediately above it — this is the **one** place a component author should
  deliberately _not_ add a type annotation.
- `const Button: React.ForwardRefExoticComponent<...>` — the forwardRef assignment
  itself is annotated (`@typescript-eslint/typedef`).
- `const Comp: React.ElementType = ...` — every inline variable inside the render
  body is annotated too.
- `{ className, variant, size, asChild = false, ...props }: ButtonProps` — the
  destructured parameter has its type written directly on it, not left to be
  inferred from `forwardRef<HTMLButtonElement, ButtonProps>`'s generics.
- `badge/` (`src/components/primitives/badge/badge.variants.ts` /
  `badge.tsx`) follows the identical shape with a single `variant` key (no
  `size`) — see that file for a second, simpler instance of the same pattern.

## Example 2 — single-key `cva`, no `variants` map at all (base classes only)

`src/components/primitives/label/label.variants.ts` (real, current file — full):

```ts
// Style variants for Label, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers like `labelVariants()`.
export const labelVariants = cva(
  "text-[var(--cuix-font-size-sm)] font-medium leading-[var(--cuix-line-height-tight)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);
```

`src/components/primitives/label/label.tsx` (real, current file — full):

```tsx
// Label component for form field captions.
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@utils/cn";

import { labelVariants } from "@components/primitives/label/label.variants";
import type { LabelProps } from "@components/primitives/label/label.types";

const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<React.ElementRef<typeof LabelPrimitive.Root>>
> = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }: LabelProps, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      data-slot="label"
      className={cn(labelVariants(), className)}
      {...props}
    />
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

A `cva(...)` call doesn't need a `variants` map at all — it's valid (and common
here, see also `input/`, `textarea/`) to call it with just a base class string,
purely so the classes stay independently overridable via `className` and
consistent with every other component's shape. The `// eslint-disable-next-line
@typescript-eslint/typedef` exemption comment is still required above it either way.

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
_do_ have real variants. `card.types.ts` intersects each sub-part's native
`React.HTMLAttributes<HTMLDivElement>` with its own `VariantProps<typeof
xVariants>`, and `card.tsx` gives each sub-part its own `React.forwardRef` and
`.displayName`.

## Example 4 — zero-styling passthrough (skip `.variants.ts`)

No standalone primitive in this repo currently has zero styling of its own, but
the pattern exists as a **private helper** inside `layout/sidebar/` — see
`src/components/layout/sidebar/tooltip.tsx`:

```ts
const TooltipProvider: typeof TooltipPrimitive.Provider =
  TooltipPrimitive.Provider;
const Tooltip: typeof TooltipPrimitive.Root = TooltipPrimitive.Root;
const TooltipTrigger: typeof TooltipPrimitive.Trigger =
  TooltipPrimitive.Trigger;
```

(`TooltipContent`, in the same file, does add classes and gets a full
`forwardRef` — only the parts with nothing to add stay this simple.) No
`.variants.ts` for a component like this — there are no classes to tokenize — and
skip `.types.ts` too if there are no props of its own beyond what the primitive
already provides. Note `typeof X.Y` still needs the explicit type annotation on
the `const` (`@typescript-eslint/typedef` applies here too); a bare
`const TooltipProvider = TooltipPrimitive.Provider;` would fail lint.

Also note: this specific file, along with `sidebar/separator.tsx` and
`sidebar/sheet.tsx`, still uses bare Tailwind semantic classes (`bg-primary`,
`bg-background`, `text-primary-foreground`) rather than this repo's `--cuix-*`
tokenized pattern — known drift in these particular helper files, not something
to copy into a new component (see "Anti-pattern" below and `component-guidelines.md`'s
"Styling conventions").

## Example 5 — complex compound component with internal Context + hooks

`src/components/layout/sidebar/sidebar.tsx` is the richest current example of the
`typedef`/`explicit-function-return-type` rules combined with a component-scoped
`React.createContext`, since it's the newest and most heavily typed file in the
repo. Excerpt:

```tsx
const SidebarContext: React.Context<SidebarContextProps | null> =
  React.createContext<SidebarContextProps | null>(null);

function useSidebar(): SidebarContextProps {
  const context: SidebarContextProps | null = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}
```

Inside `SidebarProvider`, note the fully-annotated destructured `useState` tuples
that `@typescript-eslint/typedef`'s `arrayDestructuring: true` requires:

```tsx
const [openMobile, setOpenMobile]: [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] = React.useState<boolean>(false);
```

Contrast `useSidebar()`'s throwing behavior with `useTheme()` (`src/theme/useTheme.ts`),
which degrades gracefully to `defaultTheme` instead of throwing when used outside
a provider — there is no single repo-wide convention for this; check precedent in
the specific area you're touching rather than assuming one pattern applies
everywhere.

`src/hooks/use-mobile.tsx` (`useIsMobile()`, consumed by `SidebarProvider` via the
`@hooks/*` alias) is a smaller, self-contained example of the same
typedef/explicit-return-type combination:

```tsx
import * as React from "react";

const MOBILE_BREAKPOINT: number = 768;

function getIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = React.useState<boolean>(getIsMobile);

  React.useEffect(() => {
    const mql: MediaQueryList = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );
    const onChange: () => void = (): void =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
```

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
avoid going forward, not a hard runtime bug. As noted in Example 4 above, a few of
`layout/sidebar/`'s internal helper files (`separator.tsx`, `sheet.tsx`,
`tooltip.tsx`) currently still use the bare-class form — that's existing drift to
be aware of, not precedent to extend into new work.

```ts
// Don't do this anywhere in this repo:
export * from "./button";
import { cn } from "../../utils/cn";
import { Button } from "@/components/primitives/button";
```

```ts
// Do this instead — always the full category-scoped alias, even for a barrel
// re-exporting its own sibling file in the same folder:
export * from "@components/primitives/button/button";
import { cn } from "@utils/cn";
import { Button } from "@components/primitives/button";
```

Both the relative-path form and the bare `@/*` form are `no-restricted-imports`
ESLint errors — this is a repo-wide rule with no exceptions, not a style
preference.
