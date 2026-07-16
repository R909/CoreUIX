# Module: Components (`src/components/`)

UI components, organized into categories. See [folder-structure.md](../folder-structure.md) for
the barrel-export chain and [api-patterns.md](../api-patterns.md) for the shared prop/variant
conventions every component follows.

## Categories

| Category      | Contains                                                                            | Convention                                                                       |
| ------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `primitives/` | Atoms with no internal composition: `button`, `badge`, `input`, `label`, `textarea` | `<name>.tsx` + `<name>.types.ts` + `<name>.variants.ts` + `index.ts`             |
| `layout/`     | Structural components: `card`, `sidebar`                                            | Same split as `primitives/`; `sidebar` is a larger multi-file module (see below) |

New categories (`overlay/`, `form/`, `feedback/`, ...) are added only when a component that fits
actually arrives. `form/` doesn't exist yet.

## `primitives/button`

| File                 | Contents                                                                                                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `button.tsx`         | Renders `<button>` (or, via `asChild`, whatever the caller passes through Radix `Slot`), styled via `buttonVariants`. Sets `data-slot="button"`. Exports only `Button`.                                                                                    |
| `button.types.ts`    | `ButtonProps = React.ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }`                                                                                                                                     |
| `button.variants.ts` | `cva` variants: `variant` (`default`/`destructive`/`outline`/`secondary`/`ghost`/`link`), `size` (`default`/`sm`/`lg`/`icon`). Styled via literal Tailwind arbitrary-value classes bound to `--cuix-*` theme vars, e.g. `bg-[var(--cuix-colors-primary)]`. |
| `index.ts`           | `export * from ".../button"` only — re-exports `Button`. `buttonVariants`/`ButtonProps` are not currently re-exported through the barrel (they live in sibling files but aren't re-exported).                                                              |

## `primitives/badge`

| File                | Contents                                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `badge.tsx`         | Renders `<span>` (or, via `asChild`, a Slot child), styled via `badgeVariants`. Sets `data-slot="badge"`. Exports only `Badge`.                                                                                                       |
| `badge.types.ts`    | `BadgeProps = React.ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }`                                                                                                                    |
| `badge.variants.ts` | `cva` variants: `variant` (`default`/`secondary`/`destructive`/`outline`). Styled via `--cuix-*`-var arbitrary-value classes (e.g. `bg-[var(--cuix-colors-primary)]`), same pattern as `button` — not bare Tailwind semantic classes. |
| `index.ts`          | `export * from ".../badge"` only — re-exports `Badge`.                                                                                                                                                                                |

Note: every `primitives/*` and `layout/card` barrel currently follows this same minimal pattern —
`index.ts` only re-exports the component's own module (`Button`, `Badge`, `Input`, `Label`,
`Textarea`, `Card` + sub-parts); the sibling `.variants.ts`/`.types.ts` files exist for internal
composition but aren't separately re-exported from any barrel today.

## `primitives/input`

`input.tsx` renders a bare `<input>` (`data-slot="input"`), styled via `inputVariants` (no
variant options — a single base style built from `flex.row` plus `--cuix-*` vars for width,
radius, border, background, spacing, font size, and shadow). `InputProps` is a plain
`React.ComponentPropsWithoutRef<"input">` (no `cva` `VariantProps`, no `asChild`).

## `primitives/label`

`label.tsx` wraps `@radix-ui/react-label`'s `LabelPrimitive.Root` (`data-slot="label"`), styled
via `labelVariants` (a single base style, no variant options — `--cuix-font-size-sm`,
`--cuix-line-height-tight`, plus `peer-disabled:*` states for pairing with a disabled input).
`LabelProps` extends `React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>` and
`VariantProps<typeof labelVariants>`.

## `primitives/textarea`

`textarea.tsx` renders a bare `<textarea>` (`data-slot="textarea"`), styled via
`textareaVariants` (single base style, no variants — same `--cuix-*`-var pattern as `input`,
`min-h-[60px]` instead of a fixed height). `TextareaProps` is a plain
`React.ComponentPropsWithoutRef<"textarea">`.

## `layout/card`

`card.tsx` + `card.types.ts` + `card.variants.ts` (same three-file split as the primitives, not a
single file) containing `Card` plus its sub-parts, all built with `React.forwardRef`:

| Export            | Role                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| `Card`            | Outer container: rounded, bordered surface.                          |
| `CardHeader`      | Vertical stack, typically the first child — holds title/description. |
| `CardTitle`       | Title text within `CardHeader`.                                      |
| `CardDescription` | Muted supporting text within `CardHeader`.                           |
| `CardContent`     | Main body region.                                                    |
| `CardFooter`      | Footer row, typically for actions.                                   |

Each sub-part has its own `cva` export in `card.variants.ts` (`cardVariants`,
`cardHeaderVariants`, `cardTitleVariants`, `cardDescriptionVariants`, `cardContentVariants`,
`cardFooterVariants`) and its own prop type in `card.types.ts`. `card` now uses the same
`--cuix-*`-var arbitrary-value pattern as `button`/`badge` (e.g.
`bg-[var(--cuix-colors-card)]`, `border-[var(--cuix-colors-border)]`) — it no longer uses bare
Tailwind semantic classes like `bg-card`/`text-muted-foreground`.

## `layout/sidebar`

The largest component in the library — a full app-shell sidebar ported from shadcn's sidebar
recipe, split across several files:

