import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Omit<Config, "content"> & { content: Config["content"] } = {
  // Tailwind ignores `content` when a config is consumed as a preset, so
  // this has no effect on consuming apps — they must declare their own
  // `content` array. Kept here only for ESLint's tailwindcss plugin, which
  // needs a resolvable config when linting this repo's own source files.
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class", "class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--cuix-colors-border)",
        input: "var(--cuix-colors-input)",
        ring: "var(--cuix-colors-ring)",
        background: "var(--cuix-colors-background)",
        foreground: "var(--cuix-colors-foreground)",
        primary: {
          DEFAULT: "var(--cuix-colors-primary)",
          foreground: "var(--cuix-colors-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--cuix-colors-secondary)",
          foreground: "var(--cuix-colors-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--cuix-colors-destructive)",
          foreground: "var(--cuix-colors-destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--cuix-colors-success)",
          foreground: "var(--cuix-colors-success-foreground)",
        },
        warning: {
          DEFAULT: "var(--cuix-colors-warning)",
          foreground: "var(--cuix-colors-warning-foreground)",
        },
        info: {
          DEFAULT: "var(--cuix-colors-info)",
          foreground: "var(--cuix-colors-info-foreground)",
        },
        muted: {
          DEFAULT: "var(--cuix-colors-muted)",
          foreground: "var(--cuix-colors-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--cuix-colors-accent)",
          foreground: "var(--cuix-colors-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--cuix-colors-popover)",
          foreground: "var(--cuix-colors-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--cuix-colors-card)",
          foreground: "var(--cuix-colors-card-foreground)",
        },
        transparent: "var(--cuix-colors-transparent)",
        sidebar: {
          DEFAULT: "var(--cuix-sidebar-background)",
          foreground: "var(--cuix-sidebar-foreground)",
          primary: "var(--cuix-sidebar-primary)",
          "primary-foreground": "var(--cuix-sidebar-primary-foreground)",
          accent: "var(--cuix-sidebar-accent)",
          "accent-foreground": "var(--cuix-sidebar-accent-foreground)",
          border: "var(--cuix-sidebar-border)",
          ring: "var(--cuix-sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--cuix-radius-lg)",
        md: "var(--cuix-radius-md)",
        sm: "var(--cuix-radius-sm)",
        xl: "var(--cuix-radius-xl)",
        full: "var(--cuix-radius-full)",
      },
      spacing: {
        xs: "var(--cuix-spacing-xs)",
        sm: "var(--cuix-spacing-sm)",
        md: "var(--cuix-spacing-md)",
        lg: "var(--cuix-spacing-lg)",
        xl: "var(--cuix-spacing-xl)",
        "2xl": "var(--cuix-spacing-2xl)",
        tight: "var(--cuix-spacing-tight)",
      },
      boxShadow: {
        none: "var(--cuix-shadow-none)",
        sm: "var(--cuix-shadow-sm)",
        md: "var(--cuix-shadow-md)",
        lg: "var(--cuix-shadow-lg)",
        inner: "var(--cuix-shadow-inner)",
      },
      borderWidth: {
        none: "var(--cuix-border-width-none)",
        thin: "var(--cuix-border-width-thin)",
        thick: "var(--cuix-border-width-thick)",
      },
      opacity: {
        none: "var(--cuix-opacity-none)",
        disabled: "var(--cuix-opacity-disabled)",
        hover: "var(--cuix-opacity-hover)",
        full: "var(--cuix-opacity-full)",
      },
      transitionDuration: {
        fast: "var(--cuix-transition-duration-fast)",
        normal: "var(--cuix-transition-duration-normal)",
        slow: "var(--cuix-transition-duration-slow)",
      },
      transitionTimingFunction: {
        linear: "var(--cuix-transition-easing-linear)",
        in: "var(--cuix-transition-easing-in)",
        out: "var(--cuix-transition-easing-out)",
        "in-out": "var(--cuix-transition-easing-in-out)",
      },
      fontSize: {
        xs: "var(--cuix-font-size-xs)",
        sm: "var(--cuix-font-size-sm)",
        md: "var(--cuix-font-size-md)",
        lg: "var(--cuix-font-size-lg)",
        h1: [
          "var(--cuix-text-heading-h1-font-size)",
          {
            lineHeight: "var(--cuix-text-heading-h1-line-height)",
            fontWeight: "var(--cuix-text-heading-h1-font-weight)",
          },
        ],
        h2: [
          "var(--cuix-text-heading-h2-font-size)",
          {
            lineHeight: "var(--cuix-text-heading-h2-line-height)",
            fontWeight: "var(--cuix-text-heading-h2-font-weight)",
          },
        ],
        h3: [
          "var(--cuix-text-heading-h3-font-size)",
          {
            lineHeight: "var(--cuix-text-heading-h3-line-height)",
            fontWeight: "var(--cuix-text-heading-h3-font-weight)",
          },
        ],
        h4: [
          "var(--cuix-text-heading-h4-font-size)",
          {
            lineHeight: "var(--cuix-text-heading-h4-line-height)",
            fontWeight: "var(--cuix-text-heading-h4-font-weight)",
          },
        ],
        "body-sm": [
          "var(--cuix-text-body-sm-font-size)",
          {
            lineHeight: "var(--cuix-text-body-sm-line-height)",
            fontWeight: "var(--cuix-text-body-sm-font-weight)",
          },
        ],
        body: [
          "var(--cuix-text-body-md-font-size)",
          {
            lineHeight: "var(--cuix-text-body-md-line-height)",
            fontWeight: "var(--cuix-text-body-md-font-weight)",
          },
        ],
        "body-lg": [
          "var(--cuix-text-body-lg-font-size)",
          {
            lineHeight: "var(--cuix-text-body-lg-line-height)",
            fontWeight: "var(--cuix-text-body-lg-font-weight)",
          },
        ],
        "caption-sm": [
          "var(--cuix-text-caption-sm-font-size)",
          {
            lineHeight: "var(--cuix-text-caption-sm-line-height)",
            fontWeight: "var(--cuix-text-caption-sm-font-weight)",
          },
        ],
        caption: [
          "var(--cuix-text-caption-md-font-size)",
          {
            lineHeight: "var(--cuix-text-caption-md-line-height)",
            fontWeight: "var(--cuix-text-caption-md-font-weight)",
          },
        ],
        "label-sm": [
          "var(--cuix-text-label-sm-font-size)",
          {
            lineHeight: "var(--cuix-text-label-sm-line-height)",
            fontWeight: "var(--cuix-text-label-sm-font-weight)",
          },
        ],
        label: [
          "var(--cuix-text-label-md-font-size)",
          {
            lineHeight: "var(--cuix-text-label-md-line-height)",
            fontWeight: "var(--cuix-text-label-md-font-weight)",
          },
        ],
      },
      fontFamily: {
        body: "var(--cuix-font-family-body)",
        heading: "var(--cuix-font-family-heading)",
      },
      fontWeight: {
        medium: "var(--cuix-font-weight-medium)",
        semibold: "var(--cuix-font-weight-semibold)",
      },
      letterSpacing: {
        normal: "var(--cuix-letter-spacing-normal)",
        tight: "var(--cuix-letter-spacing-tight)",
      },
      lineHeight: {
        normal: "var(--cuix-line-height)",
        tight: "var(--cuix-line-height-tight)",
      },
      // Mirrors breakpointsTokens.ts's default values. Kept as literals (not
      // var(--cuix-breakpoint-*)) because @media queries can't read CSS custom
      // properties — update both places by hand if the token values change.
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      zIndex: {
        dropdown: "var(--cuix-z-index-dropdown)",
        sticky: "var(--cuix-z-index-sticky)",
        overlay: "var(--cuix-z-index-overlay)",
        modal: "var(--cuix-z-index-modal)",
        popover: "var(--cuix-z-index-popover)",
        toast: "var(--cuix-z-index-toast)",
        tooltip: "var(--cuix-z-index-tooltip)",
      },
      width: {
        full: "var(--cuix-width-full)",
        screen: "var(--cuix-width-screen)",
        auto: "var(--cuix-width-auto)",
        fit: "var(--cuix-width-fit)",
        min: "var(--cuix-width-min)",
        max: "var(--cuix-width-max)",
      },
      height: {
        full: "var(--cuix-height-full)",
        screen: "var(--cuix-height-screen)",
        auto: "var(--cuix-height-auto)",
        fit: "var(--cuix-height-fit)",
        min: "var(--cuix-height-min)",
        max: "var(--cuix-height-max)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
