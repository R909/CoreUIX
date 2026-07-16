// Prop types for Table and its sub-parts.
import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type {
  tableVariants,
  tableHeaderVariants,
  tableBodyVariants,
  tableFooterVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
  tableCaptionVariants,
} from "@components/layout/table/table.variants";

export type TableProps = React.HTMLAttributes<HTMLTableElement> &
  VariantProps<typeof tableVariants>;

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement> &
  VariantProps<typeof tableHeaderVariants>;

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement> &
  VariantProps<typeof tableBodyVariants>;

export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement> &
  VariantProps<typeof tableFooterVariants>;

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> &
  VariantProps<typeof tableRowVariants>;

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> &
  VariantProps<typeof tableHeadVariants>;

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> &
  VariantProps<typeof tableCellVariants>;

export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement> &
  VariantProps<typeof tableCaptionVariants>;
