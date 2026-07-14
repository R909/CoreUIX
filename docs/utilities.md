# Utilities (`src/utils/`)

Small, framework-agnostic helpers with no React/DOM dependency (except where noted). Everything
here is re-exported from the package root via `src/index.ts`.

## `cn.ts` — class-name combiner

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- `clsx` resolves conditional/falsy class inputs (objects, arrays, booleans) into a single
  string.
- `tailwind-merge` then dedupes conflicting Tailwind utility classes (`"p-2 p-4"` → `"p-4"`) so
  the last-applied class wins instead of both being applied.
- Used at the end of every component's className computation. See
  [api-patterns.md](./api-patterns.md#classname-merging) for the merge-order rule.

## `deepMerge.ts` — recursive plain-object merge

```ts
function isPlainObject(value: unknown): value is Record<string, unknown>;
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>,
): T;
```

- `isPlainObject` narrows to "plain object" — not `null`, not an array, not a class instance
  (checked via `Object.getPrototypeOf(value) === Object.prototype`). Arrays, `Date`s, and other
  non-plain values are treated as leaf values.
- `deepMerge` merges `source` into `target` key by key: if both sides hold a plain object for the
  same key, it recurses; otherwise `source`'s value simply overwrites `target`'s.
- This is the foundation `theme/core/mergeTheme.ts` builds on to merge a consumer's
  `DeepPartial<CoreUIXTheme>` onto `defaultTheme` — see
  [modules/theme.md](./modules/theme.md#mergethemets).

## `createVariants.ts` — variant-map factory

```ts
export const createVariants = cva;
export type { VariantProps } from "class-variance-authority";
```

- A thin, intentional re-export of `class-variance-authority`'s `cva` — not a wrapper. It exists
  so components depend on this package's own `utils` surface rather than importing
  `class-variance-authority` directly, keeping that third-party dependency swappable in one
  place if it's ever replaced.
- Every `<name>.variants.ts` file in `src/components/` is built with this.

## Barrel (`index.ts`)

```ts
export * from "@/utils/cn";
export * from "@/utils/deepMerge";
export * from "@/utils/createVariants";
```

Re-exported wholesale from `src/index.ts` — consumers can `import { cn } from "@coreuix/ui"`.

## Adding a new utility

- Keep it framework-agnostic (no React imports) unless there's a strong reason otherwise — the
  theme system and components both depend on this layer being simple and dependency-light.
- Add the file, export it from `src/utils/index.ts`, and it flows through automatically (no
  other file needs to change, same barrel-aggregation pattern as everywhere else — see
  [system-patterns.md](./system-patterns.md#1-barrel-export-aggregation-three-levels-up)).
