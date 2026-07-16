# Module: Utils (`src/utils/`)

See [utilities.md](../utilities.md) for the full reference — this file is the short
module-index version for consistency with the other `modules/*.md` docs.

| File                | Exports                                                                                               | Role                                                                                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cn.ts`             | `cn(...inputs: ClassValue[]): string`                                                                 | `clsx` + `tailwind-merge` class combiner; used at the end of every component's className computation.                                                                                                                                                    |
| `deepMerge.ts`      | `deepMerge<T>(target, source)`, `isPlainObject` (internal, not exported)                              | Recursive plain-object merge — a plain object is anything with `Object.getPrototypeOf(value) === Object.prototype` (so arrays, `null`, and class instances are left as-is, replaced rather than merged); foundation for the theme system's `mergeTheme`. |
| `createVariants.ts` | `createVariants` (typed as `typeof cva`, = `class-variance-authority`'s `cva`), `VariantProps` (type) | Thin re-export of `class-variance-authority`; in practice every `<name>.variants.ts` in the codebase imports `cva` directly from `class-variance-authority` rather than `createVariants` from here — both resolve to the same function.                  |
| `index.ts`          | —                                                                                                     | Barrel aggregating the three files above (`export * from "@utils/cn"`, `"@utils/deepMerge"`, `"@utils/createVariants"`).                                                                                                                                 |

No file in this module depends on React or the DOM — keep it that way when adding new utilities
here; framework-specific helpers belong in `src/theme/` (which does depend on React/DOM) or a new
top-level module, not here.

## A note on `cva`-based variant files and ESLint

Two ESLint rules are enforced repo-wide: `@typescript-eslint/explicit-function-return-type` and
`@typescript-eslint/typedef` (both `error`, the latter requiring explicit types on every variable
declaration, including destructuring). `createVariants.ts` itself satisfies `typedef` by typing
the re-export as `typeof cva` (the function's own type, not its return type). Every
`<name>.variants.ts` file in the codebase, however, deliberately leaves its own `cva(...)` call
**without** an explicit annotation, silenced via a targeted
`// eslint-disable-next-line @typescript-eslint/typedef` comment — annotating a variant export
with `ReturnType<typeof cva>` would widen the type and collapse the variant-key narrowing (e.g.
`variant`/`size` literal unions) that callers like `buttonVariants({ variant, size })` rely on.
