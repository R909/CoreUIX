// Label component for form field captions.
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@utils/cn";

import { labelVariants } from "@components/primitives/label/label.variants";
import type { LabelProps } from "@components/primitives/label/label.types";

const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<React.ElementRef<typeof LabelPrimitive.Root>>
> = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }: LabelProps, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      data-slot="label"
      className={cn(labelVariants(), className)}
      {...props}
    />
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
