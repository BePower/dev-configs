import { Linter } from 'eslint';
// @@ts-expect-error
import shopifyEslintPlugin from '@shopify/eslint-plugin';

export default [
  ...shopifyEslintPlugin.configs.typescript,
  ...shopifyEslintPlugin.configs['typescript-type-checking'],
  ...shopifyEslintPlugin.configs.prettier,
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },
] satisfies Linter.FlatConfig[];
