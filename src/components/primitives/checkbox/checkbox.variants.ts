// Style variants for Checkbox, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

export const checkboxVariants: ReturnType<typeof cva> = cva(
  `peer ${flex.center} size-4 shrink-0 rounded-[var(--cuix-radius-sm)] border border-[var(--cuix-colors-primary)] shadow-[var(--cuix-shadow-sm)] transition-colors outline-none focus-visible:ring-[var(--cuix-colors-ring)]/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--cuix-colors-primary)] data-[state=checked]:text-[var(--cuix-colors-primary-foreground)] aria-invalid:ring-[var(--cuix-colors-destructive)]/20 aria-invalid:border-[var(--cuix-colors-destructive)]`,
);

export const checkboxIndicatorVariants: ReturnType<typeof cva> = cva(
  `${flex.center} text-current transition-none`,
);
