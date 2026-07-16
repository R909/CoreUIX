// Style variants for MultiSelect and its sub-parts, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// Trigger button that opens the dropdown; wraps to fit its content.
export const multiSelectTriggerVariants: ReturnType<typeof cva> = cva(
  `${flex.between} h-auto min-h-9 w-fit gap-2 overflow-hidden whitespace-nowrap rounded-[var(--cuix-radius-md)] border border-[var(--cuix-colors-input)] bg-[var(--cuix-colors-transparent)] px-3 py-1.5 text-[var(--cuix-font-size-sm)] shadow-[var(--cuix-shadow-sm)] outline-none focus-visible:ring-[var(--cuix-colors-ring)]/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--cuix-colors-destructive)] aria-invalid:ring-[var(--cuix-colors-destructive)]/20 data-[placeholder]:text-[var(--cuix-colors-muted-foreground)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-[var(--cuix-colors-muted-foreground)]`,
);

// Placeholder text shown when nothing is selected.
export const multiSelectPlaceholderVariants: ReturnType<typeof cva> = cva(
  "min-w-0 overflow-hidden font-medium text-[var(--cuix-colors-muted-foreground)]",
);

// The single selected value's label, when `single` is set.
export const multiSelectSingleValueVariants: ReturnType<typeof cva> = cva(
  "min-w-0 overflow-hidden",
);

// Row holding the placeholder or the selected-value chips.
export const multiSelectValueVariants: ReturnType<typeof cva> = cva(
  `${flex.row} w-[var(--cuix-width-full)] gap-[var(--cuix-spacing-tight)] overflow-hidden`,
);

// A single selected-value chip.
export const multiSelectBadgeVariants: ReturnType<typeof cva> = cva(
  `${flex.itemsCenter} gap-1`,
);

// Check-mark slot shown next to a selected option row.
export const multiSelectItemIndicatorVariants: ReturnType<typeof cva> =
  cva("mr-2 size-4");
