// src/utils/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/utils/deepMerge.ts
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}
function deepMerge(target, source) {
  const result = { ...target };
  Object.entries(source).forEach(([key, sourceValue]) => {
    const targetValue = result[key];
    result[key] = isPlainObject(targetValue) && isPlainObject(sourceValue) ? deepMerge(targetValue, sourceValue) : sourceValue;
  });
  return result;
}

// src/utils/createVariants.ts
import { cva } from "class-variance-authority";
var createVariants = cva;

// src/components/primitives/button/Button.tsx
import { Slot } from "@radix-ui/react-slot";

// src/components/primitives/button/button.variants.ts
import { cva as cva2 } from "class-variance-authority";
var buttonVariants = cva2(
  "inline-flex items-center justify-center gap-[var(--cuix-spacing-sm)] whitespace-nowrap rounded-[var(--cuix-radius-md)] text-[var(--cuix-font-size-sm)] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:border-[var(--cuix-colors-ring)] focus-visible:ring-[var(--cuix-colors-ring)]/50 focus-visible:ring-[3px] aria-invalid:ring-[var(--cuix-colors-destructive)]/20 aria-invalid:border-[var(--cuix-colors-destructive)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--cuix-colors-primary)] text-[var(--cuix-colors-primary-foreground)] shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-primary)]/90",
        destructive: "bg-[var(--cuix-colors-destructive)] text-[var(--cuix-colors-destructive-foreground)] shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-destructive)]/90 focus-visible:ring-[var(--cuix-colors-destructive)]/20",
        outline: "border border-[var(--cuix-colors-border)] bg-[var(--cuix-colors-background)] shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-accent)] hover:text-[var(--cuix-colors-accent-foreground)]",
        secondary: "bg-[var(--cuix-colors-secondary)] text-[var(--cuix-colors-secondary-foreground)] shadow-[var(--cuix-shadow-sm)] hover:bg-[var(--cuix-colors-secondary)]/80",
        ghost: "hover:bg-[var(--cuix-colors-accent)] hover:text-[var(--cuix-colors-accent-foreground)]",
        link: "text-[var(--cuix-colors-primary)] underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-[var(--cuix-spacing-md)] py-[var(--cuix-spacing-sm)] has-[>svg]:px-3",
        sm: "h-8 rounded-[var(--cuix-radius-md)] gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-[var(--cuix-radius-md)] px-[var(--cuix-spacing-lg)] has-[>svg]:px-[var(--cuix-spacing-md)]",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

// src/components/primitives/button/Button.tsx
import { jsx } from "react/jsx-runtime";
var Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
};

// src/components/primitives/badge/badge.tsx
import { Slot as Slot2 } from "@radix-ui/react-slot";

// src/components/primitives/badge/badge.variants.ts
import { cva as cva3 } from "class-variance-authority";
var badgeVariants = cva3(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

// src/components/primitives/badge/badge.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot2 : "span";
  return /* @__PURE__ */ jsx2(Comp, { "data-slot": "badge", className: cn(badgeVariants({ variant }), className), ...props });
}

// src/components/layout/card/card.tsx
import * as React from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
var CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

// src/theme/ThemeProvider.tsx
import { useEffect, useMemo } from "react";

// src/theme/ThemeContext.tsx
import { createContext } from "react";

// src/theme/tokens/colorsTokens.ts
var colors = {
  background: "#ffffff",
  foreground: "#111827",
  primary: "#2563eb",
  primaryForeground: "#ffffff",
  secondary: "#f3f4f6",
  secondaryForeground: "#111827",
  destructive: "#dc2626",
  destructiveForeground: "#ffffff",
  border: "#e5e7eb",
  input: "#e5e7eb",
  ring: "#2563eb",
  muted: "#f9fafb",
  mutedForeground: "#6b7280",
  accent: "#f3f4f6",
  accentForeground: "#111827",
  popover: "#ffffff",
  popoverForeground: "#111827",
  card: "#ffffff",
  cardForeground: "#111827"
};

// src/theme/tokens/typographyTokens.ts
var typography = {
  fontFamily: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif"
  },
  fontSize: {
    sm: "14px",
    md: "16px",
    lg: "18px"
  },
  lineHeight: "24px"
};

// src/theme/tokens/spacingTokens.ts
var spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px"
};

// src/theme/tokens/radiusTokens.ts
var radius = {
  sm: "6px",
  md: "8px",
  lg: "12px"
};

// src/theme/tokens/shadowsTokens.ts
var shadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
};

// src/theme/tokens/breakpointsTokens.ts
var breakpoints = {
  sm: "640px",
  md: "768px"
};

// src/theme/tokens/flexTokens.ts
var flex = {
  row: "flex flex-row",
  col: "flex flex-col",
  center: "flex items-center justify-center",
  between: "flex items-center justify-between",
  around: "flex items-center justify-around",
  evenly: "flex items-center justify-evenly",
  start: "flex items-center justify-start",
  end: "flex items-center justify-end",
  wrap: "flex flex-wrap",
  nowrap: "flex flex-nowrap",
  inline: "inline-flex",
  inlineCenter: "inline-flex items-center justify-center"
};

