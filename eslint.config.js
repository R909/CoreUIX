import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default defineConfig(
  {
    ignores: ["dist/**", "node_modules/**", "*.tsbuildinfo", "pnpm-lock.yaml"],
  },
  {
    settings: { react: { version: "detect" } },
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.flat.recommended.rules,
  },
  jsxA11y.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["eslint.config.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "react/prop-types": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ],
      "@typescript-eslint/typedef": [
        "error",
        {
          variableDeclaration: true,
          memberVariableDeclaration: true,
          propertyDeclaration: true,
          arrayDestructuring: true,
          objectDestructuring: true,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./*", "../*"],
              message:
                "Import through the project's category-scoped aliases (@components/*, @theme/*, @utils/*, @hooks/*) instead of a relative path.",
            },
            {
              group: ["@/*"],
              message:
                "The @/* catch-all alias isn't used by convention here — use the category-scoped alias that matches where the target file lives (@components/*, @theme/*, @utils/*, @hooks/*).",
            },
          ],
        },
      ],
    },
  },
);
