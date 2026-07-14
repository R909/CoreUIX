// Prop types for the Badge component.
import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/primitives/badge/badge.variants";

// Span props plus the badge's variant props and asChild.
export type BadgeProps = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };
