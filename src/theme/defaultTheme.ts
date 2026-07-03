import type { CoreUIXTheme } from "./types";

export const defaultTheme: CoreUIXTheme = {
  colors: {
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
  },

  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
  },

  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },

  zIndex: {
    modal: "1000",
    tooltip: "1500",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
  },

  typography: {
    fontFamily: {
      body: "Inter, sans-serif",
      heading: "Inter, sans-serif",
    },
    fontSize: {
      sm: "14px",
      md: "16px",
      lg: "18px",
    },
    lineHeight: "24px",
  },
};
