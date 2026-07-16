// Converts the theme object into --cuix-* CSS variables.
import type { CoreUIXTheme } from "@theme/models";

// Flat map of CSS variable names to values, e.g. "--cuix-colors-primary" -> "#2563eb".
export type DesignTokenMap = Record<string, string>;

// Top-level theme sections that flatten straight to `--cuix-<prefix>-<key>` vars.
// Typed against `keyof CoreUIXTheme` so adding a new theme section that isn't listed
// here (and isn't in EXCLUDED_SECTIONS) is caught below instead of silently dropped.
// eslint-disable-next-line @typescript-eslint/typedef -- `as const satisfies` gives this its literal tuple type, which `(typeof FLAT_SECTIONS)[number]` below relies on; a widened `readonly (keyof CoreUIXTheme)[]` annotation would break SECTION_CSS_PREFIX's Record key type.
const FLAT_SECTIONS = [
  "colors",
  "radius",
  "spacing",
  "shadow",
  "zIndex",
  "breakpoints",
  "width",
  "height",
  "sidebar",
  "opacity",
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
  sidebar: "sidebar",
  opacity: "opacity",
};

// Nested `typography.*` sub-sections that flatten to `--cuix-<prefix>-<key>` vars.
// eslint-disable-next-line @typescript-eslint/typedef -- `as const satisfies` gives this its literal tuple type, which `(typeof TYPOGRAPHY_SECTIONS)[number]` below relies on; a widened annotation would break TYPOGRAPHY_CSS_PREFIX's Record key type.
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

// Nested `border.*` sub-sections that flatten to `--cuix-<prefix>-<key>` vars.
// eslint-disable-next-line @typescript-eslint/typedef -- `as const satisfies` gives this its literal tuple type, which `(typeof BORDER_SECTIONS)[number]` below relies on; a widened annotation would break BORDER_CSS_PREFIX's Record key type.
const BORDER_SECTIONS = [
  "width",
  "style",
] as const satisfies readonly (keyof CoreUIXTheme["border"])[];

const BORDER_CSS_PREFIX: Record<(typeof BORDER_SECTIONS)[number], string> = {
  width: "border-width",
  style: "border-style",
};

// Nested `transition.*` sub-sections that flatten to `--cuix-<prefix>-<key>` vars.
// eslint-disable-next-line @typescript-eslint/typedef -- `as const satisfies` gives this its literal tuple type, which `(typeof TRANSITION_SECTIONS)[number]` below relies on; a widened annotation would break TRANSITION_CSS_PREFIX's Record key type.
const TRANSITION_SECTIONS = [
  "duration",
  "easing",
] as const satisfies readonly (keyof CoreUIXTheme["transition"])[];

const TRANSITION_CSS_PREFIX: Record<
  (typeof TRANSITION_SECTIONS)[number],
  string
> = {
  duration: "transition-duration",
  easing: "transition-easing",
};

// Nested `text.*` sub-sections that are already flat `Record<string, string>`
// and flatten straight to `--cuix-<prefix>-<key>` vars.
// eslint-disable-next-line @typescript-eslint/typedef -- `as const satisfies` gives this its literal tuple type, which `(typeof TEXT_FLAT_SECTIONS)[number]` below relies on; a widened annotation would break TEXT_FLAT_CSS_PREFIX's Record key type.
const TEXT_FLAT_SECTIONS = [
  "color",
  "decoration",
  "transform",
  "overflow",
  "whiteSpace",
  "align",
] as const satisfies readonly (keyof CoreUIXTheme["text"])[];

const TEXT_FLAT_CSS_PREFIX: Record<
  (typeof TEXT_FLAT_SECTIONS)[number],
  string
> = {
  color: "text-color",
  decoration: "text-decoration",
  transform: "text-transform",
  overflow: "text-overflow",
  whiteSpace: "text-white-space",
  align: "text-align",
};

