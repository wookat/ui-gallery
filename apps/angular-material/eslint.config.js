const tseslint = require('typescript-eslint');
const templateParser = require('@angular-eslint/template-parser');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tseslint.parser },
    rules: {},
  },
  {
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    rules: {},
  },
);
