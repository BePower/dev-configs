/* eslint-disable @typescript-eslint/naming-convention */
import { Linter } from 'eslint';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shopifyEslintPlugin from '@shopify/eslint-plugin';

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
  const config: Linter.FlatConfig[] = [];

  if (node) {
    config.push(...shopifyEslintPlugin.configs.node);
  }

  if (typescript) {
    config.push(
      ...shopifyEslintPlugin.configs.typescript,
      ...shopifyEslintPlugin.configs['typescript-type-checking'],
      {
        languageOptions: {
          parserOptions: {
            project: './tsconfig.json',
          },
        },
      },
    );
  }

  if (cdk) {
    config.push({
      rules: {
        'no-new': 'off',
      },
    });

    if (addIgnores) {
      config.push({
        ignores: ['cdk.out'],
      });
    }
  }

  if (react) {
    config.push(...shopifyEslintPlugin.configs.react);
  }

  if (addIgnores) {
    config.push({
      ignores: ['coverage', 'dist', 'package-lock.json'],
    });
  }

  config.push(...shopifyEslintPlugin.configs.prettier, {
    rules: {
      'prettier/prettier': 'warn',
      'no-console': 'off',
    },
  });

  return config;
}
