import { createContext } from "react";
import type { CoreUIXTheme } from "@coreuix/theme/models";
import { defaultTheme } from "@coreuix/theme/core";

export const ThemeContext = createContext<CoreUIXTheme>(defaultTheme);
