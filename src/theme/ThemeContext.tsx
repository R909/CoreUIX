import { createContext } from "react";
import type { CoreUIXTheme } from "@/theme/models";
import { defaultTheme } from "@/theme/core";

export const ThemeContext = createContext<CoreUIXTheme>(defaultTheme);
