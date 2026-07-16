// Checkbox component for a boolean toggle input.
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@utils/cn";
import {
  checkboxVariants,
  checkboxIndicatorVariants,
} from "@components/primitives/checkbox/checkbox.variants";
import type { CheckboxProps } from "@components/primitives/checkbox/checkbox.types";

const Checkbox: React.ForwardRefExoticComponent<
  CheckboxProps &
    React.RefAttributes<React.ComponentRef<typeof CheckboxPrimitive.Root>>
> = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }: CheckboxProps, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(checkboxVariants(), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className={cn(checkboxIndicatorVariants())}
    >
      <Check className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
