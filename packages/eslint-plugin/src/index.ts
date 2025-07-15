/* eslint-disable @typescript-eslint/naming-convention */
import { Linter } from 'eslint';
import antfu from '@antfu/eslint-config';

export function bePowerFactory(
  {
    cdk = false,
    node = true,
    typescript = true,
    react = false,
  }: {
    cdk?: boolean;
    node?: boolean;
    typescript?: boolean;
    react?: boolean;
  } = {},
  addIgnores = true,
): Linter.FlatConfig[] {
  const baseConfig = antfu({
    stylistic: {
      semi: true,
      overrides: {
        'style/brace-style': ['error', '1tbs'],
        'no-console': 'off',
      },
    },
    typescript: typescript
      ? {
          tsconfigPath: './tsconfig.json',
        }
      : false,
    react: react ? true : false,
    node: node ? true : false,
  });

  // Add custom rules for CDK if needed
  if (cdk) {
    baseConfig.push({
      rules: {
        'no-new': 'off',
      },
    });

    if (addIgnores) {
      baseConfig.push({
        ignores: ['cdk.out'],
      });
    }
  }

  // Add common ignores
  if (addIgnores) {
    baseConfig.push({
      ignores: ['coverage', 'dist', 'package-lock.json'],
    });
  }

  // Add additional rules
  baseConfig.push({
    rules: {
      'no-process-env': 'off',
    },
  });

  return baseConfig;
}
