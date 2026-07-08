import { deepMerge } from "@/utils/deepMerge";
import type { CoreUIXTheme, DeepPartial } from "@/theme/models";

export function mergeTheme(
  base: CoreUIXTheme,
  override: DeepPartial<CoreUIXTheme>
): CoreUIXTheme {
  return deepMerge(
    base as unknown as Record<string, unknown>,
    override as Record<string, unknown>
  ) as unknown as CoreUIXTheme;
}
