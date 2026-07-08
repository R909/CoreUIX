import { defaultTheme } from "@coreuix/theme/core/defaultTheme";
import { mergeTheme } from "@coreuix/theme/core/mergeTheme";
import type { CoreUIXTheme, DeepPartial } from "@coreuix/theme/models";

export function createTheme(
  theme: DeepPartial<CoreUIXTheme> = {}
): CoreUIXTheme {
  return mergeTheme(defaultTheme, theme);
}
