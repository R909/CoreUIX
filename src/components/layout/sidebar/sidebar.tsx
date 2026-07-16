import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@hooks/use-mobile";
import { cn } from "@utils/cn";
import { Button } from "@components/primitives/button";
import { Input } from "@components/primitives/input";
import { Separator } from "@components/layout/sidebar/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/layout/sidebar/sheet";
import { Skeleton } from "@components/layout/sidebar/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/layout/sidebar/tooltip";
import { sidebarMenuButtonVariants } from "@components/layout/sidebar/sidebar.variants";
import type {
  SidebarContextProps,
  SidebarProviderProps,
  SidebarProps,
  SidebarGroupLabelProps,
  SidebarGroupActionProps,
  SidebarMenuButtonProps,
  SidebarMenuActionProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubButtonProps,
} from "@components/layout/sidebar/sidebar.types";

import {
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_KEYBOARD_SHORTCUT,
} from "@components/layout/sidebar/sidebar-constant";

const SidebarContext: React.Context<SidebarContextProps | null> =
  React.createContext<SidebarContextProps | null>(null);

function useSidebar(): SidebarContextProps {
  const context: SidebarContextProps | null = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

const SidebarProvider: React.ForwardRefExoticComponent<
  SidebarProviderProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    }: SidebarProviderProps,
    ref,
  ) => {
    const isMobile: boolean = useIsMobile();
    const [openMobile, setOpenMobile]: [
      boolean,
      React.Dispatch<React.SetStateAction<boolean>>,
    ] = React.useState<boolean>(false);

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen]: [
      boolean,
      React.Dispatch<React.SetStateAction<boolean>>,
    ] = React.useState<boolean>(defaultOpen);
    const open: boolean = openProp ?? _open;
    const setOpen: (value: boolean | ((value: boolean) => boolean)) => void =
      React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
          const openState: boolean =
            typeof value === "function" ? value(open) : value;
          if (setOpenProp) {
            setOpenProp(openState);
          } else {
            _setOpen(openState);
          }

          // This sets the cookie to keep the sidebar state.
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        },
        [setOpenProp, open],
      );

    // Helper to toggle the sidebar.
    const toggleSidebar: () => void = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown: (event: KeyboardEvent) => void = (
        event: KeyboardEvent,
      ): void => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";

    const contextValue: SidebarContextProps =
      React.useMemo<SidebarContextProps>(
        () => ({
          state,
          open,
          setOpen,
          isMobile,
          openMobile,
          setOpenMobile,
          toggleSidebar,
        }),
        [
          state,
          open,
          setOpen,
          isMobile,
          openMobile,
          setOpenMobile,
          toggleSidebar,
        ],
      );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-[var(--cuix-sidebar-background)]",
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar: React.ForwardRefExoticComponent<
  SidebarProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    }: SidebarProps,
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile }: SidebarContextProps =
      useSidebar();

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-[var(--cuix-sidebar-background)] text-[var(--cuix-sidebar-foreground)]",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-[var(--cuix-sidebar-background)] p-0 text-[var(--cuix-sidebar-foreground)] [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="group peer hidden text-[var(--cuix-sidebar-foreground)] md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-[var(--cuix-sidebar-background)] group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-[var(--cuix-sidebar-border)] group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger: React.ForwardRefExoticComponent<
  React.ComponentProps<typeof Button> &
    React.RefAttributes<React.ElementRef<typeof Button>>
> = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(
  (
    { className, onClick, ...props }: React.ComponentProps<typeof Button>,
    ref,
  ) => {
    const { toggleSidebar }: SidebarContextProps = useSidebar();

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className)}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail: React.ForwardRefExoticComponent<
  React.ComponentProps<"button"> & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }: React.ComponentProps<"button">, ref) => {
    const { toggleSidebar }: SidebarContextProps = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-[var(--cuix-sidebar-border)] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-[var(--cuix-sidebar-background)]",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset: React.ForwardRefExoticComponent<
  React.ComponentProps<"main"> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(
  ({ className, ...props }: React.ComponentProps<"main">, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "relative flex w-full flex-1 flex-col bg-[var(--cuix-colors-background)]",
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarInset.displayName = "SidebarInset";

const SidebarInput: React.ForwardRefExoticComponent<
  React.ComponentProps<typeof Input> &
    React.RefAttributes<React.ElementRef<typeof Input>>
> = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }: React.ComponentProps<typeof Input>, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-[var(--cuix-colors-background)] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--cuix-sidebar-ring)]",
        className,
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader: React.ForwardRefExoticComponent<
  React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }: React.ComponentProps<"div">, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  },
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter: React.ForwardRefExoticComponent<
  React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }: React.ComponentProps<"div">, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  },
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator: React.ForwardRefExoticComponent<
  React.ComponentProps<typeof Separator> &
    React.RefAttributes<React.ElementRef<typeof Separator>>
> = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }: React.ComponentProps<typeof Separator>, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-[var(--cuix-sidebar-border)]", className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent: React.ForwardRefExoticComponent<
  React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }: React.ComponentProps<"div">, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarContent.displayName = "SidebarContent";

