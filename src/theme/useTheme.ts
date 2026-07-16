// Hook to read the current theme.
import { useContext } from "react";
import { ThemeContext } from "@theme/ThemeContext";
import type { CoreUIXTheme } from "@theme/models";

export function useTheme(): CoreUIXTheme {
  return useContext(ThemeContext);
}
