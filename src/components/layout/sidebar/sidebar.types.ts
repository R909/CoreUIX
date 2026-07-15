// Prop types for Sidebar and its sub-parts.
import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { TooltipContent } from "@components/layout/sidebar/tooltip";
import type { sidebarMenuButtonVariants } from "@components/layout/sidebar/sidebar.variants";

export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type SidebarProps = React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

export type SidebarGroupLabelProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
};

export type SidebarGroupActionProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

export type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>;

export type SidebarMenuActionProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
};

export type SidebarMenuSkeletonProps = React.ComponentProps<"div"> & {
  showIcon?: boolean;
};

export type SidebarMenuSubButtonProps = React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
};
