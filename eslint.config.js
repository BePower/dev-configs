const { bePowerFactory } = require('@bepower/eslint-plugin');

module.exports = [
  ...bePowerFactory(),
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },
  {
    ignores: ['**/dist', 'packages/eslint-plugin/test/fixtures'],
  },
];
