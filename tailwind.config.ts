import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// This file is published so consuming apps can extend it as a preset:
//
//   // tailwind.config.ts in a consuming app
//   import uiPreset from "@coreuix/ui/tailwind.config";
//   export default {
//     presets: [uiPreset],
//     content: [
//       "./app/**/*.{ts,tsx}",
//       "./node_modules/@coreuix/ui/dist/**/*.{js,mjs}",
//     ],
//   } satisfies Config;

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
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },

        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },

        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },

        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },

        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
