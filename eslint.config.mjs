import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['public/js/**/*.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      curly: 'off',
    },
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.node,
        ...globals.browser,
        avatarSVG: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-console': 'off',
      eqeqeq: ['warn', 'always'],
      curly: 'warn',
      'no-undef': 'error',
      semi: ['warn', 'always'],
      quotes: ['warn', 'single', { avoidEscape: true }],
    },
  },
  {
    ignores: ['node_modules/', 'stitch_*/', 'scrumban_app.html'],
  },
];
