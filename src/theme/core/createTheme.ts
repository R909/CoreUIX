import { defaultTheme } from "@/theme/core/defaultTheme";
import { mergeTheme } from "@/theme/core/mergeTheme";
import type { CoreUIXTheme, DeepPartial } from "@/theme/models";

export function createTheme(
  theme: DeepPartial<CoreUIXTheme> = {}
): CoreUIXTheme {
  return mergeTheme(defaultTheme, theme);
}
