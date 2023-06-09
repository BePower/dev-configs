import type { configs } from '@typescript-eslint/eslint-plugin';

export const base: (typeof configs)[string] = {
  plugins: ['@bepower'],
};
