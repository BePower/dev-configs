import { configs } from '@typescript-eslint/eslint-plugin';

const config: typeof configs[string] = {
  plugins: ['@bepower'],
};

export = config;
