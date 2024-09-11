import { ESLint } from 'eslint';

import cdk from './configs/cdk';
import node from './configs/node';
import react from './configs/react';

const config: ESLint.Plugin = {
  configs: { cdk, node, react },
  rules: {},
};

module.exports = config;