const SidebarGroup: React.ForwardRefExoticComponent<
  React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }: React.ComponentProps<"div">, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group"
        className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
        {...props}
      />
    );
  },
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel: React.ForwardRefExoticComponent<
  SidebarGroupLabelProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, asChild = false, ...props }: SidebarGroupLabelProps, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-[var(--cuix-sidebar-foreground)]/70 outline-none ring-[var(--cuix-sidebar-ring)] transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction: React.ForwardRefExoticComponent<
  SidebarGroupActionProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, SidebarGroupActionProps>(
  ({ className, asChild = false, ...props }: SidebarGroupActionProps, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-action"
        className={cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-[var(--cuix-sidebar-foreground)] outline-none ring-[var(--cuix-sidebar-ring)] transition-transform hover:bg-[var(--cuix-sidebar-accent)] hover:text-[var(--cuix-sidebar-accent-foreground)] focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent: React.ForwardRefExoticComponent<
  React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }: React.ComponentProps<"div">, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu: React.ForwardRefExoticComponent<
  React.ComponentProps<"ul"> & React.RefAttributes<HTMLUListElement>
> = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }: React.ComponentProps<"ul">, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem: React.ForwardRefExoticComponent<
  React.ComponentProps<"li"> & React.RefAttributes<HTMLLIElement>
> = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }: React.ComponentProps<"li">, ref) => (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton: React.ForwardRefExoticComponent<
  SidebarMenuButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    }: SidebarMenuButtonProps,
    ref,
  ) => {
    const Comp: React.ElementType = asChild ? Slot : "button";
    const { isMobile, state }: SidebarContextProps = useSidebar();

    const button: React.JSX.Element = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction: React.ForwardRefExoticComponent<
  SidebarMenuActionProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
  (
    {
      className,
      asChild = false,
      showOnHover = false,
      ...props
    }: SidebarMenuActionProps,
    ref,
  ) => {
    const Comp: React.ElementType = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-action"
        className={cn(
          "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-[var(--cuix-sidebar-foreground)] outline-none ring-[var(--cuix-sidebar-ring)] transition-transform hover:bg-[var(--cuix-sidebar-accent)] hover:text-[var(--cuix-sidebar-accent-foreground)] focus-visible:ring-2 peer-hover/menu-button:text-[var(--cuix-sidebar-accent-foreground)] [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "peer-data-[size=sm]/menu-button:top-1",
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "group-data-[collapsible=icon]:hidden",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-[var(--cuix-sidebar-accent-foreground)] md:opacity-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge: React.ForwardRefExoticComponent<
  React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }: React.ComponentProps<"div">, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-[var(--cuix-sidebar-foreground)]",
        "peer-hover/menu-button:text-[var(--cuix-sidebar-accent-foreground)] peer-data-[active=true]/menu-button:text-[var(--cuix-sidebar-accent-foreground)]",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton: React.ForwardRefExoticComponent<
  SidebarMenuSkeletonProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SidebarMenuSkeletonProps>(
  (
    { className, showIcon = false, ...props }: SidebarMenuSkeletonProps,
    ref,
  ) => {
    // Random width between 50 to 90%.
    const [width]: [string, React.Dispatch<React.SetStateAction<string>>] =
      React.useState<string>(() => `${Math.floor(Math.random() * 40) + 50}% `);

    return (
      <div
        ref={ref}
        data-sidebar="menu-skeleton"
        className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
        {...props}
      >
        {showIcon && (
          <Skeleton
            className="size-4 rounded-md"
            data-sidebar="menu-skeleton-icon"
          />
        )}
        <Skeleton
          className="h-4 max-w-[--skeleton-width] flex-1"
          data-sidebar="menu-skeleton-text"
          style={
            {
              "--skeleton-width": width,
            } as React.CSSProperties
          }
        />
      </div>
    );
  },
);
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub: React.ForwardRefExoticComponent<
  React.ComponentProps<"ul"> & React.RefAttributes<HTMLUListElement>
> = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }: React.ComponentProps<"ul">, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-[var(--cuix-sidebar-border)] px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem: React.ForwardRefExoticComponent<
  React.ComponentProps<"li"> & React.RefAttributes<HTMLLIElement>
> = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ ...props }: React.ComponentProps<"li">, ref) => (
    <li ref={ref} {...props} />
  ),
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton: React.ForwardRefExoticComponent<
  SidebarMenuSubButtonProps & React.RefAttributes<HTMLAnchorElement>
> = React.forwardRef<HTMLAnchorElement, SidebarMenuSubButtonProps>(
  (
    {
      asChild = false,
      size = "md",
      isActive,
      className,
      ...props
    }: SidebarMenuSubButtonProps,
    ref,
  ) => {
    const Comp: React.ElementType = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-[var(--cuix-sidebar-foreground)] outline-none ring-[var(--cuix-sidebar-ring)] hover:bg-[var(--cuix-sidebar-accent)] hover:text-[var(--cuix-sidebar-accent-foreground)] focus-visible:ring-2 active:bg-[var(--cuix-sidebar-accent)] active:text-[var(--cuix-sidebar-accent-foreground)] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[var(--cuix-sidebar-accent-foreground)]",
          "data-[active=true]:bg-[var(--cuix-sidebar-accent)] data-[active=true]:text-[var(--cuix-sidebar-accent-foreground)]",

          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
