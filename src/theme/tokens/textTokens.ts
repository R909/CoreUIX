// Default semantic text colors, size-scaled style presets, and decoration/transform/layout values.
import type { CoreUIXTheme } from "@theme/models";

export const text: CoreUIXTheme["text"] = {
  color: {
    primary: "#111827",
    secondary: "#374151",
    muted: "#6b7280",
    disabled: "#9ca3af",
    link: "#2563eb",
    danger: "#dc2626",
    success: "#16a34a",
    warning: "#d97706",
    inverse: "#ffffff",
  },
  heading: {
    h1: { fontSize: "36px", fontWeight: "700", lineHeight: "40px" },
    h2: { fontSize: "30px", fontWeight: "700", lineHeight: "36px" },
    h3: { fontSize: "24px", fontWeight: "600", lineHeight: "32px" },
    h4: { fontSize: "20px", fontWeight: "600", lineHeight: "28px" },
  },
  body: {
    sm: { fontSize: "14px", fontWeight: "400", lineHeight: "20px" },
    md: { fontSize: "16px", fontWeight: "400", lineHeight: "24px" },
    lg: { fontSize: "18px", fontWeight: "400", lineHeight: "28px" },
  },
  caption: {
    sm: { fontSize: "11px", fontWeight: "400", lineHeight: "14px" },
    md: { fontSize: "12px", fontWeight: "400", lineHeight: "16px" },
  },
  label: {
    sm: { fontSize: "12px", fontWeight: "500", lineHeight: "16px" },
    md: { fontSize: "14px", fontWeight: "500", lineHeight: "20px" },
  },
  decoration: {
    underline: "underline",
    lineThrough: "line-through",
    none: "none",
  },
  transform: {
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
    none: "none",
  },
  overflow: {
    ellipsis: "ellipsis",
    clip: "clip",
  },
  whiteSpace: {
    normal: "normal",
    nowrap: "nowrap",
    pre: "pre",
    preWrap: "pre-wrap",
  },
  align: {
    left: "left",
    center: "center",
    right: "right",
    justify: "justify",
  },
};
