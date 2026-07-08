import { deepMerge } from "@coreuix/utils/deepMerge";
import type { CoreUIXTheme, DeepPartial } from "@coreuix/theme/models";

export function mergeTheme(
  base: CoreUIXTheme,
  override: DeepPartial<CoreUIXTheme>
): CoreUIXTheme {
  return deepMerge(
    base as unknown as Record<string, unknown>,
    override as Record<string, unknown>
  ) as unknown as CoreUIXTheme;
}
