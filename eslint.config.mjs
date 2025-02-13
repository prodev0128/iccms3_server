import jsPlugin from '@eslint/js';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import sortPlugin from 'eslint-plugin-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Configuration for NestJS monorepo
 */
export default tseslint.config(
  jsPlugin.configs.recommended,
  tseslint.configs.recommended,
  prettierPluginRecommended,
  sortPlugin.configs['flat/recommended'],
  {
    files: ['{apps,libs,scrips}/**/*.ts', 'eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': 'error',
      'sort/imports': [
        'error',
        {
          groups: [
            { order: 10, type: 'side-effect' },
            { order: 20, type: 'dependency' },
            { order: 25, regex: '^[^\\.]' },
            { order: 30, type: 'other' },
            { order: 40, regex: '\\.(png|jpg|svg)$' },
          ],
          separator: '\n',
        },
      ],
    },
  },
);
