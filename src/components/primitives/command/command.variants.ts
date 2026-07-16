// Style variants for Command and its sub-parts, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// Outer command container.
export const commandVariants: ReturnType<typeof cva> = cva(
  `${flex.col} h-[var(--cuix-height-full)] w-[var(--cuix-width-full)] overflow-hidden rounded-[var(--cuix-radius-md)] bg-[var(--cuix-colors-popover)] text-[var(--cuix-colors-popover-foreground)]`,
);

// Wrapper around the search input, holds the search icon.
export const commandInputWrapperVariants: ReturnType<typeof cva> = cva(
  `${flex.itemsCenter} border-b border-[var(--cuix-colors-border)] px-3`,
);

// Search input itself.
export const commandInputVariants: ReturnType<typeof cva> = cva(
  `flex h-10 w-[var(--cuix-width-full)] rounded-[var(--cuix-radius-md)] bg-[var(--cuix-colors-transparent)] py-3 text-[var(--cuix-font-size-sm)] outline-none placeholder:text-[var(--cuix-colors-muted-foreground)] disabled:cursor-not-allowed disabled:opacity-50`,
);

// Scrollable list of results.
export const commandListVariants: ReturnType<typeof cva> = cva(
  "max-h-[300px] overflow-y-auto overflow-x-hidden",
);

// Shown when no results match the search.
export const commandEmptyVariants: ReturnType<typeof cva> = cva(
  "py-6 text-center text-[var(--cuix-font-size-sm)]",
);

// Groups a labeled section of items.
export const commandGroupVariants: ReturnType<typeof cva> = cva(
  `overflow-hidden p-1 text-[var(--cuix-colors-foreground)] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[var(--cuix-font-size-xs)] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--cuix-colors-muted-foreground)]`,
);

// Thin divider between groups of items.
export const commandSeparatorVariants: ReturnType<typeof cva> = cva(
  "-mx-1 h-px bg-[var(--cuix-colors-border)]",
);

// Selectable result row.
export const commandItemVariants: ReturnType<typeof cva> = cva(
  `relative flex cursor-default select-none items-center gap-2 rounded-[var(--cuix-radius-sm)] px-2 py-1.5 text-[var(--cuix-font-size-sm)] outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-[var(--cuix-colors-accent)] data-[selected=true]:text-[var(--cuix-colors-accent-foreground)] data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
);

// Keyboard-shortcut hint aligned to the end of a row.
export const commandShortcutVariants: ReturnType<typeof cva> = cva(
  "ml-auto text-[var(--cuix-font-size-xs)] tracking-widest text-[var(--cuix-colors-muted-foreground)]",
);
