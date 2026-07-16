"use client";

import { useEffect, useMemo } from "react";
import type { ReactElement, ReactNode } from "react";

import { ThemeContext } from "@theme/ThemeContext";
import { createTheme } from "@theme/core";
import { applyRuntimeThemeUpdate } from "@theme/utils";
import type { CoreUIXTheme, DeepPartial } from "@theme/models";

interface ThemeProviderProps {
  children: ReactNode;
  // Optional theme overrides, merged with the default theme.
  theme?: DeepPartial<CoreUIXTheme>;
}

// Provides the merged theme to the app and syncs it to CSS variables.
export function ThemeProvider({
  children,
  theme = {},
}: ThemeProviderProps): ReactElement {
  const mergedTheme: CoreUIXTheme = useMemo(() => createTheme(theme), [theme]);

  // Update CSS variables whenever the theme changes.
  useEffect(() => {
    applyRuntimeThemeUpdate(mergedTheme);
  }, [mergedTheme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
