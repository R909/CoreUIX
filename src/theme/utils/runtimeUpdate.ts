import type { CoreUIXTheme } from "@coreuix/theme/models";
import { normalizeTheme } from "@coreuix/theme/utils/normalize";
import { generateCssVariables } from "@coreuix/theme/utils/generateCssVariables";
import { applyTheme } from "@coreuix/theme/utils/applyTheme";

export function applyRuntimeThemeUpdate(theme: CoreUIXTheme): void {
  applyTheme(generateCssVariables(normalizeTheme(theme)));
}
