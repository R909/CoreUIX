// Style variants for Label, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers like `labelVariants()`.
export const labelVariants = cva(
  "text-[var(--cuix-font-size-sm)] font-medium leading-[var(--cuix-line-height-tight)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);
