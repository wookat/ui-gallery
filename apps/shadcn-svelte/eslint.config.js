import js from "@eslint/js"
import globals from "globals"
import svelte from "eslint-plugin-svelte"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist", ".svelte-kit"]),
  {
    files: ["**/*.{ts,svelte}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...svelte.configs["flat/recommended"],
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "svelte/no-at-html-tags": "off",
      "svelte/require-each-key": "off",
      "svelte/prefer-writable-derived": "off",
      "svelte/prefer-svelte-reactivity": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["**/*.svelte.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
])
