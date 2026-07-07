"use client";

import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";

import { ThemeContext } from "./ThemeContext";
import { createTheme } from "./createTheme";
import { applyTheme } from "./applyTheme";
import type { CoreUIXTheme, DeepPartial } from "./types";

interface ThemeProviderProps {
  children: ReactNode;
  theme?: DeepPartial<CoreUIXTheme>;
}

export function ThemeProvider({
  children,
  theme = {},
}: ThemeProviderProps) {
  const mergedTheme = useMemo(() => createTheme(theme), [theme]);

  useEffect(() => {
    applyTheme(mergedTheme);
  }, [mergedTheme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}