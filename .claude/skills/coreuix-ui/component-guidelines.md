# Component guidelines

## Recipe: adding a new shadcn component

1. **Scaffold it**: `pnpm exec shadcn add <name>` (e.g. `pnpm exec shadcn add dialog`).
   Never `pnpm add <name>` — that's pnpm's own "install a package" command and wins
   over the `"add": "shadcn add"` script in `package.json`, silently installing an
   unrelated real npm package instead.

   The CLI reads `components.json`'s `aliases` block (`@components`, `@utils`,
   `@hooks`, `@theme`) and writes the generated file into a literal folder matching
   that string (e.g. a folder literally named `@components/ui/<name>.tsx` at the
   repo root). These aliases now **do** match real `tsconfig.json` path mappings
   (`@components/*`, `@utils/*`, `@hooks/*`, `@theme/*`), but the CLI still drops the
   file in the wrong physical location relative to this repo's category folder
   structure — you'll need to delete that stray folder after relocating the file
   into `src/components/<category>/<name>/`.

   The CLI can also side-effect `tailwind.config.ts` and `package.json` when the new
   component needs new keyframes/animations or new `@radix-ui/react-*` dependencies
   — re-check `tailwind.config.ts` for duplicated/reformatted content after running
   `shadcn add` (it has been observed to duplicate existing `keyframes`/`animation`
   entries and reformat the whole file with tabs/single quotes in this repo before);
   fix that by hand before committing.

2. **Relocate into the category structure**:

   ```bash
   mkdir -p src/components/<category>/<name>
   mv <wherever-the-cli-put-it> src/components/<category>/<name>/<name>.tsx
   ```

   If the category doesn't exist yet, only create it because a component that
   genuinely fits is arriving right now — don't pre-create empty categories.

3. **Split into the file structure** (skip `.variants.ts` if the component has zero
   styling of its own — see "When to skip files" below):

   - `<name>.variants.ts` — every `cva(...)` call, one per visually distinct
     sub-part of the component (even parts with no variant options of their own
     still get their own `cva` export, purely to hold their base classes and stay
     independently overridable via `className`).
   - `<name>.types.ts` — one exported type per sub-part:
     `React.ComponentPropsWithoutRef<typeof RadixPrimitive.X> & VariantProps<typeof xVariants>`
     for Radix-backed parts, or `React.ComponentProps<"input">` / `React.HTMLAttributes<HTMLDivElement>`
     for plain-HTML-backed parts.
   - `<name>.tsx` — the component(s): `React.forwardRef` wrapping the Radix
     primitive (or plain element), applying `cn(xVariants(), className)` (plus any
     variant args the variants map needs, e.g. `cn(xVariants({ variant, size }), className)`),
     and setting `.displayName`. The `const X = React.forwardRef<...>(...)` itself
     needs an explicit type annotation (e.g.
     `React.ForwardRefExoticComponent<XProps & React.RefAttributes<HTMLButtonElement>>`),
     and the destructured props parameter inside the callback needs `: XProps`
     written directly on it — both are required by this repo's
     `@typescript-eslint/typedef`/`explicit-function-return-type` ESLint rules (see
     `coding-standards.md` and `examples.md` for the exact pattern).
   - `index.ts` — `export * from "@components/<category>/<name>/<name>";`

4. **Rewrite every import**: shadcn's scaffolded file imports from something like
   `@components/lib/utils` — change to `@utils/cn`, and change any sibling-file
   imports (e.g. importing another component's exported `cva` from its
   `.variants.ts` file) to the full `@components/<category>/<name>/<name>.variants`
   alias form. Never leave a relative (`./`, `../`) import or the bare `@/*`
   catch-all in place — both are `no-restricted-imports` ESLint errors, even for a
   barrel importing its own sibling `.tsx` file.

