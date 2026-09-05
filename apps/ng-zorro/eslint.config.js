const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', '.angular/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['eslint.config.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
