import type { CoreUIXTheme } from "@coreuix/theme/types";
import { camelToKebab } from "@coreuix/theme/utils/camelToKebab";
import { normalizeColor } from "@coreuix/theme/utils/color";

export function generateCssVariables(theme: CoreUIXTheme): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(theme.colors).forEach(([key, value]) => {
    variables[`--cuix-colors-${camelToKebab(key)}`] = normalizeColor(value);
  });

  Object.entries(theme.radius).forEach(([key, value]) => {
    variables[`--cuix-radius-${camelToKebab(key)}`] = value;
  });

  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--cuix-spacing-${camelToKebab(key)}`] = value;
  });

  Object.entries(theme.shadow).forEach(([key, value]) => {
    variables[`--cuix-shadow-${camelToKebab(key)}`] = value;
  });

  Object.entries(theme.zIndex).forEach(([key, value]) => {
    variables[`--cuix-z-index-${camelToKebab(key)}`] = value;
  });

  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    variables[`--cuix-breakpoint-${camelToKebab(key)}`] = value;
  });

  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    variables[`--cuix-font-family-${camelToKebab(key)}`] = value;
  });

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables[`--cuix-font-size-${camelToKebab(key)}`] = value;
  });

  variables["--cuix-line-height"] = theme.typography.lineHeight;

  return variables;
}
