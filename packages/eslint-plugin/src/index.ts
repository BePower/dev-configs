import { configs, rules } from '@typescript-eslint/eslint-plugin';

import base from './configs/base';
import node from './configs/node';

const config: {
  configs: typeof configs;
  rules: typeof rules;
} = {
  configs: {
    base,
    node,
  },

  rules: {},
}

export = config;
