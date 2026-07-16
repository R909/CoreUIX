// Prop types for Tabs and its sub-parts.
import type * as React from "react";
import type * as TabsPrimitive from "@radix-ui/react-tabs";
import type { VariantProps } from "class-variance-authority";

import type {
  tabsVariants,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
} from "@components/primitives/tabs/tabs.variants";

export type TabsProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Root
> &
  VariantProps<typeof tabsVariants>;

export type TabsListProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> &
  VariantProps<typeof tabsListVariants>;

export type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> &
  VariantProps<typeof tabsTriggerVariants>;

export type TabsContentProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
> &
  VariantProps<typeof tabsContentVariants>;
