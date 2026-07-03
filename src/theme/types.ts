export interface CoreUIXTheme {
  colors: {
    background: string
    foreground: string

    primary: string
    primaryForeground: string

    secondary: string
    secondaryForeground: string

    destructive: string

    border: string

    ring: string

    muted: string

    card: string
    cardForeground: string
  }

  radius: {
    sm: string
    md: string
    lg: string
  }
   typography: {
    fontFamily: "Inter"
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