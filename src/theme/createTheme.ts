import deepmerge from "deepmerge";

import { defaultTheme } from "./defaultTheme";
import type { CoreUIXTheme, DeepPartial } from "./types";

export function createTheme(
  theme: DeepPartial<CoreUIXTheme> = {}
): CoreUIXTheme {
  const mergedTheme = deepmerge(defaultTheme, theme);

  return mergedTheme as CoreUIXTheme;
}