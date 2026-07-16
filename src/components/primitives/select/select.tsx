// Select component for choosing a single value from a dropdown list.
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@utils/cn";
import {
  selectTriggerVariants,
  selectScrollButtonVariants,
  selectContentVariants,
  selectLabelVariants,
  selectItemVariants,
  selectSeparatorVariants,
} from "@components/primitives/select/select.variants";
import type {
  SelectTriggerProps,
  SelectScrollUpButtonProps,
  SelectScrollDownButtonProps,
  SelectContentProps,
  SelectLabelProps,
  SelectItemProps,
  SelectSeparatorProps,
} from "@components/primitives/select/select.types";

// Zero-styling passthroughs: these sub-parts hold no classes of their own.
const Select: typeof SelectPrimitive.Root = SelectPrimitive.Root;
const SelectGroup: typeof SelectPrimitive.Group = SelectPrimitive.Group;
const SelectValue: typeof SelectPrimitive.Value = SelectPrimitive.Value;

// Trigger button that opens the dropdown.
const SelectTrigger: React.ForwardRefExoticComponent<
  SelectTriggerProps &
    React.RefAttributes<React.ComponentRef<typeof SelectPrimitive.Trigger>>
> = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, ...props }: SelectTriggerProps, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(selectTriggerVariants(), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Scroll-up button shown at the top of a long dropdown.
const SelectScrollUpButton: React.ForwardRefExoticComponent<
  SelectScrollUpButtonProps &
    React.RefAttributes<
      React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>
    >
> = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  SelectScrollUpButtonProps
>(({ className, ...props }: SelectScrollUpButtonProps, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn(selectScrollButtonVariants(), className)}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

// Scroll-down button shown at the bottom of a long dropdown.
const SelectScrollDownButton: React.ForwardRefExoticComponent<
  SelectScrollDownButtonProps &
    React.RefAttributes<
      React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>
    >
> = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  SelectScrollDownButtonProps
>(({ className, ...props }: SelectScrollDownButtonProps, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn(selectScrollButtonVariants(), className)}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

// Dropdown panel holding the list of options.
const SelectContent: React.ForwardRefExoticComponent<
  SelectContentProps &
    React.RefAttributes<React.ComponentRef<typeof SelectPrimitive.Content>>
> = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    { className, children, position = "popper", ...props }: SelectContentProps,
    ref,
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        data-slot="select-content"
        position={position}
        className={cn(
          selectContentVariants(),
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

// Section heading within the dropdown.
const SelectLabel: React.ForwardRefExoticComponent<
  SelectLabelProps &
    React.RefAttributes<React.ComponentRef<typeof SelectPrimitive.Label>>
> = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, ...props }: SelectLabelProps, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn(selectLabelVariants(), className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// Selectable option row.
const SelectItem: React.ForwardRefExoticComponent<
  SelectItemProps &
    React.RefAttributes<React.ComponentRef<typeof SelectPrimitive.Item>>
> = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, ...props }: SelectItemProps, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(selectItemVariants(), className)}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// Thin divider between groups of options.
const SelectSeparator: React.ForwardRefExoticComponent<
  SelectSeparatorProps &
    React.RefAttributes<React.ComponentRef<typeof SelectPrimitive.Separator>>
> = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }: SelectSeparatorProps, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn(selectSeparatorVariants(), className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
