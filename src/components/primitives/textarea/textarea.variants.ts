// Style variants for Textarea, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@/theme/tokens";

export const textareaVariants = cva(
  `${flex.row} min-h-[60px] w-[var(--cuix-width-full)] rounded-[var(--cuix-radius-md)] border border-[var(--cuix-colors-input)] bg-[var(--cuix-colors-transparent)] px-3 py-[var(--cuix-spacing-sm)] text-[var(--cuix-font-size-md)] shadow-[var(--cuix-shadow-sm)] placeholder:text-[var(--cuix-colors-muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cuix-colors-ring)] disabled:cursor-not-allowed disabled:opacity-50 md:text-[var(--cuix-font-size-sm)]`,
);
