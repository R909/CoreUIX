"use client";

// Command component for a searchable, filterable list (cmdk-backed).
// Note: cmdk also ships a `CommandDialog` (Command mounted inside a Dialog).
// That's deliberately not included here since this repo has no standalone
// Dialog primitive yet — add it if/when one exists.
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@utils/cn";
import {
  commandVariants,
  commandInputWrapperVariants,
  commandInputVariants,
  commandListVariants,
  commandEmptyVariants,
  commandGroupVariants,
  commandSeparatorVariants,
  commandItemVariants,
  commandShortcutVariants,
} from "@components/primitives/command/command.variants";
import type {
  CommandProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandSeparatorProps,
  CommandItemProps,
  CommandShortcutProps,
} from "@components/primitives/command/command.types";

// Outer command container.
const Command: React.ForwardRefExoticComponent<
  CommandProps &
    React.RefAttributes<React.ComponentRef<typeof CommandPrimitive>>
> = React.forwardRef<React.ComponentRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, ...props }: CommandProps, ref) => (
    <CommandPrimitive
      ref={ref}
      data-slot="command"
      className={cn(commandVariants(), className)}
      {...props}
    />
  ),
);
Command.displayName = CommandPrimitive.displayName;

// Search input, with a leading search icon.
const CommandInput: React.ForwardRefExoticComponent<
  CommandInputProps &
    React.RefAttributes<React.ComponentRef<typeof CommandPrimitive.Input>>
> = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, ...props }: CommandInputProps, ref) => (
  <div
    data-slot="command-input-wrapper"
    className={cn(commandInputWrapperVariants())}
  >
    <Search className="mr-2 size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      data-slot="command-input"
      className={cn(commandInputVariants(), className)}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

// Scrollable list of results.
const CommandList: React.ForwardRefExoticComponent<
  CommandListProps &
    React.RefAttributes<React.ComponentRef<typeof CommandPrimitive.List>>
> = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  CommandListProps
>(({ className, ...props }: CommandListProps, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    className={cn(commandListVariants(), className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

// Shown when no results match the search.
const CommandEmpty: React.ForwardRefExoticComponent<
  CommandEmptyProps &
    React.RefAttributes<React.ComponentRef<typeof CommandPrimitive.Empty>>
> = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  CommandEmptyProps
>(({ className, ...props }: CommandEmptyProps, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className={cn(commandEmptyVariants(), className)}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// Groups a labeled section of items.
const CommandGroup: React.ForwardRefExoticComponent<
  CommandGroupProps &
    React.RefAttributes<React.ComponentRef<typeof CommandPrimitive.Group>>
> = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, ...props }: CommandGroupProps, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(commandGroupVariants(), className)}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

// Thin divider between groups of items.
const CommandSeparator: React.ForwardRefExoticComponent<
  CommandSeparatorProps &
    React.RefAttributes<React.ComponentRef<typeof CommandPrimitive.Separator>>
> = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  CommandSeparatorProps
>(({ className, ...props }: CommandSeparatorProps, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn(commandSeparatorVariants(), className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// Selectable result row.
const CommandItem: React.ForwardRefExoticComponent<
  CommandItemProps &
    React.RefAttributes<React.ComponentRef<typeof CommandPrimitive.Item>>
> = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, ...props }: CommandItemProps, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(commandItemVariants(), className)}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

// Keyboard-shortcut hint aligned to the end of a row.
function CommandShortcut({
  className,
  ...props
}: CommandShortcutProps): React.JSX.Element {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(commandShortcutVariants(), className)}
      {...props}
    />
  );
}
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
