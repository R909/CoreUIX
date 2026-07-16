// Style variants for Button, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// Base classes apply to every button; `variant` sets the color style, `size` sets dimensions.
// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant/size keys; annotating with ReturnType<typeof cva> widens it and breaks callers like `buttonVariants({ variant, size })`.
export const buttonVariants = cva(
  `${flex.inlineCenter} gap-[var(--cuix-spacing-sm)] whitespace-nowrap rounded-[var(--cuix-radius-md)] text-[var(--cuix-font-size-sm)] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:border-[var(--cuix-colors-ring)] focus-visible:ring-[var(--cuix-colors-ring)]/50 focus-visible:ring-[3px] aria-invalid:ring-[var(--cuix-colors-destructive)]/20 aria-invalid:border-[var(--cuix-colors-destructive)]`,
  {
    variants: {
      variant: {
        default:
          "bg-[var(--cuix-colors-primary)] text-[var(--cuix-colors-primary-foreground)] shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-primary)]/90",
        destructive:
          "bg-[var(--cuix-colors-destructive)] text-[var(--cuix-colors-destructive-foreground)] shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-destructive)]/90 focus-visible:ring-[var(--cuix-colors-destructive)]/20",
        outline:
          "border border-[var(--cuix-colors-border)] bg-[var(--cuix-colors-background)] shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-accent)] hover:text-[var(--cuix-colors-accent-foreground)]",
        secondary:
          "bg-[var(--cuix-colors-secondary)] text-[var(--cuix-colors-secondary-foreground)] shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-secondary)]/80",
        ghost:
          "hover:bg-[var(--cuix-colors-accent)] hover:text-[var(--cuix-colors-accent-foreground)]",
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
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
