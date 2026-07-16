// Prop types for the Checkbox component.
import type * as React from "react";
import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";

// Checkbox props are entirely delegated to the underlying Radix primitive.
export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;
