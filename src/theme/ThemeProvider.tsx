"use client";

import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";

import { ThemeContext } from "@/theme/ThemeContext";
import { createTheme } from "@/theme/core";
import { applyRuntimeThemeUpdate } from "@/theme/utils";
import type { CoreUIXTheme, DeepPartial } from "@/theme/models";

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
    applyRuntimeThemeUpdate(mergedTheme);
  }, [mergedTheme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}