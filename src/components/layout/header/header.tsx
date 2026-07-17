// Header component and its sub-parts: a right-aligned profile block (name + avatar).
import * as React from "react";

import { cn } from "@utils/cn";

import {
  headerVariants,
  headerProfileVariants,
  headerProfileDetailsVariants,
  headerProfileNameVariants,
  headerProfileEmailVariants,
  headerProfileAvatarVariants,
} from "@components/layout/header/header.variants";
import type {
  HeaderProps,
  HeaderProfileProps,
  HeaderProfileDetailsProps,
  HeaderProfileNameProps,
  HeaderProfileEmailProps,
  HeaderProfileAvatarProps,
} from "@components/layout/header/header.types";

// Root bar; sits at the top of a page/section.
const Header: React.ForwardRefExoticComponent<
  HeaderProps & React.RefAttributes<HTMLElement>
> = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }: HeaderProps, ref) => (
    <header
      ref={ref}
      data-slot="header"
      className={cn(headerVariants(), className)}
      {...props}
    />
  ),
);
Header.displayName = "Header";

// Right-aligned block holding the user's details (name + email) and avatar.
const HeaderProfile: React.ForwardRefExoticComponent<
  HeaderProfileProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, HeaderProfileProps>(
  ({ className, ...props }: HeaderProfileProps, ref) => (
    <div
      ref={ref}
      data-slot="header-profile"
      className={cn(headerProfileVariants(), className)}
      {...props}
    />
  ),
);
HeaderProfile.displayName = "HeaderProfile";

// Stacks the name above the email, right-aligned next to the avatar.
const HeaderProfileDetails: React.ForwardRefExoticComponent<
  HeaderProfileDetailsProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, HeaderProfileDetailsProps>(
  ({ className, ...props }: HeaderProfileDetailsProps, ref) => (
    <div
      ref={ref}
      data-slot="header-profile-details"
      className={cn(headerProfileDetailsVariants(), className)}
      {...props}
    />
  ),
);
HeaderProfileDetails.displayName = "HeaderProfileDetails";

// User's display name text.
const HeaderProfileName: React.ForwardRefExoticComponent<
  HeaderProfileNameProps & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, HeaderProfileNameProps>(
  ({ className, ...props }: HeaderProfileNameProps, ref) => (
    <span
      ref={ref}
      data-slot="header-profile-name"
      className={cn(headerProfileNameVariants(), className)}
      {...props}
    />
  ),
);
HeaderProfileName.displayName = "HeaderProfileName";

// User's email text shown under the name.
const HeaderProfileEmail: React.ForwardRefExoticComponent<
  HeaderProfileEmailProps & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, HeaderProfileEmailProps>(
  ({ className, ...props }: HeaderProfileEmailProps, ref) => (
    <span
      ref={ref}
      data-slot="header-profile-email"
      className={cn(headerProfileEmailVariants(), className)}
      {...props}
    />
  ),
);
HeaderProfileEmail.displayName = "HeaderProfileEmail";

// Circular avatar slot; pass an <img> or initials as children.
const HeaderProfileAvatar: React.ForwardRefExoticComponent<
  HeaderProfileAvatarProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, HeaderProfileAvatarProps>(
  ({ className, ...props }: HeaderProfileAvatarProps, ref) => (
    <div
      ref={ref}
      data-slot="header-profile-avatar"
      className={cn(headerProfileAvatarVariants(), className)}
      {...props}
    />
  ),
);
HeaderProfileAvatar.displayName = "HeaderProfileAvatar";

export {
  Header,
  HeaderProfile,
  HeaderProfileDetails,
  HeaderProfileName,
  HeaderProfileEmail,
  HeaderProfileAvatar,
};
