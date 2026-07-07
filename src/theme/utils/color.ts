const SHORTHAND_HEX = /^#([a-f\d])([a-f\d])([a-f\d])$/i;

export function normalizeColor(value: string) {
  return value.replace(SHORTHAND_HEX, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`);
}
