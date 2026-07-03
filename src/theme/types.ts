export interface CoreUIXTheme {
  colors: {
    background: string
    foreground: string

    primary: string
    primaryForeground: string

    secondary: string
    secondaryForeground: string

    destructive: string
    destructiveForeground: string

    border: string
    input: string

    ring: string

    muted: string
    mutedForeground: string

    accent: string
    accentForeground: string

    popover: string
    popoverForeground: string

    card: string
    cardForeground: string
  }

  radius: string

  typography: {
    fontFamily: string
    fontSize: string
    lineHeight: string
  }
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: any[]) => any
    ? T[K]
    : T[K] extends readonly any[]
      ? T[K]
      : T[K] extends object
        ? DeepPartial<T[K]>
        : T[K];
};
