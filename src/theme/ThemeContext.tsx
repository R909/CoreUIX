// React context holding the current theme.
import { createContext } from "react";
import type { Context } from "react";
import type { CoreUIXTheme } from "@theme/models";
import { defaultTheme } from "@theme/core";

export const ThemeContext: Context<CoreUIXTheme> =
  createContext<CoreUIXTheme>(defaultTheme);
