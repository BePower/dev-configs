import { ESLint } from 'eslint';

import * as configs from './configs';

const config: ESLint.Plugin = {
  configs,
  rules: {},
};

module.exports = config;
