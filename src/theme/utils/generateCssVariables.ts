// Converts the theme object into --cuix-* CSS variables.
import type { CoreUIXTheme } from "@theme/models";

// Flat map of CSS variable names to values, e.g. "--cuix-colors-primary" -> "#2563eb".
export type DesignTokenMap = Record<string, string>;

// Top-level theme sections that flatten straight to `--cuix-<prefix>-<key>` vars.
// Typed against `keyof CoreUIXTheme` so adding a new theme section that isn't listed
// here (and isn't in EXCLUDED_SECTIONS) is caught below instead of silently dropped.
const FLAT_SECTIONS = [
  "colors",
  "radius",
  "spacing",
  "shadow",
  "zIndex",
  "breakpoints",
  "width",
  "height",
] as const satisfies readonly (keyof CoreUIXTheme)[];

// CSS variable name prefix for each flat section. Required (not optional) so a
// missing entry is a compile error, not a runtime `--cuix-undefined-*` variable.
const SECTION_CSS_PREFIX: Record<(typeof FLAT_SECTIONS)[number], string> = {
  colors: "colors",
  radius: "radius",
  spacing: "spacing",
  shadow: "shadow",
  zIndex: "z-index",
  breakpoints: "breakpoint",
  width: "width",
  height: "height",
};

// Nested `typography.*` sub-sections that flatten to `--cuix-<prefix>-<key>` vars.
const TYPOGRAPHY_SECTIONS = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "letterSpacing",
] as const satisfies readonly (keyof CoreUIXTheme["typography"])[];

const TYPOGRAPHY_CSS_PREFIX: Record<
  (typeof TYPOGRAPHY_SECTIONS)[number],
  string
> = {
  fontFamily: "font-family",
  fontSize: "font-size",
  fontWeight: "font-weight",
  letterSpacing: "letter-spacing",
};

// Theme sections deliberately excluded from CSS-variable generation: `flex` holds
// pre-composed Tailwind class strings (e.g. "flex flex-row"), not CSS values, so
// it isn't meaningful as a `var()` target — components read it via useTheme() instead.
const EXCLUDED_SECTIONS = [
  "flex",
] as const satisfies readonly (keyof CoreUIXTheme)[];

// Converts camelCase to kebab-case (e.g. primaryForeground -> primary-foreground).
function camelToKebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Flattens the nested theme object directly into `--cuix-*` CSS variable entries.
function flattenTheme(theme: CoreUIXTheme): DesignTokenMap {
  const tokens: DesignTokenMap = {};

  for (const section of FLAT_SECTIONS) {
    const prefix = SECTION_CSS_PREFIX[section];
    Object.entries(theme[section]).forEach(([key, value]) => {
      tokens[`--cuix-${prefix}-${camelToKebab(key)}`] = value;
    });
  }

  for (const section of TYPOGRAPHY_SECTIONS) {
    const prefix = TYPOGRAPHY_CSS_PREFIX[section];
    Object.entries(theme.typography[section]).forEach(([key, value]) => {
      tokens[`--cuix-${prefix}-${camelToKebab(key)}`] = value;
    });
  }

  tokens["--cuix-line-height"] = theme.typography.lineHeight;
  tokens["--cuix-line-height-tight"] = theme.typography.lineHeightTight;

  // Fails loudly if a new top-level theme section is added to CoreUIXTheme without
  // wiring it into FLAT_SECTIONS or EXCLUDED_SECTIONS above — this is what let `flex`
  // silently fall through before instead of surfacing as an error.
  const accountedFor = new Set<string>([
    ...FLAT_SECTIONS,
    ...EXCLUDED_SECTIONS,
    "typography",
  ]);
  const unhandledSections = (
    Object.keys(theme) as (keyof CoreUIXTheme)[]
  ).filter((section) => !accountedFor.has(section));
  if (unhandledSections.length > 0) {
    throw new Error(
      `generateCssVariables: unhandled theme section(s): ${unhandledSections.join(", ")}. ` +
        "Add them to FLAT_SECTIONS/TYPOGRAPHY_SECTIONS or EXCLUDED_SECTIONS in generateCssVariables.ts.",
    );
  }

  return tokens;
}

// Flattens the theme into a `--cuix-*` CSS variable map.
export function generateCssVariables(theme: CoreUIXTheme): DesignTokenMap {
  return flattenTheme(theme);
}
