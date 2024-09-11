import { Linter } from 'eslint';

// @ts-ignore
import shopifyEslintPlugin from '@shopify/eslint-plugin';

import bepowerBaseConfig from './base';

export default [
  ...shopifyEslintPlugin.configs.react,
  ...bepowerBaseConfig,
] satisfies Linter.FlatConfig[];
