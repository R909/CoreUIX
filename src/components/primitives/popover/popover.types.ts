// Prop types for the Popover component.
import type * as React from "react";
import type * as PopoverPrimitive from "@radix-ui/react-popover";
import type { VariantProps } from "class-variance-authority";

import type { popoverContentVariants } from "@components/primitives/popover/popover.variants";

export type PopoverContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> &
  VariantProps<typeof popoverContentVariants>;
