import type { CoreUIXTheme } from "./types";

function camelToKebab(key: string) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function applyTheme(theme: CoreUIXTheme) {
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--cuix-colors-${camelToKebab(key)}`, value);
  });

  Object.entries(theme.radius).forEach(([key, value]) => {
    root.style.setProperty(`--cuix-radius-${camelToKebab(key)}`, value);
  });

  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--cuix-spacing-${camelToKebab(key)}`, value);
  });

  Object.entries(theme.shadow).forEach(([key, value]) => {
    root.style.setProperty(`--cuix-shadow-${camelToKebab(key)}`, value);
  });

  Object.entries(theme.zIndex).forEach(([key, value]) => {
    root.style.setProperty(`--cuix-z-index-${camelToKebab(key)}`, value);
  });

  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    root.style.setProperty(`--cuix-breakpoint-${camelToKebab(key)}`, value);
  });

  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    root.style.setProperty(`--cuix-font-family-${camelToKebab(key)}`, value);
  });

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--cuix-font-size-${camelToKebab(key)}`, value);
  });

  root.style.setProperty("--cuix-line-height", theme.typography.lineHeight);
}
