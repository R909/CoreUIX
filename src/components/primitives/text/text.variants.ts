// Style variants for Text, using the theme's --cuix-* CSS variables and its
// text.heading/body/caption/label size presets (theme/tokens/textTokens.ts).
import { cva } from "class-variance-authority";

// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant/color keys; annotating with ReturnType<typeof cva> widens it and breaks callers like `textVariants({ variant, color })`.
export const textVariants = cva("", {
  variants: {
    variant: {
      h1: "font-heading text-h1",
      h2: "font-heading text-h2",
      h3: "font-heading text-h3",
      h4: "font-heading text-h4",
      "body-sm": "font-body text-body-sm",
      body: "font-body text-body",
      "body-lg": "font-body text-body-lg",
      "caption-sm": "font-body text-caption-sm",
      caption: "font-body text-caption",
      "label-sm": "font-body text-label-sm",
      label: "font-body text-label",
    },
    color: {
      primary: "text-[var(--cuix-text-color-primary)]",
      secondary: "text-[var(--cuix-text-color-secondary)]",
      muted: "text-[var(--cuix-text-color-muted)]",
      disabled: "text-[var(--cuix-text-color-disabled)]",
      link: "text-[var(--cuix-text-color-link)]",
      danger: "text-[var(--cuix-text-color-danger)]",
      success: "text-[var(--cuix-text-color-success)]",
      warning: "text-[var(--cuix-text-color-warning)]",
      inverse: "text-[var(--cuix-text-color-inverse)]",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
  },
});
