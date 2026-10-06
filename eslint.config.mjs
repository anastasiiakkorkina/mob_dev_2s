import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "public/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["app.ts", "modules/**/*.ts", "react/**/*.tsx", "vite.config.mts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-console": "warn",
    },
  },
  prettier,
];
