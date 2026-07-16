"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@utils/cn";
import { sheetVariants } from "@components/layout/sidebar/sheet/sheet.variants";
import type { SheetContentProps } from "@components/layout/sidebar/sheet/sheet.types";

const Sheet: typeof SheetPrimitive.Root = SheetPrimitive.Root;

const SheetTrigger: typeof SheetPrimitive.Trigger = SheetPrimitive.Trigger;

const SheetClose: typeof SheetPrimitive.Close = SheetPrimitive.Close;

const SheetPortal: typeof SheetPrimitive.Portal = SheetPrimitive.Portal;

const SheetOverlay: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> &
    React.RefAttributes<React.ComponentRef<typeof SheetPrimitive.Overlay>>
> = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>,
    ref,
  ) => (
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
      ref={ref}
    />
  ),
);
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent: React.ForwardRefExoticComponent<
  SheetContentProps &
    React.RefAttributes<React.ComponentRef<typeof SheetPrimitive.Content>>
> = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    { side = "right", className, children, ...props }: SheetContentProps,
    ref,
  ) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> &
    React.RefAttributes<React.ComponentRef<typeof SheetPrimitive.Title>>
> = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>,
    ref,
  ) => (
    <SheetPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  ),
);
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> &
    React.RefAttributes<React.ComponentRef<typeof SheetPrimitive.Description>>
> = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>,
    ref,
  ) => (
    <SheetPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
