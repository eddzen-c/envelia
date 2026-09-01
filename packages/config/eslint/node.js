// @ts-check

import { defineConfig } from 'eslint/config';
import globals from 'globals';

import baseConfig from './base.js';

const nodeModuleFiles = ['**/*.{js,mjs,ts,mts}'];
const commonJsFiles = ['**/*.{cjs,cts}'];

export default defineConfig([
  ...baseConfig,
  {
    name: '@envelia/config/node/modules',
    files: nodeModuleFiles,
    languageOptions: {
      globals: globals.nodeBuiltin,
    },
  },
  {
    name: '@envelia/config/node/commonjs',
    files: commonJsFiles,
    languageOptions: {
      globals: globals.node,
    },
  },
]);
