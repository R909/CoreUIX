// Prop types for Header and its sub-parts.
import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type {
  headerVariants,
  headerProfileVariants,
  headerProfileDetailsVariants,
  headerProfileNameVariants,
  headerProfileEmailVariants,
  headerProfileAvatarVariants,
} from "@components/layout/header/header.variants";

export type HeaderProps = React.ComponentPropsWithoutRef<"header"> &
  VariantProps<typeof headerVariants>;

export type HeaderProfileProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof headerProfileVariants>;

export type HeaderProfileDetailsProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof headerProfileDetailsVariants>;

export type HeaderProfileNameProps = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof headerProfileNameVariants>;

export type HeaderProfileEmailProps = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof headerProfileEmailVariants>;

export type HeaderProfileAvatarProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof headerProfileAvatarVariants>;
