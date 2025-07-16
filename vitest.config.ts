import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'json', 'json-summary', 'lcov', 'text', 'text-summary'],
      include: ['packages/*/src/**'],
      exclude: ['**/.autorc.js', '**/cli.ts'],
    },
  },
});
