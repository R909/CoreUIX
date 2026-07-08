import { useContext } from "react";
import { ThemeContext } from "@coreuix/theme/ThemeContext";

export function useTheme() {
  return useContext(ThemeContext);
}
