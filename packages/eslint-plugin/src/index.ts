import type { configs as Configs, rules as Rules } from '@typescript-eslint/eslint-plugin';

import * as configs from './configs';

const config: {
  configs: typeof Configs;
  rules: typeof Rules;
} = {
  configs,
  rules: {},
};

module.exports = config;
