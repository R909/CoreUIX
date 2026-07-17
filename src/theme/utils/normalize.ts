// Normalizes color values before generating CSS variables.
import type { CoreUIXTheme } from "@theme/models";

// Matches shorthand hex colors like #fff.
const SHORTHAND_HEX: RegExp = /^#([a-f\d])([a-f\d])([a-f\d])$/i;

// Expands shorthand hex to full 6-digit hex (#fff -> #ffffff).
function normalizeColor(value: string): string {
  return value.replace(
    SHORTHAND_HEX,
    (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`,
  );
}

// Returns the theme with all colors normalized.
export function normalizeTheme(theme: CoreUIXTheme): CoreUIXTheme {
  const colors: CoreUIXTheme["colors"] = Object.fromEntries(
    Object.entries(theme.colors).map(
      ([key, value]: [string, string | string[]]) => [
        key,
        Array.isArray(value)
          ? value.map(normalizeColor)
          : normalizeColor(value),
      ],
    ),
  ) as CoreUIXTheme["colors"];

  return {
    ...theme,
    colors,
  };
}
