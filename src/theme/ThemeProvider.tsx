"use client";

import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";

import { ThemeContext } from "@coreuix/theme/ThemeContext";
import { createTheme } from "@coreuix/theme/core";
import { applyRuntimeThemeUpdate } from "@coreuix/theme/utils";
import type { CoreUIXTheme, DeepPartial } from "@coreuix/theme/models";

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