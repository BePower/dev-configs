import { configs } from '@typescript-eslint/eslint-plugin';

export const cdk: typeof configs[string] = {
  extends: [
    'plugin:@bepower/node',
  ],
  rules: {
    'no-new': 'off',
  },
};
