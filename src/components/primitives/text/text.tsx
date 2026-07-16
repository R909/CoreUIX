// Text component for styled heading/body/caption/label copy.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@utils/cn";
import { textVariants } from "@components/primitives/text/text.variants";
import type { TextProps } from "@components/primitives/text/text.types";

// asChild lets Text render as a different element (e.g. a heading tag or Link).
const Text: React.ForwardRefExoticComponent<
  TextProps & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    { className, variant, color, asChild = false, ...props }: TextProps,
    ref,
  ) => {
    const Comp: React.ElementType = asChild ? Slot : "p";

    return (
      <Comp
        ref={ref}
        data-slot="text"
        className={cn(textVariants({ variant, color }), className)}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";

export { Text };
