// Style variants for Input, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@/theme/tokens";

export const inputVariants = cva(
  `${flex.row} h-9 w-[var(--cuix-width-full)] rounded-[var(--cuix-radius-md)] border border-[var(--cuix-colors-input)] bg-[var(--cuix-colors-transparent)] px-3 py-[var(--cuix-spacing-xs)] text-[var(--cuix-font-size-md)] shadow-[var(--cuix-shadow-sm)] transition-colors file:border-0 file:bg-[var(--cuix-colors-transparent)] file:text-[var(--cuix-font-size-sm)] file:font-medium file:text-[var(--cuix-colors-foreground)] placeholder:text-[var(--cuix-colors-muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cuix-colors-ring)] disabled:cursor-not-allowed disabled:opacity-50 md:text-[var(--cuix-font-size-sm)]`,
);
