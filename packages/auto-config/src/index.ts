import { ConventionalCommitsOptions } from '@auto-it/conventional-commits';
import { AutoRc } from 'auto';

export * from './scripts/add-coverage-to-readme';
export * from './scripts/add-packages-to-readme';

export const coverage = require.resolve('./scripts/add-coverage-to-readme');
export const packages = require.resolve('./scripts/add-packages-to-readme');

const conventionalCommitsOptions: ConventionalCommitsOptions = {
  preset: 'angular',
};

const config: AutoRc = {
  shipit: {
    message: 'ci: :memo: Update CHANGELOG.md [skip ci]',
  },
  plugins: [
    'magic-zero',
    'npm',
    ['conventional-commits', conventionalCommitsOptions],
    'all-contributors',
    'first-time-contributor',
  ],
};

export default config;
