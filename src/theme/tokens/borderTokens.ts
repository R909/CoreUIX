// Default border width and style values.
import type { CoreUIXTheme } from "@theme/models";

export const border: CoreUIXTheme["border"] = {
  width: {
    none: "0px",
    thin: "1px",
    thick: "2px",
  },
  style: {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
    none: "none",
  },
};
