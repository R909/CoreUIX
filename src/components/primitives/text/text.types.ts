// Prop types for the Text component.
import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { textVariants } from "@components/primitives/text/text.variants";

// Paragraph props plus the text's variant/color props and asChild.
export type TextProps = React.ComponentPropsWithoutRef<"p"> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean;
  };
