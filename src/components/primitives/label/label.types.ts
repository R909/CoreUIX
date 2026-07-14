// Prop types for the Label component.
import type * as React from "react";
import type { VariantProps } from "class-variance-authority";
import type * as LabelPrimitive from "@radix-ui/react-label";

import type { labelVariants } from "@/components/primitives/label/label.variants";

export type LabelProps = React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
> &
  VariantProps<typeof labelVariants>;
