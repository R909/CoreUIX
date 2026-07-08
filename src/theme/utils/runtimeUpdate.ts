import type { CoreUIXTheme } from "@/theme/models";
import { normalizeTheme } from "@/theme/utils/normalize";
import { generateCssVariables } from "@/theme/utils/generateCssVariables";
import { applyTheme } from "@/theme/utils/applyTheme";

export function applyRuntimeThemeUpdate(theme: CoreUIXTheme): void {
  applyTheme(generateCssVariables(normalizeTheme(theme)));
}
