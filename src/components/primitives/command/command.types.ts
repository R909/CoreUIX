// Prop types for Command and its sub-parts.
import type * as React from "react";
import type { Command as CommandPrimitive } from "cmdk";
import type { VariantProps } from "class-variance-authority";

import type {
  commandVariants,
  commandInputVariants,
  commandListVariants,
  commandEmptyVariants,
  commandGroupVariants,
  commandSeparatorVariants,
  commandItemVariants,
} from "@components/primitives/command/command.variants";

export type CommandProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive
> &
  VariantProps<typeof commandVariants>;

export type CommandInputProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Input
> &
  VariantProps<typeof commandInputVariants>;

export type CommandListProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.List
> &
  VariantProps<typeof commandListVariants>;

export type CommandEmptyProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Empty
> &
  VariantProps<typeof commandEmptyVariants>;

export type CommandGroupProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Group
> &
  VariantProps<typeof commandGroupVariants>;

export type CommandSeparatorProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Separator
> &
  VariantProps<typeof commandSeparatorVariants>;

export type CommandItemProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Item
> &
  VariantProps<typeof commandItemVariants>;

export type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
