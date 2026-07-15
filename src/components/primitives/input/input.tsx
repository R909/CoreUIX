// Input component for single-line text entry.
import * as React from "react";

import { cn } from "@utils/cn";

import { inputVariants } from "@components/primitives/input/input.variants";
import type { InputProps } from "@components/primitives/input/input.types";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants(), className)}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
