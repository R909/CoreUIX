// Default transition duration and easing values.
import type { CoreUIXTheme } from "@theme/models";

export const transition: CoreUIXTheme["transition"] = {
  duration: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
  },
  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};
