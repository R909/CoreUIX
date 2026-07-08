import type { CoreUIXTheme } from "@/theme/models";

const SHORTHAND_HEX = /^#([a-f\d])([a-f\d])([a-f\d])$/i;

function normalizeColor(value: string): string {
  return value.replace(SHORTHAND_HEX, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`);
}

export function normalizeTheme(theme: CoreUIXTheme): CoreUIXTheme {
  const colors = Object.fromEntries(
    Object.entries(theme.colors).map(([key, value]) => [key, normalizeColor(value)])
  ) as CoreUIXTheme["colors"];

  return {
    ...theme,
    colors,
  };
}
