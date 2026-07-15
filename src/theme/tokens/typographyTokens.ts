// Default font families, sizes, and line height.
import type { CoreUIXTheme } from "@theme/models";

export const typography: CoreUIXTheme["typography"] = {
  fontFamily: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
  },
  fontWeight: {
    medium: "500",
    semibold: "600",
  },
  letterSpacing: {
    normal: "0em",
    tight: "-0.025em",
  },
  lineHeight: "24px",
  lineHeightTight: "1",
};
