import { Linter } from 'eslint';

// @ts-ignore
import shopifyEslintPlugin from '@shopify/eslint-plugin';

import bepowerBaseConfig from './base';

export default [
  ...shopifyEslintPlugin.configs.node,
  ...bepowerBaseConfig,
] satisfies Linter.FlatConfig[];
