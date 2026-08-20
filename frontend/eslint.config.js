// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        extends: [
            angular.configs.templateRecommended,
            angular.configs.templateAccessibility,
        ],
        rules: {},
    },
    {
        // src/app/@core/components/validation is a vendored copy of
        // @ngneat/error-tailor. Its selectors attach to Angular's own form
        // directives and its input alias is part of the library's public API,
        // so the house naming rules do not apply. Kept as-is to stay diffable
        // against upstream.
        files: ['src/app/@core/components/validation/**/*.ts'],
        rules: {
            '@angular-eslint/directive-selector': 'off',
            '@angular-eslint/component-selector': 'off',
            '@angular-eslint/no-input-rename': 'off',
            '@angular-eslint/prefer-inject': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: ['src/app/@core/components/validation/**/*.html'],
        rules: {
            '@angular-eslint/template/label-has-associated-control': 'off',
        },
    },
]);
