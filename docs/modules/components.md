# Module: Components (`src/components/`)

UI components, organized into categories. See [folder-structure.md](../folder-structure.md) for
the barrel-export chain and [api-patterns.md](../api-patterns.md) for the shared prop/variant
conventions every component follows.

## Categories

| Category      | Contains                                              | Convention                                                           |
| ------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `primitives/` | Atoms with no internal composition: `button`, `badge` | `<name>.tsx` + `<name>.types.ts` + `<name>.variants.ts` + `index.ts` |
| `layout/`     | Structural components: `card`                         | Single-file (`card.tsx`) — predates the types/variants split         |

New categories (`overlay/`, `form/`, `feedback/`, ...) are added only when a component that fits
actually arrives.

## `primitives/button`

| File                 | Contents                                                                                                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button.tsx`         | Renders `<button>` (or, via `asChild`, whatever the caller passes through Radix `Slot`), styled via `buttonVariants`. Sets `data-slot="button"`.                                                                                                           |
| `Button.types.ts`    | `ButtonProps = React.ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }`                                                                                                                                     |
| `button.variants.ts` | `cva` variants: `variant` (`default`/`destructive`/`outline`/`secondary`/`ghost`/`link`), `size` (`default`/`sm`/`lg`/`icon`). Styled via literal Tailwind arbitrary-value classes bound to `--cuix-*` theme vars, e.g. `bg-[var(--cuix-colors-primary)]`. |
| `index.ts`           | Re-exports `Button`, `buttonVariants`, and `ButtonProps`.                                                                                                                                                                                                  |

## `primitives/badge`

| File                | Contents                                                                                                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `badge.tsx`         | Renders `<span>` (or, via `asChild`, a Slot child), styled via `badgeVariants`. Sets `data-slot="badge"`.                                                                                                            |
| `badge.types.ts`    | `BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants> & { asChild?: boolean }`                                                                                                    |
| `badge.variants.ts` | `cva` variants: `variant` (`default`/`secondary`/`destructive`/`outline`). Styled with bare Tailwind semantic classes (`bg-primary`, `bg-secondary`, ...) rather than `--cuix-*` vars directly — see the note below. |
| `index.ts`          | Re-exports `Badge`.                                                                                                                                                                                                  |

## `layout/card`

Single file (`card.tsx`) containing `Card` plus its sub-parts, all built with `React.forwardRef`:

| Export            | Role                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| `Card`            | Outer container: rounded, bordered surface.                          |
| `CardHeader`      | Vertical stack, typically the first child — holds title/description. |
| `CardTitle`       | Title text within `CardHeader`.                                      |
| `CardDescription` | Muted supporting text within `CardHeader`.                           |
| `CardContent`     | Main body region.                                                    |
| `CardFooter`      | Footer row, typically for actions.                                   |

`card` predates the variants/types file split and still uses bare Tailwind semantic classes
(`bg-card`, `text-muted-foreground`) rather than the `--cuix-*` token-var pattern `button` uses.

## Theme-consumption gap to be aware of

`button` binds directly to `--cuix-*` CSS variables via arbitrary-value classes, so it always
reflects runtime theme overrides. `badge` and `card` rely on Tailwind semantic classes
(`bg-primary`, `bg-card`, ...) that `tailwind.config.ts` maps to the same variables — this works
identically at the rendered-CSS layer, but if you ever need a component's _JavaScript_ to read a
color (not just apply a class), only the `--cuix-*`-var pattern round-trips through `useTheme()`
cleanly. New components should default to the `button` pattern; see
[architecture.md](../architecture.md#where-components-fit-relative-to-the-theme).

## Adding a new component

1. Scaffold with `pnpm exec shadcn add <name>` (never `pnpm add <name>` — that's pnpm's package
   installer and will silently install an unrelated npm package instead).
2. Move the generated flat file into
   `src/components/<category>/<name>/<name>.tsx`, split out `<name>.types.ts` and
   `<name>.variants.ts` following the `button`/`badge` pattern.
3. Create `src/components/<category>/<name>/index.ts` re-exporting the component (+ variants,
   types).
4. Wire it into `src/components/<category>/index.ts` (create if the category is new) and, only
   if the category itself is new, `src/components/index.ts`.

Full walkthrough: [CLAUDE.md](../../CLAUDE.md#adding-a-shadcn-component).
