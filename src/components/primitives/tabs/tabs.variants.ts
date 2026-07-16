// Style variants for Tabs and its sub-parts, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// Root container; stacks the trigger list above its content panels.
export const tabsVariants: ReturnType<typeof cva> = cva(
  `${flex.col} gap-[var(--cuix-spacing-sm)]`,
);

// Pill-shaped row that holds the triggers.
export const tabsListVariants: ReturnType<typeof cva> = cva(
  `${flex.inlineCenter} h-9 w-fit rounded-[var(--cuix-radius-lg)] bg-[var(--cuix-colors-muted)] p-[3px] text-[var(--cuix-colors-muted-foreground)]`,
);

// Individual clickable tab; data-[state=active] styles the selected trigger.
export const tabsTriggerVariants: ReturnType<typeof cva> = cva(
  `${flex.inlineCenter} h-[calc(100%-1px)] flex-1 gap-[var(--cuix-spacing-tight)] whitespace-nowrap rounded-[var(--cuix-radius-md)] border border-[var(--cuix-colors-transparent)] px-2 py-1 text-[var(--cuix-font-size-sm)] font-medium text-[var(--cuix-colors-foreground)] transition-[color,box-shadow] focus-visible:border-[var(--cuix-colors-ring)] focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-[var(--cuix-colors-ring)]/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[var(--cuix-colors-background)] data-[state=active]:shadow-[var(--cuix-shadow-sm)] dark:text-[var(--cuix-colors-muted-foreground)] dark:data-[state=active]:border-[var(--cuix-colors-input)] dark:data-[state=active]:bg-[var(--cuix-colors-input)]/30 dark:data-[state=active]:text-[var(--cuix-colors-foreground)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
);

// Panel shown when its matching trigger is active.
export const tabsContentVariants: ReturnType<typeof cva> = cva(
  "flex-1 outline-none",
);
