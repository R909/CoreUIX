# Module: Utils (`src/utils/`)

See [utilities.md](../utilities.md) for the full reference — this file is the short
module-index version for consistency with the other `modules/*.md` docs.

| File                | Exports                                                 | Role                                                                                                  |
| ------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `cn.ts`             | `cn(...inputs)`                                         | `clsx` + `tailwind-merge` class combiner; used at the end of every component's className computation. |
| `deepMerge.ts`      | `deepMerge(target, source)`, `isPlainObject` (internal) | Recursive plain-object merge; foundation for the theme system's `mergeTheme`.                         |
| `createVariants.ts` | `createVariants` (= `cva`), `VariantProps` (type)       | Thin re-export of `class-variance-authority`, used by every `<name>.variants.ts`.                     |
| `index.ts`          | —                                                       | Barrel aggregating the three files above.                                                             |

No file in this module depends on React or the DOM — keep it that way when adding new utilities
here; framework-specific helpers belong in `src/theme/` (which does depend on React/DOM) or a new
top-level module, not here.
