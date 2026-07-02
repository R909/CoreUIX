import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { buttonVariants } from "@coreuix/components/primitives/button/Button.styles";

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
