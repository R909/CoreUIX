// Card component and its sub-parts: header, title, description, content, footer.
import * as React from "react";

import { cn } from "@utils/cn";

import {
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardFooterVariants,
} from "@components/layout/card/card.variants";
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "@components/layout/card/card.types";

// Outer card container.
const Card: React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }: CardProps, ref) => (
    <div ref={ref} className={cn(cardVariants(), className)} {...props} />
  ),
);
Card.displayName = "Card";

// Header section, usually holds the title and description.
const CardHeader: React.ForwardRefExoticComponent<
  CardHeaderProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }: CardHeaderProps, ref) => (
    <div ref={ref} className={cn(cardHeaderVariants(), className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

// Title text within CardHeader.
const CardTitle: React.ForwardRefExoticComponent<
  CardTitleProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, ...props }: CardTitleProps, ref) => (
    <div ref={ref} className={cn(cardTitleVariants(), className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

// Muted supporting text shown under the title.
const CardDescription: React.ForwardRefExoticComponent<
  CardDescriptionProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }: CardDescriptionProps, ref) => (
    <div
      ref={ref}
      className={cn(cardDescriptionVariants(), className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

// Main body region of the card.
const CardContent: React.ForwardRefExoticComponent<
  CardContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }: CardContentProps, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants(), className)}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

// Footer row, usually for action buttons.
const CardFooter: React.ForwardRefExoticComponent<
  CardFooterProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }: CardFooterProps, ref) => (
    <div ref={ref} className={cn(cardFooterVariants(), className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
