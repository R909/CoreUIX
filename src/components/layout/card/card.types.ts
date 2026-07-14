// Prop types for Card and its sub-parts.
import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type {
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardFooterVariants,
} from "@/components/layout/card/card.variants";

export type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardHeaderVariants>;

export type CardTitleProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardTitleVariants>;

export type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardDescriptionVariants>;

export type CardContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardContentVariants>;

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardFooterVariants>;
