import { Linter } from 'eslint';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shopifyEslintPlugin from '@shopify/eslint-plugin';

export function bePowerFactory({
  cdk = false,
  node = true,
  typescript = true,
  react = false,
}: {
  cdk?: boolean;
  node?: boolean;
  typescript?: boolean;
  react?: boolean;
} = {}, addIgnores = true): Linter.FlatConfig[] {
  const config: Linter.FlatConfig[] = [
    ...shopifyEslintPlugin.configs.prettier,
    {
      rules: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'prettier/prettier': 'warn',
      },
    },
  ];

  if (node) {
    config.push(
      ...shopifyEslintPlugin.configs.node,
    );
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
    config.push(
      ...shopifyEslintPlugin.configs.react,
    );
  }

  if (addIgnores) {
    config.push({
      ignores: ['coverage', 'dist', 'package-lock.json'],
    });
  }

  return config;
}
