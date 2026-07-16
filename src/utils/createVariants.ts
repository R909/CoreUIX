// Re-exports cva for defining component style variants.
import { cva } from "class-variance-authority";

export const createVariants: typeof cva = cva;

export type { VariantProps } from "class-variance-authority";
