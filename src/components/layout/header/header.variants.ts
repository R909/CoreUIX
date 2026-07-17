// Style variants for Header and its sub-parts, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// Root bar; content on the left, the profile block on the right.
export const headerVariants: ReturnType<typeof cva> = cva(
  `${flex.between} h-14 w-full border-b border-[var(--cuix-colors-border)] bg-[var(--cuix-colors-background)] px-[var(--cuix-spacing-lg)]`,
);

// Right-aligned block holding the user's details (name + email) and avatar.
export const headerProfileVariants: ReturnType<typeof cva> = cva(
  `${flex.itemsCenter} gap-[var(--cuix-spacing-sm)]`,
);

// Stacks the name above the email, right-aligned next to the avatar.
export const headerProfileDetailsVariants: ReturnType<typeof cva> = cva(
  "flex flex-col items-end",
);

// User's display name text.
export const headerProfileNameVariants: ReturnType<typeof cva> = cva(
  "text-[var(--cuix-font-size-sm)] font-medium leading-[var(--cuix-line-height-tight)] text-[var(--cuix-colors-foreground)]",
);

// User's email text shown under the name.
export const headerProfileEmailVariants: ReturnType<typeof cva> = cva(
  "text-[var(--cuix-font-size-xs)] leading-[var(--cuix-line-height-tight)] text-[var(--cuix-colors-muted-foreground)]",
);

// Circular avatar slot; pass an <img> or initials as children.
export const headerProfileAvatarVariants: ReturnType<typeof cva> = cva(
  `${flex.center} size-9 shrink-0 overflow-hidden rounded-[var(--cuix-radius-full)] bg-[var(--cuix-colors-muted)] text-[var(--cuix-font-size-xs)] font-medium text-[var(--cuix-colors-muted-foreground)]`,
);
