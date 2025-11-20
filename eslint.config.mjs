// @ts-check

import eslintPluginJs from '@eslint/js';
import eslintPluginNext from '@next/eslint-plugin-next';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import _eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import eslintPluginTs from 'typescript-eslint';

const HEADER = 'my-rules';

const eslintPluginUnusedImports = {
  configs: {
    /** @type {import("eslint/config").Config} */
    recommended: {
      name: 'eslint-plugin-unused-imports',
      plugins: { 'unused-imports': _eslintPluginUnusedImports },
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
      },
    },
  },
};

export default defineConfig(
  globalIgnores(
    [
      '**/node_modules/',
      '.git/',
      '.next/',
      'out/',
      'dist/',
      'build/',
      'next-env.d.ts',
      '.husky/',
    ],
    `${HEADER}/ignores`,
  ),
  {
    name: `${HEADER}/setup`,
    settings: { react: { version: 'detect' } },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
    languageOptions: {
      parserOptions: {
        project: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  eslintPluginJs.configs.recommended,
  eslintPluginTs.configs.recommended,
  eslintPluginTs.configs.stylistic,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  eslintPluginReactHooks.configs.flat.recommended,
  eslintPluginUnusedImports.configs.recommended,
  eslintPluginNext.configs['core-web-vitals'],
  eslintPluginNext.configs['recommended'],
  {
    name: `${HEADER}`,
    rules: {
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-underscore-dangle': 0,
      'no-console': ['warn', { allow: ['error'] }],
      'import/prefer-default-export': 'off',
      'react/function-component-definition': 'off',
      'react/require-default-props': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  eslintPluginPrettier,
);
