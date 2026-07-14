// Style variants for Badge, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@/theme/tokens";

// Base classes apply to every badge; `variant` sets the color style.
export const badgeVariants = cva(
  `${flex.inlineCenter} rounded-[var(--cuix-radius-md)] border px-2 py-0.5 text-[var(--cuix-font-size-xs)] font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-[var(--cuix-colors-ring)] focus-visible:ring-[var(--cuix-colors-ring)]/50 focus-visible:ring-[3px] transition-[color,box-shadow] overflow-hidden`,
  {
    variants: {
      variant: {
        default:
          "border-[var(--cuix-colors-transparent)] bg-[var(--cuix-colors-primary)] text-[var(--cuix-colors-primary-foreground)] [a&]:hover:bg-[var(--cuix-colors-primary)]/90",
        secondary:
          "border-[var(--cuix-colors-transparent)] bg-[var(--cuix-colors-secondary)] text-[var(--cuix-colors-secondary-foreground)] [a&]:hover:bg-[var(--cuix-colors-secondary)]/90",
        destructive:
          "border-[var(--cuix-colors-transparent)] bg-[var(--cuix-colors-destructive)] text-[var(--cuix-colors-destructive-foreground)] [a&]:hover:bg-[var(--cuix-colors-destructive)]/90 focus-visible:ring-[var(--cuix-colors-destructive)]/20",
        outline:
          "text-[var(--cuix-colors-foreground)] [a&]:hover:bg-[var(--cuix-colors-accent)] [a&]:hover:text-[var(--cuix-colors-accent-foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
