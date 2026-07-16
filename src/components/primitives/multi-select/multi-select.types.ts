// Prop types for MultiSelect and its sub-parts.
import type * as React from "react";

import type { ButtonProps } from "@components/primitives/button/button.types";
import type {
  CommandProps,
  CommandItemProps,
  CommandGroupProps,
  CommandSeparatorProps,
} from "@components/primitives/command/command.types";

// Shared state, exposed to every sub-part via MultiSelectContext.
export type MultiSelectContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedValues: Set<string>;
  toggleValue: (value: string) => void;
  items: Map<string, React.ReactNode>;
  single: boolean;
  onItemAdded: (value: string, label: React.ReactNode) => void;
};

// Root: owns the open/selected state, controlled via values/onValuesChange
// or uncontrolled via defaultValues.
export type MultiSelectProps = {
  children: React.ReactNode;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  single?: boolean;
};

// Trigger button that opens the dropdown; delegates most props to Button.
export type MultiSelectTriggerProps = ButtonProps;

// Renders the placeholder or the row of selected-value chips.
export type MultiSelectValueProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  placeholder?: string;
  clickToRemove?: boolean;
  overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff";
};

// Dropdown panel; wraps Command, optionally with a search input.
export type MultiSelectContentProps = Omit<CommandProps, "children"> & {
  search?: boolean | { placeholder?: string; emptyMessage?: string };
  children: React.ReactNode;
};

// Selectable option row; badgeLabel overrides what's shown in a selected chip.
export type MultiSelectItemProps = Omit<CommandItemProps, "value"> & {
  badgeLabel?: React.ReactNode;
  value: string;
};

export type MultiSelectGroupProps = CommandGroupProps;

export type MultiSelectSeparatorProps = CommandSeparatorProps;
