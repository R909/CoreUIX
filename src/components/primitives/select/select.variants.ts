// Style variants for Select and its sub-parts, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// Trigger button that opens the dropdown.
export const selectTriggerVariants: ReturnType<typeof cva> = cva(
  `${flex.between} h-9 w-[var(--cuix-width-full)] gap-2 whitespace-nowrap rounded-[var(--cuix-radius-md)] border border-[var(--cuix-colors-input)] bg-[var(--cuix-colors-transparent)] px-3 py-2 text-[var(--cuix-font-size-sm)] shadow-[var(--cuix-shadow-sm)] data-[placeholder]:text-[var(--cuix-colors-muted-foreground)] outline-none focus:ring-1 focus:ring-[var(--cuix-colors-ring)] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1`,
);

// Scroll up/down buttons at the edges of a long dropdown.
export const selectScrollButtonVariants: ReturnType<typeof cva> = cva(
  `${flex.center} cursor-default py-1`,
);

// Dropdown panel holding the list of options.
export const selectContentVariants: ReturnType<typeof cva> = cva(
  `relative z-[var(--cuix-z-index-popover)] max-h-[--radix-select-content-available-height] min-w-32 overflow-y-auto overflow-x-hidden rounded-[var(--cuix-radius-md)] border border-[var(--cuix-colors-border)] bg-[var(--cuix-colors-popover)] text-[var(--cuix-colors-popover-foreground)] shadow-[var(--cuix-shadow-md)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]`,
);

// Section heading within the dropdown.
export const selectLabelVariants: ReturnType<typeof cva> = cva(
  "px-2 py-1.5 text-[var(--cuix-font-size-sm)] font-[var(--cuix-font-weight-semibold)]",
);

// Selectable option row.
export const selectItemVariants: ReturnType<typeof cva> = cva(
  `relative flex w-[var(--cuix-width-full)] cursor-default select-none items-center rounded-[var(--cuix-radius-sm)] py-1.5 pl-2 pr-8 text-[var(--cuix-font-size-sm)] outline-none focus:bg-[var(--cuix-colors-accent)] focus:text-[var(--cuix-colors-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
);

// Thin divider between groups of options.
export const selectSeparatorVariants: ReturnType<typeof cva> = cva(
  "-mx-1 my-1 h-px bg-[var(--cuix-colors-muted)]",
);
