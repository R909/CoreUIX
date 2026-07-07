import type { CoreUIXTheme } from "@coreuix/theme/types";
import { colors, radius, spacing, typography } from "@coreuix/theme/tokens";

export const defaultTheme: CoreUIXTheme = {
  colors,
  radius,
  spacing,
  typography,

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
};
