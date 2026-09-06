// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  { ignores: ['dist/**', '.angular/**', 'node_modules/**'] },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/label-has-associated-control': [
        'error',
        {
          controlComponents: [
            'p-select', 'p-multiselect', 'p-autocomplete', 'p-cascadeselect', 'p-treeselect', 'p-checkbox', 'p-radiobutton', 'p-toggleswitch',
            'p-inputnumber', 'p-datepicker', 'p-password', 'p-slider', 'p-rating', 'p-colorpicker', 'p-fileupload', 'p-selectbutton', 'p-inputotp', 'p-inputmask', 'p-textarea',
          ],
        },
      ],
    },
  },
);
