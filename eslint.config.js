const bepowerEslintPlugin = require('@bepower/eslint-plugin');

module.exports = [
  ...bepowerEslintPlugin.configs.node,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },
  {
    ignores: ['coverage', '**/dist', 'packages/eslint-plugin/test/fixtures'],
  },
];
