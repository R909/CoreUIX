// Button component for clickable actions.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@utils/cn";
import { buttonVariants } from "@components/primitives/button/button.variants";
import type { ButtonProps } from "@components/primitives/button/button.types";

// asChild lets the button render as a different element (e.g. a Link).
const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, ...props }: ButtonProps,
    ref,
  ) => {
    const Comp: React.ElementType = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
