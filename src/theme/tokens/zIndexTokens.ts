// Default z-index stacking order, lowest to highest layer.
import type { CoreUIXTheme } from "@theme/models";

export const zIndex: CoreUIXTheme["zIndex"] = {
  dropdown: "1000",
  sticky: "1020",
  overlay: "1030",
  modal: "1040",
  popover: "1050",
  toast: "1060",
  tooltip: "1070",
};
