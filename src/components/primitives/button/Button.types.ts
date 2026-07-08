import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { buttonVariants } from "@/components/primitives/button/button.variants";

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
