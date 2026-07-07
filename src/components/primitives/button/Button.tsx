import { Slot } from "@radix-ui/react-slot";

import { cn } from "@coreuix/utils/cn";

import { buttonVariants } from "@coreuix/components/primitives/button/button.variants";
import type { ButtonProps } from "@coreuix/components/primitives/button/Button.types";

const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export  { Button };
