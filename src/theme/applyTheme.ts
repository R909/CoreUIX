import type { CoreUIXTheme } from "@coreuix/theme/types";
import { generateCssVariables } from "@coreuix/theme/utils/generateCssVariables";

export function applyTheme(theme: CoreUIXTheme) {
  const root = document.documentElement;
  const variables = generateCssVariables(theme);

  Object.entries(variables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
