// Tabs component and its sub-parts: list, trigger, content panel.
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@utils/cn";

import {
  tabsVariants,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
} from "@components/primitives/tabs/tabs.variants";
import type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "@components/primitives/tabs/tabs.types";

// Root container; stacks the trigger list above its content panels.
const Tabs: React.ForwardRefExoticComponent<
  TabsProps & React.RefAttributes<React.ComponentRef<typeof TabsPrimitive.Root>>
> = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, ...props }: TabsProps, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      data-slot="tabs"
      className={cn(tabsVariants(), className)}
      {...props}
    />
  ),
);
Tabs.displayName = TabsPrimitive.Root.displayName;

// Pill-shaped row that holds the triggers.
const TabsList: React.ForwardRefExoticComponent<
  TabsListProps &
    React.RefAttributes<React.ComponentRef<typeof TabsPrimitive.List>>
> = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }: TabsListProps, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={cn(tabsListVariants(), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// Individual clickable tab; data-[state=active] styles the selected trigger.
const TabsTrigger: React.ForwardRefExoticComponent<
  TabsTriggerProps &
    React.RefAttributes<React.ComponentRef<typeof TabsPrimitive.Trigger>>
> = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }: TabsTriggerProps, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(tabsTriggerVariants(), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Panel shown when its matching trigger is active.
const TabsContent: React.ForwardRefExoticComponent<
  TabsContentProps &
    React.RefAttributes<React.ComponentRef<typeof TabsPrimitive.Content>>
> = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }: TabsContentProps, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn(tabsContentVariants(), className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
