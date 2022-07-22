import { configs } from '@typescript-eslint/eslint-plugin';

const config: typeof configs[string] = {
  extends: [
    'plugin:@bepower/base',
    'plugin:@shopify/typescript',
    'plugin:@shopify/typescript-type-checking',
    'plugin:@shopify/prettier',
    'plugin:@shopify/node',
  ],
  rules: {
    'prettier/prettier': 'warn',
  },
}

export = config;