// src/theme/tokens/zIndexTokens.ts
var zIndex = {
  modal: "1000",
  tooltip: "1010"
};

// src/theme/core/defaultTheme.ts
var defaultTheme = {
  colors,
  radius,
  spacing,
  typography,
  shadow,
  breakpoints,
  flex,
  zIndex
};

// src/theme/core/mergeTheme.ts
function mergeTheme(base, override) {
  return deepMerge(
    base,
    override
  );
}

// src/theme/core/createTheme.ts
function createTheme(theme = {}) {
  return mergeTheme(defaultTheme, theme);
}

// src/theme/ThemeContext.tsx
var ThemeContext = createContext(defaultTheme);

// src/theme/utils/applyTheme.ts
function applyTheme(cssVariables) {
  const root = document.documentElement;
  Object.entries(cssVariables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}

// src/theme/utils/generateCssVariables.ts
var SECTION_CSS_PREFIX = {
  colors: "colors",
  radius: "radius",
  spacing: "spacing",
  shadow: "shadow",
  zIndex: "z-index",
  breakpoints: "breakpoint",
  "typography.fontFamily": "font-family",
  "typography.fontSize": "font-size"
};
var DIRECT_CSS_NAME = {
  "typography.lineHeight": "line-height"
};
function camelToKebab(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function toCssVariableName(tokenKey) {
  const directName = DIRECT_CSS_NAME[tokenKey];
  if (directName) {
    return `--cuix-${directName}`;
  }
  const lastDot = tokenKey.lastIndexOf(".");
  const section = tokenKey.slice(0, lastDot);
  const key = tokenKey.slice(lastDot + 1);
  const prefix = SECTION_CSS_PREFIX[section];
  return `--cuix-${prefix}-${camelToKebab(key)}`;
}
function flattenTheme(theme) {
  const tokens = {};
  Object.entries(theme.colors).forEach(([key, value]) => {
    tokens[`colors.${key}`] = value;
  });
  Object.entries(theme.radius).forEach(([key, value]) => {
    tokens[`radius.${key}`] = value;
  });
  Object.entries(theme.spacing).forEach(([key, value]) => {
    tokens[`spacing.${key}`] = value;
  });
  Object.entries(theme.shadow).forEach(([key, value]) => {
    tokens[`shadow.${key}`] = value;
  });
  Object.entries(theme.zIndex).forEach(([key, value]) => {
    tokens[`zIndex.${key}`] = value;
  });
  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    tokens[`breakpoints.${key}`] = value;
  });
  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    tokens[`typography.fontFamily.${key}`] = value;
  });
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    tokens[`typography.fontSize.${key}`] = value;
  });
  tokens["typography.lineHeight"] = theme.typography.lineHeight;
  return tokens;
}
function generateCssVariables(theme) {
  const tokens = flattenTheme(theme);
  return Object.fromEntries(
    Object.entries(tokens).map(([tokenKey, value]) => [toCssVariableName(tokenKey), value])
  );
}

// src/theme/utils/normalize.ts
var SHORTHAND_HEX = /^#([a-f\d])([a-f\d])([a-f\d])$/i;
function normalizeColor(value) {
  return value.replace(SHORTHAND_HEX, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`);
}
function normalizeTheme(theme) {
  const colors2 = Object.fromEntries(
    Object.entries(theme.colors).map(([key, value]) => [key, normalizeColor(value)])
  );
  return {
    ...theme,
    colors: colors2
  };
}

// src/theme/utils/runtimeUpdate.ts
function applyRuntimeThemeUpdate(theme) {
  applyTheme(generateCssVariables(normalizeTheme(theme)));
}

// src/theme/ThemeProvider.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function ThemeProvider({
  children,
  theme = {}
}) {
  const mergedTheme = useMemo(() => createTheme(theme), [theme]);
  useEffect(() => {
    applyRuntimeThemeUpdate(mergedTheme);
  }, [mergedTheme]);
  return /* @__PURE__ */ jsx4(ThemeContext.Provider, { value: mergedTheme, children });
}

// src/theme/useTheme.ts
import { useContext } from "react";
function useTheme() {
  return useContext(ThemeContext);
}
export {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ThemeContext,
  ThemeProvider,
  applyRuntimeThemeUpdate,
  applyTheme,
  breakpoints,
  buttonVariants,
  cn,
  colors,
  createTheme,
  createVariants,
  deepMerge,
  defaultTheme,
  flex,
  generateCssVariables,
  mergeTheme,
  normalizeTheme,
  radius,
  shadow,
  spacing,
  typography,
  useTheme,
  zIndex
};
//# sourceMappingURL=index.js.map