import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@utils/cn";
import { badgeVariants } from "./badge.variants";
import type { BadgeProps } from "./badge.types";

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

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
