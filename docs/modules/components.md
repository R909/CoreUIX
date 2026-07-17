# Module: Components (`src/components/`)

UI components, organized into categories. See [folder-structure.md](../folder-structure.md) for
the barrel-export chain and [api-patterns.md](../api-patterns.md) for the shared prop/variant
conventions every component follows.

## Categories

| Category      | Contains                                                                                                                                                                  | Convention                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `primitives/` | Atoms with no internal composition: `button`, `badge`, `input`, `label`, `textarea`, `toggle`, `checkbox`, `text`, `tabs`, `select`, `command`, `popover`, `multi-select` | `<name>.tsx` + `<name>.types.ts` + `<name>.variants.ts` + `index.ts`             |
| `layout/`     | Structural components: `card`, `table`, `sidebar`                                                                                                                         | Same split as `primitives/`; `sidebar` is a larger multi-file module (see below) |

New categories (`overlay/`, `form/`, `feedback/`, ...) are added only when a component that fits
actually arrives. `form/` doesn't exist yet. `multi-select` is the one primitive that's compound
(composes `popover` + `command` + `button` + `badge`) rather than a bare atom — it's still filed
under `primitives/` because it's a single self-contained control, not a structural/layout piece.

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

Note: every `primitives/*` and `layout/card`/`layout/table` barrel follows this same minimal
pattern — `index.ts` only re-exports the component's own module; the sibling
`.variants.ts`/`.types.ts` files exist for internal composition but aren't separately re-exported
from any barrel today (`sidebar` is the one exception — see below).

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
`VariantProps<typeof labelVariants>`. Uses `React.ComponentRef<...>` (not the deprecated
`React.ElementRef<...>`) for its `forwardRef` ref type, like every other Radix-backed component
in this repo.

## `primitives/textarea`

`textarea.tsx` renders a bare `<textarea>` (`data-slot="textarea"`), styled via
`textareaVariants` (single base style, no variants — same `--cuix-*`-var pattern as `input`,
`min-h-[60px]` instead of a fixed height). `TextareaProps` is a plain
`React.ComponentPropsWithoutRef<"textarea">`.

## `primitives/toggle`

`toggle.tsx` wraps `@radix-ui/react-toggle`'s `TogglePrimitive.Root` (`data-slot="toggle"`),
styled via `toggleVariants` (`variant`: `default`/`outline`; `size`: `default`/`sm`/`lg`).
`ToggleProps` extends `React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
VariantProps<typeof toggleVariants>`. `size`'s `sm` (`px-1.5`, `min-w-8`) and `lg` (`px-2.5`,
`min-w-10`) values are deliberately left as bare Tailwind — no `--cuix-spacing-*` token matches
those exact pixel values, whereas `default`'s `px-2` does match `spacing.sm` (8px) and is
tokenized.

## `primitives/checkbox`

`checkbox.tsx` wraps `@radix-ui/react-checkbox`'s `CheckboxPrimitive.Root`
(`data-slot="checkbox"`) with a `CheckboxPrimitive.Indicator` child rendering a `lucide-react`
`Check` icon (`size-3.5`). Two `cva` exports in `checkbox.variants.ts`: `checkboxVariants` (the
root — border/shadow/focus-ring/`data-[state=checked]` background, all `--cuix-*`-var driven) and
`checkboxIndicatorVariants` (just `flex.center` + `text-current`). `CheckboxProps` delegates
entirely to `React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>` — no `cva`
`VariantProps` intersected in, since the component has no `variant`/`size` options of its own.

## `primitives/text`

