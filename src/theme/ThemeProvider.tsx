"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { ThemeContext } from "./ThemeContext";
import { createTheme } from "./createTheme";
import type { CoreUIXTheme, DeepPartial } from "./types";

interface ThemeProviderProps {
  children: ReactNode;
  theme?: DeepPartial<CoreUIXTheme>;
}

export function ThemeProvider({
  children,
  theme = {},
}: ThemeProviderProps) {
  const mergedTheme = createTheme(theme);

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(mergedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    Object.entries(mergedTheme.radius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    Object.entries(mergedTheme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [mergedTheme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}