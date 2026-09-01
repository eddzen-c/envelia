// @ts-check

import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import baseConfig from './base.js';

const reactFiles = ['**/*.{js,jsx,mjs,ts,tsx,mts}'];

export default defineConfig([
  ...baseConfig,
  {
    name: '@envelia/config/react',
    files: reactFiles,
    extends: [reactHooks.configs.flat['recommended-latest']],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
