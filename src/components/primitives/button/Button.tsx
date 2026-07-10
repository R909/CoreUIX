// Button component for clickable actions.
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/utils/cn";

import { buttonVariants } from "@/components/primitives/button/button.variants";
import type { ButtonProps } from "@/components/primitives/button/Button.types";

// asChild lets the button render as a different element (e.g. a Link).
const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { Button };
