// Style variants for Table and its sub-parts, using the theme's --cuix-* CSS variables.
import { cva } from "class-variance-authority";

// The <table> element itself; a wrapping scroll container is applied inline in table.tsx.
export const tableVariants: ReturnType<typeof cva> = cva(
  "w-[var(--cuix-width-full)] caption-bottom text-[var(--cuix-font-size-sm)]",
);

// <thead>; underlines every row it contains.
export const tableHeaderVariants: ReturnType<typeof cva> = cva(
  "[&_tr]:border-b [&_tr]:border-[var(--cuix-colors-border)]",
);

// <tbody>; the last row skips its bottom border.
export const tableBodyVariants: ReturnType<typeof cva> = cva(
  "[&_tr:last-child]:border-0",
);

// <tfoot>; a muted summary row.
export const tableFooterVariants: ReturnType<typeof cva> = cva(
  "border-t border-[var(--cuix-colors-border)] bg-[var(--cuix-colors-muted)]/50 font-[var(--cuix-font-weight-medium)] [&>tr]:last:border-b-0",
);

// <tr>; hoverable and highlights when selected.
export const tableRowVariants: ReturnType<typeof cva> = cva(
  "border-b border-[var(--cuix-colors-border)] transition-colors hover:bg-[var(--cuix-colors-muted)]/50 data-[state=selected]:bg-[var(--cuix-colors-muted)]",
);

// <th>; column header cell.
export const tableHeadVariants: ReturnType<typeof cva> = cva(
  "h-10 px-[var(--cuix-spacing-sm)] text-left align-middle font-[var(--cuix-font-weight-medium)] text-[var(--cuix-colors-muted-foreground)] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
);

// <td>; body cell.
export const tableCellVariants: ReturnType<typeof cva> = cva(
  "p-[var(--cuix-spacing-sm)] align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
);

// <caption>; muted supporting text below the table.
export const tableCaptionVariants: ReturnType<typeof cva> = cva(
  "mt-[var(--cuix-spacing-md)] text-[var(--cuix-font-size-sm)] text-[var(--cuix-colors-muted-foreground)]",
);
