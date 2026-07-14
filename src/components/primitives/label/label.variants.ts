// Style variants for Label, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

export const labelVariants = cva(
  "text-[var(--cuix-font-size-sm)] font-medium leading-[var(--cuix-line-height-tight)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);
