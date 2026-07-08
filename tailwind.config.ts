import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Omit<Config, "content"> & { content: Config["content"] } = {
  // Tailwind ignores `content` when a config is consumed as a preset, so
  // this has no effect on consuming apps — they must declare their own
  // `content` array. Kept here only for ESLint's tailwindcss plugin, which
  // needs a resolvable config when linting this repo's own source files.
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
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
      },
      borderRadius: {
        lg: "var(--cuix-radius-lg)",
        md: "var(--cuix-radius-md)",
        sm: "var(--cuix-radius-sm)",
      },
      spacing: {
        xs: "var(--cuix-spacing-xs)",
        sm: "var(--cuix-spacing-sm)",
        md: "var(--cuix-spacing-md)",
        lg: "var(--cuix-spacing-lg)",
      },
      boxShadow: {
        sm: "var(--cuix-shadow-sm)",
        md: "var(--cuix-shadow-md)",
        lg: "var(--cuix-shadow-lg)",
      },
      fontSize: {
        sm: "var(--cuix-font-size-sm)",
        md: "var(--cuix-font-size-md)",
        lg: "var(--cuix-font-size-lg)",
      },
      fontFamily: {
        body: "var(--cuix-font-family-body)",
        heading: "var(--cuix-font-family-heading)",
      },
      zIndex: {
        modal: "var(--cuix-z-index-modal)",
        tooltip: "var(--cuix-z-index-tooltip)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
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
