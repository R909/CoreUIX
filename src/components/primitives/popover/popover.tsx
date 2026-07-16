"use client";

// Popover component for a floating panel anchored to a trigger.
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@utils/cn";
import { popoverContentVariants } from "@components/primitives/popover/popover.variants";
import type { PopoverContentProps } from "@components/primitives/popover/popover.types";

// Zero-styling passthroughs: these sub-parts hold no classes of their own.
const Popover: typeof PopoverPrimitive.Root = PopoverPrimitive.Root;
const PopoverTrigger: typeof PopoverPrimitive.Trigger =
  PopoverPrimitive.Trigger;
const PopoverAnchor: typeof PopoverPrimitive.Anchor = PopoverPrimitive.Anchor;

// Floating panel anchored to the trigger.
const PopoverContent: React.ForwardRefExoticComponent<
  PopoverContentProps &
    React.RefAttributes<React.ComponentRef<typeof PopoverPrimitive.Content>>
> = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      ...props
    }: PopoverContentProps,
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(popoverContentVariants(), className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
