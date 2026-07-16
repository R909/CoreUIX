// Style variants for Popover, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

// Floating panel anchored to the trigger.
export const popoverContentVariants: ReturnType<typeof cva> = cva(
  `z-[var(--cuix-z-index-popover)] w-72 rounded-[var(--cuix-radius-md)] border border-[var(--cuix-colors-border)] bg-[var(--cuix-colors-popover)] p-[var(--cuix-spacing-md)] text-[var(--cuix-colors-popover-foreground)] shadow-[var(--cuix-shadow-md)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]`,
);