| File                  | Contents                                                                                                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sidebar.tsx`         | All the public sidebar components (see export list below) plus the `useSidebar()` hook and `SidebarContext`.                                                                                                                                                                            |
| `sidebar.types.ts`    | `SidebarContextProps`, `SidebarProviderProps`, `SidebarProps`, `SidebarGroupLabelProps`, `SidebarGroupActionProps`, `SidebarMenuButtonProps`, `SidebarMenuActionProps`, `SidebarMenuSkeletonProps`, `SidebarMenuSubButtonProps`.                                                        |
| `sidebar.variants.ts` | `sidebarMenuButtonVariants` — `variant` (`default`/`outline`), `size` (`default`/`sm`/`lg`), styled via `--cuix-sidebar-*` vars.                                                                                                                                                        |
| `sidebar-constant.ts` | `SIDEBAR_COOKIE_NAME`, `SIDEBAR_COOKIE_MAX_AGE`, `SIDEBAR_WIDTH`, `SIDEBAR_WIDTH_MOBILE`, `SIDEBAR_WIDTH_ICON`, `SIDEBAR_KEYBOARD_SHORTCUT`.                                                                                                                                            |
| `separator.tsx`       | `Separator` (wraps `@radix-ui/react-separator`) — **internal helper, not re-exported through `index.ts`**.                                                                                                                                                                              |
| `sheet.tsx`           | `Sheet`, `SheetTrigger`, `SheetClose`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` (wraps `@radix-ui/react-dialog`) — **internal helper, not re-exported**. Used by `Sidebar` to render the mobile off-canvas drawer. |
| `skeleton.tsx`        | `Skeleton` — **internal helper, not re-exported**. Used by `SidebarMenuSkeleton`.                                                                                                                                                                                                       |
| `tooltip.tsx`         | `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent` (wraps `@radix-ui/react-tooltip`) — **internal helper, not re-exported**. Used by `SidebarMenuButton`'s `tooltip` prop.                                                                                                |
| `index.ts`            | `export * from` `sidebar`, `sidebar.variants`, `sidebar.types`, `sidebar-constant` — **not** `separator`/`sheet`/`skeleton`/`tooltip`.                                                                                                                                                  |

`sidebar.tsx` exports (all via one `export { ... }` block):
`SidebarProvider`, `Sidebar`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`, `SidebarInput`,
`SidebarHeader`, `SidebarFooter`, `SidebarSeparator`, `SidebarContent`, `SidebarGroup`,
`SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarMenu`,
`SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`,
`SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`, and
`useSidebar()` (throws `"useSidebar must be used within a SidebarProvider."` if called outside a
`SidebarProvider`).

`SidebarProvider` uses `useIsMobile()` from `@hooks/use-mobile` (see
[`src/hooks/`](#src-hooks) below) to switch between the desktop collapsible layout and the
mobile off-canvas `Sheet`, and persists the open/collapsed state to a `sidebar_state` cookie
(`SIDEBAR_COOKIE_NAME`) so it survives reloads. A keyboard shortcut (`Cmd/Ctrl+B` by default, via
`SIDEBAR_KEYBOARD_SHORTCUT`) toggles it.

Almost all of `sidebar.tsx`'s own styling uses the `--cuix-sidebar-*`/`--cuix-colors-*` var
pattern (e.g. `bg-[var(--cuix-sidebar-background)]`), consistent with `button`/`badge`/`card`.
The internal-only helper files (`separator.tsx`, `sheet.tsx`, `skeleton.tsx`, `tooltip.tsx`) are
the one remaining exception — they still use bare Tailwind semantic classes
(`bg-border`, `bg-background`, `text-muted-foreground`, `bg-primary/10`, ...) rather than
`--cuix-*` vars, but since they aren't part of the public barrel this doesn't affect consumers of
the package API, only the sidebar's own internal implementation.

### `src/hooks/`

Not a `components/` category, but new and directly relevant to `sidebar`: `src/hooks/use-mobile.tsx`
exports `useIsMobile()` — SSR-safe (lazy `useState` initializer that returns `false` on the
server), listens for viewport changes via a `matchMedia("(max-width: 767px)")` change event, and
flips at a hardcoded 768px breakpoint. `@hooks/*` is a real path alias (see
[folder-structure.md](../folder-structure.md)). Currently the only consumer is
`SidebarProvider`.

## Theme-consumption pattern

`button`, `badge`, `card`, and `sidebar` all bind directly to `--cuix-*` CSS variables via
arbitrary-value classes (e.g. `bg-[var(--cuix-colors-primary)]`), so they always reflect runtime
theme overrides — this is now the consistent pattern across every publicly-exported component,
not just `button`. `input`, `label`, and `textarea` follow it too. The only components still
using bare Tailwind semantic classes (`bg-border`, `bg-background`, ...) are the sidebar's
internal-only helpers (`separator`, `sheet`, `skeleton`, `tooltip`), which aren't part of the
public API surface. New components should default to the `--cuix-*`-var pattern; see
[architecture.md](../architecture.md#where-components-fit-relative-to-the-theme).

## Adding a new component

1. Scaffold with `pnpm exec shadcn add <name>` (never `pnpm add <name>` — that's pnpm's package
   installer and will silently install an unrelated npm package instead).
2. Move the generated flat file into
   `src/components/<category>/<name>/<name>.tsx`, split out `<name>.types.ts` and
   `<name>.variants.ts` following the `button`/`badge` pattern.
3. Create `src/components/<category>/<name>/index.ts` re-exporting the component (+ variants,
   types, if you want them part of the public barrel).
4. Wire it into `src/components/<category>/index.ts` (create if the category is new) and, only
   if the category itself is new, `src/components/index.ts`.

Full walkthrough: [CLAUDE.md](../../CLAUDE.md#adding-a-shadcn-component).
