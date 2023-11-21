/* eslint-disable @typescript-eslint/naming-convention */
import { ESLint } from 'eslint';

export const node: ESLint.ConfigData = {
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
};
