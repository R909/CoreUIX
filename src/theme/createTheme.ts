import deepmerge from "deepmerge";

import { defaultTheme } from "./defaultTheme";
import type { CoreUIXTheme } from "./types";

export function createTheme(
  theme: Partial<CoreUIXTheme> = {}
): CoreUIXTheme {
  return deepmerge(defaultTheme, theme);
}