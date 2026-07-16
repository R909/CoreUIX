// Textarea component for multi-line text entry.
import * as React from "react";

import { cn } from "@utils/cn";

import { textareaVariants } from "@components/primitives/textarea/textarea.variants";
import type { TextareaProps } from "@components/primitives/textarea/textarea.types";

const Textarea: React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>
> = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }: TextareaProps, ref) => (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants(), className)}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
