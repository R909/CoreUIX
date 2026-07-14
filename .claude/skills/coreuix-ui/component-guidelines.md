# Component guidelines

## Recipe: adding a new shadcn component

1. **Scaffold it**: `pnpm exec shadcn add <name>` (e.g. `pnpm exec shadcn add dialog`).
   Never `pnpm add <name>` — that's pnpm's own "install a package" command and wins
   over the `"add": "shadcn add"` script in `package.json`, silently installing an
   unrelated real npm package instead.

   The CLI reads `components.json`'s `aliases` block (`@components`, `@utils`,
   `@hooks`, `@theme`) and writes the generated file into a literal folder matching
   that string (e.g. `@components/ui/<name>.tsx`) — those aliases are **not** real
   TypeScript path mappings, just CLI scaffolding targets. You'll need to delete
   that stray folder after relocating the file.

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
     and setting `.displayName`.
   - `index.ts` — `export * from "@/components/<category>/<name>/<name>";`

4. **Rewrite every import**: shadcn's scaffolded file imports from
   `@components/lib/utils` (or similar) — change to `@/utils/cn`, and change any
   sibling-file imports (e.g. importing `toggleVariants` from another component's
   `.variants.ts` file) to the `@/components/...` alias form.

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
   category itself is new, also add `export * from "@/components/<category>";` to
   `src/components/index.ts`.

7. **Verify**: `pnpm typecheck && pnpm lint && pnpm build` must all pass clean
   before considering the component done.

8. **Update docs**: add the component name to the "current categories" line in
   `CLAUDE.md` (and this skill's `SKILL.md` folder-structure section, if it has
   drifted).

## When to skip `.variants.ts` / `.types.ts`

Some shadcn components are pure Radix passthroughs with no classes and no props of
their own beyond what the underlying primitive already provides (e.g.
`aspect-ratio` is just `const AspectRatio = AspectRatioPrimitive.Root`,
`collapsible` just re-exports `Root`/`Trigger`/`Content`). For these:

- Skip `.variants.ts` entirely — there's nothing to tokenize.
- Skip `.types.ts` too if the component doesn't need its own exported prop type.

Don't create empty files "for structural symmetry" — that's an abstraction the
component doesn't need.

## Multi-part components

When a component has sub-parts (`Card`/`CardHeader`/`CardTitle`/...,
`Avatar`/`AvatarImage`/`AvatarFallback`, `Select`/`SelectTrigger`/`SelectContent`/...):

- Every sub-part that renders its own DOM node gets its own `cva` export in the
  shared `.variants.ts`, its own type in `.types.ts`, and its own
  `React.forwardRef` in `.tsx` with its own `.displayName`.
- Sub-parts that are pure aliases with no wrapping needed (e.g. `SelectGroup =
SelectPrimitive.Group`) don't need a `cva`/type/forwardRef — just re-export the
  primitive directly, same as the original shadcn source does.
- When a variant choice needs to flow from a root component down to its children
  without prop-drilling (e.g. `size`/`variant` on a group-style component), use a
  small `React.createContext` scoped to that component's own file, read via
  `React.useContext` inside each child sub-part — don't reach for a
  library-level state solution for this.

## Reusing another component's variants

It's fine — and preferred over duplicating classes — for one component's `.tsx` to
import another component's exported `cva` function directly when the styling should
be identical (e.g. a group-style wrapper around an existing toggle-style item
reusing that item's own `xVariants` export rather than redefining the same classes).
Import it via the full `@/components/<category>/<name>/<name>.variants` path.
