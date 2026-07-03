import { ThemeContext } from "./ThemeContext";
import { createTheme } from "./createTheme";
import type {DeepPartial, CoreUIXTheme } from "./types";

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: DeepPartial<CoreUIXTheme>;
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