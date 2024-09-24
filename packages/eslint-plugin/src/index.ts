import { Linter } from 'eslint';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shopifyEslintPlugin from '@shopify/eslint-plugin';

export default function({
  node = true,
  typescript = true,
  react = false,
}: {
  node?: boolean,
  typescript?: boolean,
  react?: boolean,
} = {}): Linter.FlatConfig[] {
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
    );
  }

  if (react) {
    config.push(
      ...shopifyEslintPlugin.configs.react,
    );
  }

  return config;
}
