// Style variants for SidebarMenuButton, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

// eslint-disable-next-line @typescript-eslint/typedef -- cva()'s generic return type narrows to this call's literal variant keys; annotating with ReturnType<typeof cva> widens it and breaks callers.
export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-[var(--cuix-sidebar-ring)] transition-[width,height,padding] hover:bg-[var(--cuix-sidebar-accent)] hover:text-[var(--cuix-sidebar-accent-foreground)] focus-visible:ring-2 active:bg-[var(--cuix-sidebar-accent)] active:text-[var(--cuix-sidebar-accent-foreground)] disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-[var(--cuix-sidebar-accent)] data-[active=true]:font-medium data-[active=true]:text-[var(--cuix-sidebar-accent-foreground)] data-[state=open]:hover:bg-[var(--cuix-sidebar-accent)] data-[state=open]:hover:text-[var(--cuix-sidebar-accent-foreground)] group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "hover:bg-[var(--cuix-sidebar-accent)] hover:text-[var(--cuix-sidebar-accent-foreground)]",
        outline:
          "bg-[var(--cuix-colors-background)] shadow-[0_0_0_1px_var(--cuix-sidebar-border)] hover:bg-[var(--cuix-sidebar-accent)] hover:text-[var(--cuix-sidebar-accent-foreground)] hover:shadow-[0_0_0_1px_var(--cuix-sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
