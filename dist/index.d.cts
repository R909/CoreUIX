import * as clsx from 'clsx';
import { ClassValue } from 'clsx';
import * as class_variance_authority_types from 'class-variance-authority/types';
import * as React from 'react';
import { ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
export { VariantProps } from 'class-variance-authority';

declare function cn(...inputs: ClassValue[]): string;

declare function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T;

declare const createVariants: <T>(base?: class_variance_authority_types.ClassValue, config?: T extends {
    [x: string]: Record<string, clsx.ClassValue>;
} ? {
    variants?: T | undefined;
    defaultVariants?: { [Variant in keyof T]?: class_variance_authority_types.StringToBoolean<keyof T[Variant]> | null | undefined; } | undefined;
    compoundVariants?: (T extends {
        [x: string]: Record<string, clsx.ClassValue>;
    } ? ({ [Variant in keyof T]?: class_variance_authority_types.StringToBoolean<keyof T[Variant]> | null | undefined; } | { [Variant_1 in keyof T]?: class_variance_authority_types.StringToBoolean<keyof T[Variant_1]> | class_variance_authority_types.StringToBoolean<keyof T[Variant_1]>[] | undefined; }) & class_variance_authority_types.ClassProp : class_variance_authority_types.ClassProp)[] | undefined;
} : never) => (props?: T extends {
    [x: string]: Record<string, clsx.ClassValue>;
} ? { [Variant in keyof T]?: class_variance_authority_types.StringToBoolean<keyof T[Variant]> | null | undefined; } & class_variance_authority_types.ClassProp : class_variance_authority_types.ClassProp) => string;

declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
};

declare const Button: ({ className, variant, size, asChild, ...props }: ButtonProps) => React.JSX.Element;

declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;

declare function Badge({ className, variant, asChild, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
}): React.JSX.Element;

declare const Card: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;

interface CoreUIXTheme {
    colors: {
        background: string;
        foreground: string;
        primary: string;
        primaryForeground: string;
        secondary: string;
        secondaryForeground: string;
        destructive: string;
        destructiveForeground: string;
        border: string;
        input: string;
        ring: string;
        muted: string;
        mutedForeground: string;
        accent: string;
        accentForeground: string;
        popover: string;
        popoverForeground: string;
        card: string;
        cardForeground: string;
    };
    radius: {
        sm: string;
        md: string;
        lg: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
    };
    shadow: {
        sm: string;
        md: string;
        lg: string;
    };
    zIndex: {
        modal: string;
        tooltip: string;
    };
    breakpoints: {
        sm: string;
        md: string;
    };
    typography: {
        fontFamily: {
            body: string;
            heading: string;
        };
        fontSize: {
            sm: string;
            md: string;
            lg: string;
        };
        lineHeight: string;
    };
    flex: {
        row: string;
        col: string;
        center: string;
        between: string;
        around: string;
        evenly: string;
        start: string;
        end: string;
        wrap: string;
        nowrap: string;
        inline: string;
        inlineCenter: string;
    };
}

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends (...args: unknown[]) => unknown ? T[K] : T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface ThemeProviderProps {
    children: ReactNode;
    theme?: DeepPartial<CoreUIXTheme>;
}
declare function ThemeProvider({ children, theme, }: ThemeProviderProps): React.JSX.Element;

declare const ThemeContext: React.Context<CoreUIXTheme>;

declare function useTheme(): CoreUIXTheme;

declare const colors: CoreUIXTheme["colors"];

declare const typography: CoreUIXTheme["typography"];

declare const spacing: CoreUIXTheme["spacing"];

declare const radius: CoreUIXTheme["radius"];

declare const shadow: CoreUIXTheme["shadow"];

declare const breakpoints: CoreUIXTheme["breakpoints"];

declare const flex: CoreUIXTheme["flex"];

declare const zIndex: CoreUIXTheme["zIndex"];

declare function createTheme(theme?: DeepPartial<CoreUIXTheme>): CoreUIXTheme;

declare const defaultTheme: CoreUIXTheme;

declare function mergeTheme(base: CoreUIXTheme, override: DeepPartial<CoreUIXTheme>): CoreUIXTheme;

declare function applyTheme(cssVariables: Record<string, string>): void;

type DesignTokenMap = Record<string, string>;
declare function generateCssVariables(theme: CoreUIXTheme): DesignTokenMap;

declare function normalizeTheme(theme: CoreUIXTheme): CoreUIXTheme;

declare function applyRuntimeThemeUpdate(theme: CoreUIXTheme): void;

export { Badge, Button, type ButtonProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CoreUIXTheme, type DeepPartial, type DesignTokenMap, ThemeContext, ThemeProvider, applyRuntimeThemeUpdate, applyTheme, breakpoints, buttonVariants, cn, colors, createTheme, createVariants, deepMerge, defaultTheme, flex, generateCssVariables, mergeTheme, normalizeTheme, radius, shadow, spacing, typography, useTheme, zIndex };
