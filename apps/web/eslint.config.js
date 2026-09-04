import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';

import reactConfig from '@envelia/config/eslint/react';

const sourceFiles = ['**/*.{js,jsx,mjs,ts,tsx,mts}'];
const nextCoreWebVitals = nextPlugin.configs['core-web-vitals'];

export default defineConfig([
  ...reactConfig,
  {
    ...nextCoreWebVitals,
    name: '@envelia/web/next/core-web-vitals',
    files: sourceFiles,
    rules: {
      ...nextCoreWebVitals.rules,

      // Envelia utiliza exclusivamente App Router mediante src/app.
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
]);
