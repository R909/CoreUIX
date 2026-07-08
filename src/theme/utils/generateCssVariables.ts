import type { CoreUIXTheme } from "@/theme/models";

export type DesignTokenMap = Record<string, string>;

const SECTION_CSS_PREFIX: Record<string, string> = {
  colors: "colors",
  radius: "radius",
  spacing: "spacing",
  shadow: "shadow",
  zIndex: "z-index",
  breakpoints: "breakpoint",
  "typography.fontFamily": "font-family",
  "typography.fontSize": "font-size",
};

const DIRECT_CSS_NAME: Record<string, string> = {
  "typography.lineHeight": "line-height",
};

function camelToKebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function toCssVariableName(tokenKey: string): string {
  const directName = DIRECT_CSS_NAME[tokenKey];
  if (directName) {
    return `--cuix-${directName}`;
  }

  const lastDot = tokenKey.lastIndexOf(".");
  const section = tokenKey.slice(0, lastDot);
  const key = tokenKey.slice(lastDot + 1);
  const prefix = SECTION_CSS_PREFIX[section];

  return `--cuix-${prefix}-${camelToKebab(key)}`;
}

function flattenTheme(theme: CoreUIXTheme): DesignTokenMap {
  const tokens: DesignTokenMap = {};

  Object.entries(theme.colors).forEach(([key, value]) => {
    tokens[`colors.${key}`] = value;
  });

  Object.entries(theme.radius).forEach(([key, value]) => {
    tokens[`radius.${key}`] = value;
  });

  Object.entries(theme.spacing).forEach(([key, value]) => {
    tokens[`spacing.${key}`] = value;
  });

  Object.entries(theme.shadow).forEach(([key, value]) => {
    tokens[`shadow.${key}`] = value;
  });

  Object.entries(theme.zIndex).forEach(([key, value]) => {
    tokens[`zIndex.${key}`] = value;
  });

  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    tokens[`breakpoints.${key}`] = value;
  });

  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    tokens[`typography.fontFamily.${key}`] = value;
  });

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    tokens[`typography.fontSize.${key}`] = value;
  });

  tokens["typography.lineHeight"] = theme.typography.lineHeight;

  return tokens;
}

export function generateCssVariables(theme: CoreUIXTheme): DesignTokenMap {
  const tokens = flattenTheme(theme);

  return Object.fromEntries(
    Object.entries(tokens).map(([tokenKey, value]) => [toCssVariableName(tokenKey), value])
  );
}