// Nested `text.*` sub-sections that are size-keyed style presets (each size
// holding `{ fontSize, fontWeight, lineHeight }`) and flatten to
// `--cuix-<prefix>-<size>-<prop>` vars, e.g. `--cuix-text-heading-h1-font-size`.
// eslint-disable-next-line @typescript-eslint/typedef -- `as const satisfies` gives this its literal tuple type, which `(typeof TEXT_PRESET_SECTIONS)[number]` below relies on; a widened annotation would break TEXT_PRESET_CSS_PREFIX's Record key type.
const TEXT_PRESET_SECTIONS = [
  "heading",
  "body",
  "caption",
  "label",
] as const satisfies readonly (keyof CoreUIXTheme["text"])[];

const TEXT_PRESET_CSS_PREFIX: Record<
  (typeof TEXT_PRESET_SECTIONS)[number],
  string
> = {
  heading: "text-heading",
  body: "text-body",
  caption: "text-caption",
  label: "text-label",
};

// Theme sections deliberately excluded from CSS-variable generation: `flex` holds
// pre-composed Tailwind class strings (e.g. "flex flex-row"), not CSS values, so
// it isn't meaningful as a `var()` target — components read it via useTheme() instead.
// eslint-disable-next-line @typescript-eslint/typedef -- `as const satisfies` gives this its literal tuple type, used verbatim in the `accountedFor` set below; a widened annotation isn't needed and only reduces precision.
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
    const prefix: string = SECTION_CSS_PREFIX[section];
    Object.entries(theme[section]).forEach(([key, value]: [string, string]) => {
      tokens[`--cuix-${prefix}-${camelToKebab(key)}`] = value;
    });
  }

  for (const section of TYPOGRAPHY_SECTIONS) {
    const prefix: string = TYPOGRAPHY_CSS_PREFIX[section];
    Object.entries(theme.typography[section]).forEach(
      ([key, value]: [string, string]) => {
        tokens[`--cuix-${prefix}-${camelToKebab(key)}`] = value;
      },
    );
  }

  tokens["--cuix-line-height"] = theme.typography.lineHeight;
  tokens["--cuix-line-height-tight"] = theme.typography.lineHeightTight;

  for (const section of BORDER_SECTIONS) {
    const prefix: string = BORDER_CSS_PREFIX[section];
    Object.entries(theme.border[section]).forEach(
      ([key, value]: [string, string]) => {
        tokens[`--cuix-${prefix}-${camelToKebab(key)}`] = value;
      },
    );
  }

  for (const section of TRANSITION_SECTIONS) {
    const prefix: string = TRANSITION_CSS_PREFIX[section];
    Object.entries(theme.transition[section]).forEach(
      ([key, value]: [string, string]) => {
        tokens[`--cuix-${prefix}-${camelToKebab(key)}`] = value;
      },
    );
  }

  for (const section of TEXT_FLAT_SECTIONS) {
    const prefix: string = TEXT_FLAT_CSS_PREFIX[section];
    Object.entries(theme.text[section]).forEach(
      ([key, value]: [string, string]) => {
        tokens[`--cuix-${prefix}-${camelToKebab(key)}`] = value;
      },
    );
  }

  for (const section of TEXT_PRESET_SECTIONS) {
    const prefix: string = TEXT_PRESET_CSS_PREFIX[section];
    Object.entries(theme.text[section]).forEach(
      ([sizeKey, sizeValue]: [
        string,
        { fontSize: string; fontWeight: string; lineHeight: string },
      ]) => {
        Object.entries(sizeValue).forEach(([prop, value]: [string, string]) => {
          tokens[
            `--cuix-${prefix}-${camelToKebab(sizeKey)}-${camelToKebab(prop)}`
          ] = value;
        });
      },
    );
  }

  // Fails loudly if a new top-level theme section is added to CoreUIXTheme without
  // wiring it into FLAT_SECTIONS or EXCLUDED_SECTIONS above — this is what let `flex`
  // silently fall through before instead of surfacing as an error.
  const accountedFor: Set<string> = new Set<string>([
    ...FLAT_SECTIONS,
    ...EXCLUDED_SECTIONS,
    "typography",
    "text",
    "border",
    "transition",
  ]);
  const unhandledSections: (keyof CoreUIXTheme)[] = (
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
