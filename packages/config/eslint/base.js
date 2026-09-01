// @ts-check

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const sourceFiles = ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'];

export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/storybook-static/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/blob-report/**',
    ],
  },
  {
    name: '@envelia/config/base/source-files',
    files: sourceFiles,
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      prettier,
    ],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
    },
  },
]);
