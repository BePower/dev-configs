import { ConventionalCommitsOptions } from '@auto-it/conventional-commits';
import { AutoRc } from 'auto';

const conventionalCommitsOptions: ConventionalCommitsOptions = {
  preset: 'angular',
};

export default (): AutoRc => ({
  plugins: [
    'npm',
    'all-contributors',
    ['conventional-commits', conventionalCommitsOptions],
    'first-time-contributor',
  ],
});