`text.tsx` renders a `<p>` by default (or, via `asChild`, a Radix `Slot` child — same
polymorphism pattern as `Button`/`Badge`), styled via `textVariants`, for heading/body/caption/
label copy. `textVariants` has a real two-axis `variants` map — `variant` (`h1`/`h2`/`h3`/`h4`/
`body-sm`/`body`/`body-lg`/`caption-sm`/`caption`/`label-sm`/`label`, each mapping to a
`font-heading`/`font-body` + `text-<preset>` Tailwind class pair wired through
`tailwind.config.ts`'s `fontFamily`/`fontSize` extensions) and `color` (`primary`/`secondary`/
`muted`/`disabled`/`link`/`danger`/`success`/`warning`/`inverse`, each a
`text-[var(--cuix-text-color-*)]` arbitrary-value class) — see
[modules/theme.md](./theme.md#text-tokens) for where these tokens come from. **Because this `cva`
call has a real `variants` map**, `textVariants` must stay uninferred behind the standard
`// eslint-disable-next-line @typescript-eslint/typedef` exemption, not an explicit
`ReturnType<typeof cva>` annotation — an earlier version of this file used the annotation and it
silently erased `variant`/`color` from `TextProps` (`VariantProps<typeof textVariants>` collapsed
to nothing), breaking both `text.tsx`'s own `textVariants({ variant, color })` call and any
consumer needing `TextProps["variant"]`. See [api-patterns.md](../api-patterns.md) and
[system-patterns.md](../system-patterns.md#3-cva-for-variants-split-into-a-sibling-file) for the
general rule this is an instance of.

## `primitives/tabs`

`tabs.tsx` wraps `@radix-ui/react-tabs` — `Tabs` (root), `TabsList` (pill-shaped trigger row),
`TabsTrigger` (individual tab, styled differently when `data-[state=active]`), `TabsContent`
(panel). Each has its own `cva` export in `tabs.variants.ts` (`tabsVariants`, `tabsListVariants`,
`tabsTriggerVariants`, `tabsContentVariants`), all `--cuix-*`-var driven, and its own prop type in
`tabs.types.ts` intersecting the matching `TabsPrimitive.*` component's
`ComponentPropsWithoutRef` with its `VariantProps`.

## `primitives/select`

`select.tsx` wraps `@radix-ui/react-select`'s full sub-part family: `Select` and `SelectGroup`/
`SelectValue` (plain re-exports of the Radix primitive, no styling), plus styled `forwardRef`
wrappers for `SelectTrigger` (with `Check`/`ChevronDown`/`ChevronUp` icons from `lucide-react`),
`SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, and
`SelectScrollDownButton`. Six `cva` exports in `select.variants.ts`
(`selectTriggerVariants`/`selectScrollButtonVariants`/`selectContentVariants`/
`selectLabelVariants`/`selectItemVariants`/`selectSeparatorVariants`), all `--cuix-*`-var driven
— `selectContentVariants` includes the Radix open/close animation classes
(`data-[state=open]:animate-in`, etc.) alongside the token-driven surface/border/shadow classes.

## `primitives/command`

`command.tsx` wraps [`cmdk`](https://cmdk.paco.me/)'s `Command` export — **the only primitive in
this repo not built on a `@radix-ui/react-*` package** (`cmdk` ships its own accessible listbox
implementation). Exports `Command`, `CommandInput` (with a leading `Search` icon from
`lucide-react`, wrapped in its own `commandInputWrapperVariants`-styled `<div>`), `CommandList`,
`CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator` (all `forwardRef` wrappers with
their own `cva` export in `command.variants.ts`), and `CommandShortcut` (a plain function
component, not `forwardRef`, since it wraps no Radix primitive — just a styled `<span>`). Note in
`command.tsx`: `cmdk` also ships a `CommandDialog` (Command mounted inside a Dialog), deliberately
not included here since this repo has no standalone `Dialog` primitive yet.

## `primitives/popover`

`popover.tsx` wraps `@radix-ui/react-popover`. `Popover`, `PopoverTrigger`, `PopoverAnchor` are
zero-styling passthroughs (`const Popover: typeof PopoverPrimitive.Root = PopoverPrimitive.Root`)
— no `cva`, no `forwardRef`, matching the "zero-styling passthrough" pattern documented in
[system-patterns.md](../system-patterns.md). Only `PopoverContent` has real styling
(`popoverContentVariants` in `popover.variants.ts` — a single no-`variants`-map `cva` call, so it's
one of the few `.variants.ts` files where an explicit `ReturnType<typeof cva>` annotation is
actually safe, unlike `text`'s — see [api-patterns.md](../api-patterns.md)) and is the only
`forwardRef` export, wrapped in `PopoverPrimitive.Portal`.

## `primitives/multi-select`

`multi-select.tsx` — a compound "choose multiple values from a searchable dropdown" control.
**The one primitive with no underlying Radix primitive of its own**: there's no
`@radix-ui/react-multi-select`, so it's built by composing `Popover` (dropdown positioning),
`Command`/`CommandInput`/`CommandList`/`CommandEmpty`/`CommandGroup`/`CommandItem`/
`CommandSeparator` (the searchable list), `Button` (the trigger), and `Badge` (the selected-value
chips) — all imported from their own primitive folders via the usual `@components/primitives/*`
aliases. Selection state lives in a component-scoped `MultiSelectContext`
(`open`/`setOpen`/`selectedValues`/`toggleValue`/`items`/`single`/`onItemAdded`), read via an
internal `useMultiSelect()` hook — the same "Context instead of a delegated primitive" shape as
`layout/sidebar`'s `SidebarContext`/`useSidebar()`, but for a `primitives/` component instead of a
`layout/` one. `values`/`onValuesChange` make it externally controllable, with an uncontrolled
`defaultValues` fallback; a `single` prop repurposes the same component for single-select. Exports
`MultiSelect`, `MultiSelectTrigger`, `MultiSelectValue`, `MultiSelectContent`, `MultiSelectItem`,
`MultiSelectGroup`, `MultiSelectSeparator`.

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
`cardFooterVariants`) and its own prop type in `card.types.ts`. `card` uses the same `--cuix-*`-var
arbitrary-value pattern as `button`/`badge` (e.g. `bg-[var(--cuix-colors-card)]`,
`border-[var(--cuix-colors-border)]`). Each `cardXVariants` export is annotated with an explicit
`ReturnType<typeof cva>` (not the disable-comment exemption) — safe here because none of `card`'s
`cva` calls have a `variants` map (base classes only), unlike `button`/`badge`/`text`.

## `layout/table`

`table.tsx` + `table.types.ts` + `table.variants.ts` — a static, styled wrapper around the native
`<table>` elements, with **no sorting, filtering, or pagination logic of its own** (a stateful
data-table wrapper built on `@tanstack/react-table` was explored and then explicitly reverted —
this component intentionally stays a plain presentational primitive):

| Export         | Renders                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------- |
| `Table`        | `<table>`, wrapped in a `relative w-[var(--cuix-width-full)] overflow-auto` scroll container. |
| `TableHeader`  | `<thead>` — underlines every row it contains.                                                 |
| `TableBody`    | `<tbody>` — its last row skips its bottom border.                                             |
| `TableFooter`  | `<tfoot>` — a muted summary row.                                                              |
| `TableRow`     | `<tr>` — hoverable, highlights when `data-[state=selected]`.                                  |
| `TableHead`    | `<th>` — column header cell.                                                                  |
| `TableCell`    | `<td>` — body cell.                                                                           |
| `TableCaption` | `<caption>` — muted supporting text below the table.                                          |

Each sub-part has its own `cva` export in `table.variants.ts`, all annotated with an explicit
`ReturnType<typeof cva>` (safe here — none of these calls have a `variants` map). All are plain
`React.forwardRef` wrappers spreading `{...props}`, so nesting a `Badge`, `Button`, icon+text
stack, or dropdown trigger inside a `TableCell` is unrestricted — it's an unopinionated `<td>`.

## `layout/sidebar`

The largest component in the library — a full app-shell sidebar ported from shadcn's sidebar
recipe, split across several files:

| File                  | Contents                                                                                                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sidebar.tsx`         | All the public sidebar components (see export list below) plus the `useSidebar()` hook and `SidebarContext`.                                                                                                                                                                            |
| `sidebar.types.ts`    | `SidebarContextProps`, `SidebarProviderProps`, `SidebarProps`, `SidebarGroupLabelProps`, `SidebarGroupActionProps`, `SidebarMenuButtonProps`, `SidebarMenuActionProps`, `SidebarMenuSkeletonProps`, `SidebarMenuSubButtonProps`.                                                        |
| `sidebar.variants.ts` | `sidebarMenuButtonVariants` — `variant` (`default`/`outline`), `size` (`default`/`sm`/`lg`), styled via `--cuix-sidebar-*` vars.                                                                                                                                                        |
| `sidebar-constant.ts` | `SIDEBAR_COOKIE_NAME`, `SIDEBAR_COOKIE_MAX_AGE`, `SIDEBAR_WIDTH`, `SIDEBAR_WIDTH_MOBILE`, `SIDEBAR_WIDTH_ICON`, `SIDEBAR_KEYBOARD_SHORTCUT`.                                                                                                                                            |
| `separator/`          | `Separator` (wraps `@radix-ui/react-separator`) — **internal helper, not re-exported through `index.ts`**.                                                                                                                                                                              |
| `sheet/`              | `Sheet`, `SheetTrigger`, `SheetClose`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` (wraps `@radix-ui/react-dialog`) — **internal helper, not re-exported**. Used by `Sidebar` to render the mobile off-canvas drawer. |
| `skeleton/`           | `Skeleton` — **internal helper, not re-exported**. Used by `SidebarMenuSkeleton`.                                                                                                                                                                                                       |
| `tooltip/`            | `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent` (wraps `@radix-ui/react-tooltip`) — **internal helper, not re-exported**. Used by `SidebarMenuButton`'s `tooltip` prop.                                                                                                |
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
The internal-only helper files (`separator/`, `sheet/`, `skeleton/`, `tooltip/`) are the one
remaining exception — they still use bare Tailwind semantic classes
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

Every current `primitives/` component and `layout/card`/`layout/table`/`layout/sidebar` binds
directly to `--cuix-*` CSS variables via arbitrary-value classes (e.g.
`bg-[var(--cuix-colors-primary)]`), so they always reflect runtime theme overrides. The only
components still using bare Tailwind semantic classes (`bg-border`, `bg-background`, ...) are the
sidebar's internal-only helpers (`separator`, `sheet`, `skeleton`, `tooltip`), which aren't part
of the public API surface. New components should default to the `--cuix-*`-var pattern; see
[architecture.md](../architecture.md#where-components-fit-relative-to-the-theme).

## Adding a new component

1. Scaffold with `pnpm exec shadcn add <name>` (never `pnpm add <name>` — that's pnpm's package
   installer and will silently install an unrelated npm package instead). Note: `command` and
   `multi-select` in this repo aren't shadcn-registry components in the strict sense — `command`
   is a hand-adapted wrapper over the `cmdk` package, and `multi-select` is entirely hand-built by
   composing existing primitives, since neither has a first-party Radix primitive to scaffold
   from.
2. Move the generated flat file into
   `src/components/<category>/<name>/<name>.tsx`, split out `<name>.types.ts` and
   `<name>.variants.ts` following the `button`/`badge` pattern.
3. Create `src/components/<category>/<name>/index.ts` re-exporting the component (+ variants,
   types, if you want them part of the public barrel).
4. Wire it into `src/components/<category>/index.ts` (create if the category is new) and, only
   if the category itself is new, `src/components/index.ts`.
5. If any `.variants.ts` `cva()` call has a real `variants` map (not just base classes), leave it
   uninferred behind the `// eslint-disable-next-line @typescript-eslint/typedef` exemption —
   never an explicit `ReturnType<typeof cva>` annotation, which silently erases the variant-key
   narrowing (`text.variants.ts`'s `textVariants` hit this exact regression once already).

Full walkthrough: [CLAUDE.md](../../CLAUDE.md#adding-a-shadcn-component).
