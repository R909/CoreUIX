import { createContext, useContext } from "react";
import type { CoreUIXTheme } from "./types";
import { defaultTheme } from "./defaultTheme";

export const ThemeContext = createContext<CoreUIXTheme>(defaultTheme);

export function useTheme() {
  return useContext(ThemeContext);
}