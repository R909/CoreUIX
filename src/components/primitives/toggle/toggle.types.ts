// Prop types for the Toggle component.
import type * as React from "react";
import type * as TogglePrimitive from "@radix-ui/react-toggle";
import type { VariantProps } from "class-variance-authority";

import type { toggleVariants } from "@components/primitives/toggle/toggle.variants";

// Toggle props plus the variant/size props from toggleVariants.
export type ToggleProps = React.ComponentPropsWithoutRef<
  typeof TogglePrimitive.Root
> &
  VariantProps<typeof toggleVariants>;
