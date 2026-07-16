// Style variants for Toggle, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant/size keys; annotating with ReturnType<typeof cva> widens it and breaks callers like `toggleVariants({ variant, size })`.
export const toggleVariants = cva(
  `${flex.inlineCenter} gap-[var(--cuix-spacing-sm)] rounded-[var(--cuix-radius-md)] text-[var(--cuix-font-size-sm)] font-medium transition-colors hover:bg-[var(--cuix-colors-muted)] hover:text-[var(--cuix-colors-muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cuix-colors-ring)] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[var(--cuix-colors-accent)] data-[state=on]:text-[var(--cuix-colors-accent-foreground)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-[var(--cuix-colors-input)] bg-transparent shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-accent)] hover:text-[var(--cuix-colors-accent-foreground)]",
      },
      size: {
        default: "h-9 px-[var(--cuix-spacing-sm)] min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
