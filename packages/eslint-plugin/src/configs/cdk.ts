import { Linter } from 'eslint';

import bepowerNodeConfig from './node';

export default [
  ...bepowerNodeConfig,
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },
] satisfies Linter.FlatConfig[];
