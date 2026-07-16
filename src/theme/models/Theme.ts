// Full shape of the theme object.
export interface CoreUIXTheme {
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

    success: string;
    successForeground: string;

    warning: string;
    warningForeground: string;

    info: string;
    infoForeground: string;

    transparent: string;
  };

  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };

  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    tight: string;
  };

  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    inner: string;
  };

  zIndex: {
    dropdown: string;
    sticky: string;
    overlay: string;
    modal: string;
    popover: string;
    toast: string;
    tooltip: string;
  };

  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };

  border: {
    width: {
      none: string;
      thin: string;
      thick: string;
    };
    style: {
      solid: string;
      dashed: string;
      dotted: string;
      none: string;
    };
  };

  opacity: {
    none: string;
    disabled: string;
    hover: string;
    full: string;
  };

  transition: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      in: string;
      out: string;
      inOut: string;
    };
  };

  width: {
    full: string;
    screen: string;
    auto: string;
    fit: string;
    min: string;
    max: string;
  };

  height: {
    full: string;
    screen: string;
    auto: string;
    fit: string;
    min: string;
    max: string;
  };

  typography: {
    fontFamily: {
      body: string;
      heading: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    fontWeight: {
      medium: string;
      semibold: string;
    };
    letterSpacing: {
      normal: string;
      tight: string;
    };
    lineHeight: string;
    lineHeightTight: string;
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
    itemsCenter: string;
  };

  sidebar: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    ring: string;
  };
  text: {
    color: {
      primary: string;
      secondary: string;
      muted: string;
      disabled: string;
      link: string;
      danger: string;
      success: string;
      warning: string;
      inverse: string;
    };
    heading: {
      h1: { fontSize: string; fontWeight: string; lineHeight: string };
      h2: { fontSize: string; fontWeight: string; lineHeight: string };
      h3: { fontSize: string; fontWeight: string; lineHeight: string };
      h4: { fontSize: string; fontWeight: string; lineHeight: string };
    };
    body: {
      sm: { fontSize: string; fontWeight: string; lineHeight: string };
      md: { fontSize: string; fontWeight: string; lineHeight: string };
      lg: { fontSize: string; fontWeight: string; lineHeight: string };
    };
    caption: {
      sm: { fontSize: string; fontWeight: string; lineHeight: string };
      md: { fontSize: string; fontWeight: string; lineHeight: string };
    };
    label: {
      sm: { fontSize: string; fontWeight: string; lineHeight: string };
      md: { fontSize: string; fontWeight: string; lineHeight: string };
    };
    decoration: {
      underline: string;
      lineThrough: string;
      none: string;
    };
    transform: {
      uppercase: string;
      lowercase: string;
      capitalize: string;
      none: string;
    };
    overflow: {
      ellipsis: string;
      clip: string;
    };
    whiteSpace: {
      normal: string;
      nowrap: string;
      pre: string;
      preWrap: string;
    };
    align: {
      left: string;
      center: string;
      right: string;
      justify: string;
    };
  };
}
