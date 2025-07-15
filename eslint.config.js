import { bePowerFactory } from '@bepower/eslint-plugin';

export default [
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
