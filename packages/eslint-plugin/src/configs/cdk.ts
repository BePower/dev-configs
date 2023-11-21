/* eslint-disable @typescript-eslint/naming-convention */
import { ESLint } from 'eslint';

export const cdk: ESLint.ConfigData = {
  extends: ['plugin:@bepower/node'],
  rules: {
    'no-new': 'off',
  },
};
