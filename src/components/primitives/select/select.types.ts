// Prop types for Select and its sub-parts.
import type * as React from "react";
import type * as SelectPrimitive from "@radix-ui/react-select";
import type { VariantProps } from "class-variance-authority";

import type {
  selectTriggerVariants,
  selectScrollButtonVariants,
  selectContentVariants,
  selectLabelVariants,
  selectItemVariants,
  selectSeparatorVariants,
} from "@components/primitives/select/select.variants";

export type SelectTriggerProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> &
  VariantProps<typeof selectTriggerVariants>;

export type SelectScrollUpButtonProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollUpButton
> &
  VariantProps<typeof selectScrollButtonVariants>;

export type SelectScrollDownButtonProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollDownButton
> &
  VariantProps<typeof selectScrollButtonVariants>;

export type SelectContentProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> &
  VariantProps<typeof selectContentVariants>;

export type SelectLabelProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Label
> &
  VariantProps<typeof selectLabelVariants>;

export type SelectItemProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> &
  VariantProps<typeof selectItemVariants>;

export type SelectSeparatorProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Separator
> &
  VariantProps<typeof selectSeparatorVariants>;
