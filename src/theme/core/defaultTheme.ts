// Combines all default tokens and assign them to the full theme object.
import type { CoreUIXTheme } from "@theme/models";
import * as tokens from "@theme/tokens";

export const defaultTheme: CoreUIXTheme = {
  ...tokens,
};
