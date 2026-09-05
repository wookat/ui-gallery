import js from "@eslint/js"
import globals from "globals"
import svelte from "eslint-plugin-svelte"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"
import svelteConfig from "./svelte.config.js"

export default defineConfig([
  globalIgnores(["dist"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser, svelteConfig },
    },
    rules: {
      "svelte/no-navigation-without-resolve": "off",
    },
  },
])
