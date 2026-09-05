const angular = require('angular-eslint');

module.exports = [
  {
    ignores: ['dist/**', '.angular/**', 'node_modules/**'],
  },
  {
    files: ['**/*.ts'],
    processor: angular.processInlineTemplates,
    ...angular.configs.tsRecommended[0],
  },
  {
    files: ['**/*.html'],
    ...angular.configs.templateRecommended[0],
  },
  {
    files: ['**/*.html'],
    ...angular.configs.templateAccessibility[0],
  },
];
