import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@utils/cn";
import { badgeVariants } from "@components/primitives/badge/badge.variants";
import type { BadgeProps } from "@components/primitives/badge/badge.types";

const Badge: React.ForwardRefExoticComponent<
  BadgeProps & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }: BadgeProps, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
