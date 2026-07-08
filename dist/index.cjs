"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Badge: () => Badge,
  Button: () => Button,
  Card: () => Card,
  CardContent: () => CardContent,
  CardDescription: () => CardDescription,
  CardFooter: () => CardFooter,
  CardHeader: () => CardHeader,
  CardTitle: () => CardTitle,
  ThemeContext: () => ThemeContext,
  ThemeProvider: () => ThemeProvider,
  applyRuntimeThemeUpdate: () => applyRuntimeThemeUpdate,
  applyTheme: () => applyTheme,
  breakpoints: () => breakpoints,
  buttonVariants: () => buttonVariants,
  cn: () => cn,
  colors: () => colors,
  createTheme: () => createTheme,
  createVariants: () => createVariants,
  deepMerge: () => deepMerge,
  defaultTheme: () => defaultTheme,
  flex: () => flex,
  generateCssVariables: () => generateCssVariables,
  mergeTheme: () => mergeTheme,
  normalizeTheme: () => normalizeTheme,
  radius: () => radius,
  shadow: () => shadow,
  spacing: () => spacing,
  typography: () => typography,
  useTheme: () => useTheme,
  zIndex: () => zIndex
});
module.exports = __toCommonJS(index_exports);

// src/utils/cn.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
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
var import_class_variance_authority = require("class-variance-authority");
var createVariants = import_class_variance_authority.cva;

// src/components/primitives/button/Button.tsx
var import_react_slot = require("@radix-ui/react-slot");

// src/components/primitives/button/button.variants.ts
var import_class_variance_authority2 = require("class-variance-authority");
var buttonVariants = (0, import_class_variance_authority2.cva)(
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
var import_jsx_runtime = require("react/jsx-runtime");
var Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? import_react_slot.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
};

// src/components/primitives/badge/badge.tsx
var import_react_slot2 = require("@radix-ui/react-slot");

// src/components/primitives/badge/badge.variants.ts
var import_class_variance_authority3 = require("class-variance-authority");
var badgeVariants = (0, import_class_variance_authority3.cva)(
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
var import_jsx_runtime2 = require("react/jsx-runtime");
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? import_react_slot2.Slot : "span";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Comp, { "data-slot": "badge", className: cn(badgeVariants({ variant }), className), ...props });
}

// src/components/layout/card/card.tsx
var React = __toESM(require("react"), 1);
var import_jsx_runtime3 = require("react/jsx-runtime");
var Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
var CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

// src/theme/ThemeProvider.tsx
var import_react2 = require("react");

// src/theme/ThemeContext.tsx
var import_react = require("react");

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
var ThemeContext = (0, import_react.createContext)(defaultTheme);

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
var import_jsx_runtime4 = require("react/jsx-runtime");
function ThemeProvider({
  children,
  theme = {}
}) {
  const mergedTheme = (0, import_react2.useMemo)(() => createTheme(theme), [theme]);
  (0, import_react2.useEffect)(() => {
    applyRuntimeThemeUpdate(mergedTheme);
  }, [mergedTheme]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ThemeContext.Provider, { value: mergedTheme, children });
}

// src/theme/useTheme.ts
var import_react3 = require("react");
function useTheme() {
  return (0, import_react3.useContext)(ThemeContext);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map