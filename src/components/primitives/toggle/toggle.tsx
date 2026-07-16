// Toggle component for a two-state pressed/unpressed control.
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import { cn } from "@utils/cn";
import { toggleVariants } from "@components/primitives/toggle/toggle.variants";
import type { ToggleProps } from "@components/primitives/toggle/toggle.types";

const Toggle: React.ForwardRefExoticComponent<
  ToggleProps &
    React.RefAttributes<React.ComponentRef<typeof TogglePrimitive.Root>>
> = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }: ToggleProps, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    data-slot="toggle"
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
