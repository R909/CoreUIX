// Table component and its sub-parts: header, body, footer, row, head, cell, caption.
import * as React from "react";

import { cn } from "@utils/cn";

import {
  tableVariants,
  tableHeaderVariants,
  tableBodyVariants,
  tableFooterVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
  tableCaptionVariants,
} from "@components/layout/table/table.variants";
import type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
} from "@components/layout/table/table.types";

// Wraps <table> in a horizontally-scrollable container.
const Table: React.ForwardRefExoticComponent<
  TableProps & React.RefAttributes<HTMLTableElement>
> = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }: TableProps, ref) => (
    <div className="relative w-[var(--cuix-width-full)] overflow-auto">
      <table ref={ref} className={cn(tableVariants(), className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader: React.ForwardRefExoticComponent<
  TableHeaderProps & React.RefAttributes<HTMLTableSectionElement>
> = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }: TableHeaderProps, ref) => (
    <thead
      ref={ref}
      className={cn(tableHeaderVariants(), className)}
      {...props}
    />
  ),
);
TableHeader.displayName = "TableHeader";

const TableBody: React.ForwardRefExoticComponent<
  TableBodyProps & React.RefAttributes<HTMLTableSectionElement>
> = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }: TableBodyProps, ref) => (
    <tbody
      ref={ref}
      className={cn(tableBodyVariants(), className)}
      {...props}
    />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter: React.ForwardRefExoticComponent<
  TableFooterProps & React.RefAttributes<HTMLTableSectionElement>
> = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }: TableFooterProps, ref) => (
    <tfoot
      ref={ref}
      className={cn(tableFooterVariants(), className)}
      {...props}
    />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow: React.ForwardRefExoticComponent<
  TableRowProps & React.RefAttributes<HTMLTableRowElement>
> = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }: TableRowProps, ref) => (
    <tr ref={ref} className={cn(tableRowVariants(), className)} {...props} />
  ),
);
TableRow.displayName = "TableRow";

const TableHead: React.ForwardRefExoticComponent<
  TableHeadProps & React.RefAttributes<HTMLTableCellElement>
> = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }: TableHeadProps, ref) => (
    <th ref={ref} className={cn(tableHeadVariants(), className)} {...props} />
  ),
);
TableHead.displayName = "TableHead";

const TableCell: React.ForwardRefExoticComponent<
  TableCellProps & React.RefAttributes<HTMLTableCellElement>
> = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }: TableCellProps, ref) => (
    <td ref={ref} className={cn(tableCellVariants(), className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption: React.ForwardRefExoticComponent<
  TableCaptionProps & React.RefAttributes<HTMLTableCaptionElement>
> = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }: TableCaptionProps, ref) => (
    <caption
      ref={ref}
      className={cn(tableCaptionVariants(), className)}
      {...props}
    />
  ),
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
