import { ConventionalCommitsOptions } from '@auto-it/conventional-commits';
import { AutoRc } from 'auto';

const conventionalCommitsOptions: ConventionalCommitsOptions = {
  preset: 'angular',
};

const config = (): AutoRc => ({
  plugins: [
    'npm',
    'all-contributors',
    ['conventional-commits', conventionalCommitsOptions],
    'first-time-contributor',
  ],
});

export default config;
