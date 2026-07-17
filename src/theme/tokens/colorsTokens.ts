// Default color values for the light theme. Dark theme colors live in src/styles.css.
import type { CoreUIXTheme } from "@theme/models";

export const colors: CoreUIXTheme["colors"] = {
  background: "#ffffff",
  foreground: "#111827",

  primary: "#2563eb",
  primaryForeground: "#ffffff",

  secondary: "#f3f4f6",
  secondaryForeground: "#111827",

  destructive: "#dc2626",
  destructiveForeground: "#ffffff",

  border: "#e5e7eb",
  input: "#e5e7eb",

  ring: "#2563eb",

  muted: "#f9fafb",
  mutedForeground: "#6b7280",

  accent: "#f3f4f6",
  accentForeground: "#111827",

  popover: "#ffffff",
  popoverForeground: "#111827",

  card: "#ffffff",
  cardForeground: "#111827",

  success: "#16a34a",
  successForeground: "#ffffff",

  warning: "#d97706",
  warningForeground: "#111827",

  info: "#0284c7",
  infoForeground: "#ffffff",

  transparent: "transparent",

  // Additive tokens from the app-side color palette. Dark values live in
  // src/styles.css's .dark block, matching every other color token here.
  text: "#111827",
  textSecondary: "#6B7280",
  notification: "#EF4444",
  error: "#EF4444",
  disabled: "#D1D5DB",
  placeholder: "#8E9DA6",
  overlay: "rgba(0, 0, 0, 0.4)",
  white: "#FFFFFF",
  black: "#000000",
  gradientColors: ["#4F46E5", "#06B6D4"],
  cardBackground: "#0F2A44",

  tintGolden: "#FFD166",
  tintGoldenBackground: "#FFF4CC",

  tintCyan: "#4ECDC4",
  tintCyanBackground: "#DDF7F5",

  tintBlue: "#4299E1",
  tintBlueBackground: "#E7F2FD",

  tintPurple: "#858DE5",
  tinitPurpleBackground: "#ECEEFF",
  lightWhite: "#ffffff9e",
  yellow: "#FCD34D",

  gradientStart: "#1DA1F2",
  gradientEnd: "#74D2FF",

  userInfoCardText: "#fff",
  grey: "#A0AEC0",
  serviceBG: "#0F2A44",
  toggleBG: "#192D44",
  toggleBtnBG: "#D1D5DB",

  mainAppBg: "#0C1221",

  cyanBlue: "#11CCF2",
};
