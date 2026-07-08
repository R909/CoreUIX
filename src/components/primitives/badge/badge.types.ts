import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/primitives/badge/badge.variants";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };