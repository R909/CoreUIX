// Style variants for Card and its sub-parts, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

import { flex } from "@theme/tokens";

// Outer card container.
// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers.
export const cardVariants = cva(
  "rounded-[var(--cuix-radius-lg)] border border-[var(--cuix-colors-border)] bg-[var(--cuix-colors-card)] text-[var(--cuix-colors-card-foreground)] shadow-[var(--cuix-shadow-sm)]",
);

// Header section, usually holds the title and description.
// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers.
export const cardHeaderVariants = cva(
  `${flex.col} space-y-[var(--cuix-spacing-tight)] p-[var(--cuix-spacing-lg)]`,
);

// Title text within CardHeader.
// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers.
export const cardTitleVariants = cva(
  "font-[var(--cuix-font-weight-semibold)] leading-[var(--cuix-line-height-tight)] tracking-[var(--cuix-letter-spacing-tight)]",
);

// Muted supporting text shown under the title.
// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers.
export const cardDescriptionVariants = cva(
  "text-[var(--cuix-font-size-sm)] text-[var(--cuix-colors-muted-foreground)]",
);

// Main body region of the card.
// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers.
export const cardContentVariants = cva("p-[var(--cuix-spacing-lg)] pt-0");

// Footer row, usually for action buttons.
// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers.
export const cardFooterVariants = cva(
  `${flex.itemsCenter} p-[var(--cuix-spacing-lg)] pt-0`,
);
