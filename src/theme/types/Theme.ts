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

  radius: {
    sm: string
    md: string
    lg: string
  }

  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
  }

  shadow: {
    sm: string
    md: string
    lg: string
  }

  zIndex: {
    modal: string
    tooltip: string
  }

  breakpoints: {
    sm: string
    md: string
  }

  typography: {
    fontFamily: {
      body: string
      heading: string
    }
    fontSize: {
      sm: string
      md: string
      lg: string
    }
    lineHeight: string
  }
}