5. **Tokenize the styling** — walk every class in the base classes and replace bare
   Tailwind semantic color/radius/shadow/font-size utilities with the matching
   `--cuix-*` arbitrary-value class:

   | Bare class                     | Tokenized replacement                         |
   | ------------------------------ | --------------------------------------------- |
   | `bg-primary`                   | `bg-[var(--cuix-colors-primary)]`             |
   | `text-muted-foreground`        | `text-[var(--cuix-colors-muted-foreground)]`  |
   | `border-input`                 | `border-[var(--cuix-colors-input)]`           |
   | `rounded-md`                   | `rounded-[var(--cuix-radius-md)]`             |
   | `shadow-sm` (or bare `shadow`) | `shadow-[var(--cuix-shadow-sm)]`              |
   | `text-sm`                      | `text-[var(--cuix-font-size-sm)]`             |
   | `ring-ring`                    | `ring-[var(--cuix-colors-ring)]`              |
   | `ring-offset-background`       | `ring-offset-[var(--cuix-colors-background)]` |

   Only remap a value when it **exactly matches** an existing token (check
   `theme/tokens/*.ts` for the actual pixel/rem values first). Leave anything that
   doesn't cleanly match as plain Tailwind (sizing like `h-9`, `px-3`, `gap-1.5`,
   geometric shapes like `rounded-full`, and `transparent`/`currentColor` all stay
   bare — this repo's own `button/`'s `sm` size variant does the same).

   If the component genuinely needs a value the theme has no token for at all, add
   it: the key in `theme/models/Theme.ts`, the default in the matching
   `theme/tokens/*.ts` file, the literal value in `src/styles.css`'s `:root`/`.dark`
   blocks, and (only if it should also work as a plain Tailwind utility class, not
   just the arbitrary-value syntax) an entry in `tailwind.config.ts`.

6. **Wire the barrels**: add the component to `<category>/index.ts`; if the
   category itself is new, also add `export * from "@components/<category>";` to
   `src/components/index.ts`.

7. **Verify**: `pnpm typecheck && pnpm lint && pnpm build` must all pass clean
   before considering the component done.

8. **Update docs**: add the component name to the "current categories" line in
   `CLAUDE.md` (and this skill's `SKILL.md` folder-structure section, if it has
   drifted).

## When to skip `.variants.ts` / `.types.ts`

Some shadcn components are pure Radix passthroughs with no classes and no props of
their own beyond what the underlying primitive already provides. No standalone
primitive in this repo currently does this, but the pattern already exists as a
private helper: `TooltipProvider`/`Tooltip`/`TooltipTrigger` in
`src/components/layout/sidebar/tooltip.tsx` are each just
`const X: typeof TooltipPrimitive.Y = TooltipPrimitive.Y;`, with no wrapping at
all (only `TooltipContent`, which adds classes, gets a `forwardRef`). For a
component like that:

- Skip `.variants.ts` entirely — there's nothing to tokenize.
- Skip `.types.ts` too if the component doesn't need its own exported prop type.

Don't create empty files "for structural symmetry" — that's an abstraction the
component doesn't need.

## Multi-part components

When a component has sub-parts — e.g. `Card`/`CardHeader`/`CardTitle`/`CardDescription`/
`CardContent`/`CardFooter`, or the much larger `Sidebar`/`SidebarHeader`/`SidebarFooter`/
`SidebarGroup*`/`SidebarMenu*` family in `layout/sidebar/`:

- Every sub-part that renders its own DOM node gets its own `cva` export in the
  shared `.variants.ts` (or, for parts with no variant options of their own, just
  base classes via `cn(...)` inline — `sidebar.tsx` mixes both, since only
  `SidebarMenuButton` currently has a real `variants` map), its own type in
  `.types.ts`, and its own `React.forwardRef` in `.tsx` with its own `.displayName`.
- Sub-parts that are pure aliases with no wrapping needed (e.g. a hypothetical
  `SelectGroup = SelectPrimitive.Group`) don't need a `cva`/type/forwardRef — just
  re-export the primitive directly, same as the original shadcn source does.
- When state needs to flow from a root component down to its children without
  prop-drilling, use a small `React.createContext` scoped to that component's own
  file, read via a `useX()` hook that throws if called outside its provider — see
  `SidebarContext`/`useSidebar()` in `sidebar.tsx` for the real, current example
  (it holds `state`/`open`/`setOpen`/`openMobile`/`setOpenMobile`/`isMobile`/
  `toggleSidebar`, and `useSidebar()` throws `"useSidebar must be used within a
SidebarProvider."` if the context is `null`). Note this differs from
  `useTheme()`, which degrades gracefully to `defaultTheme` instead of throwing —
  check the specific area's own precedent before assuming either behavior.

## Reusing another component's variants

It's fine — and preferred over duplicating classes — for one component's `.tsx` to
import another component's exported `cva` function directly when the styling should
be identical (e.g. a group-style wrapper around an existing toggle-style item
reusing that item's own `xVariants` export rather than redefining the same classes).
Import it via the full `@components/<category>/<name>/<name>.variants` path.
