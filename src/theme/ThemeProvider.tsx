import type { ReactNode } from "react";

import { ThemeContext } from "./ThemeContext";
import { createTheme } from "./createTheme";
import type { CoreUIXTheme } from "./types";

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Partial<CoreUIXTheme>;
}

export function ThemeProvider({
  children,
  theme = {},
}: ThemeProviderProps) {
  const mergedTheme = createTheme(theme);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}