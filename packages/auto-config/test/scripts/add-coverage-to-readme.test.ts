import fs from 'fs';
import { delimiter, join } from 'path';

import Auto, { SEMVER } from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';

import AddCoverageToReadme, { CoverageSummary } from '../../src/scripts/add-coverage-to-readme';

const gitShow = jest.fn();
const getLernaPackages = jest.fn();

const coverageSummarySource: CoverageSummary = JSON.parse(
  fs.readFileSync(join(__dirname, 'fixtures', 'coverage-summary.json'), 'utf8'),
);
const coverageSummary: CoverageSummary = Object.fromEntries(
  Object.entries(coverageSummarySource).map(([key, value]) => [
    key.replace('/workspaces/dev-configs', process.cwd()).replace('///g', delimiter),
    value,
  ]),
);

getLernaPackages.mockReturnValue(Promise.resolve([]));

jest.mock(
  '@auto-it/core/dist/utils/exec-promise',
  () =>
    (...args: any[]) =>
      gitShow(...args),
);
jest.mock(
  '@auto-it/core/dist/utils/get-lerna-packages',
  () =>
    (...args: any[]) =>
      getLernaPackages(...args),
);

describe('Add coverage to Readme Plugin', () => {
  let mockRead: jest.SpyInstance;
  let mockWrite: jest.SpyInstance;

  const mockRootCoverage = jest.fn();

  beforeEach(() => {
    jest.mock<CoverageSummary>(
      join(process.cwd(), 'coverage', 'coverage-summary.json'),
      () => mockRootCoverage(),
      {
        virtual: true,
      },
    );

    mockRead = jest.spyOn(fs, 'readFileSync');
    mockWrite = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('default options', () => {
    test('should add nothing', async () => {
      const addCoverageToReadme = new AddCoverageToReadme();
      const autoHooks = makeHooks();

      const readme = [
        '# Title',
        '',
        '',
        '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
        '',
        '![coverage: 99%](https://img.shields.io/badge/coverage-99%25-green.svg)',
        '',
        '<!-- COVERAGE-BADGE:END -->',
      ].join('\n');

      mockRead.mockReturnValueOnce(readme);
      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(gitShow).toHaveBeenCalledTimes(1);
      expect(mockWrite).toHaveBeenCalledWith(join(process.cwd(), 'README.md'), readme);
    });

    test.each([
      [100, 100, 'brightgreen'],
      [105, 96, 'green'],
      [110, 93, 'yellowgreen'],
      [130, 82, 'yellow'],
      [140, 77, 'orange'],
      [210, 55, 'red'],
    ])('should only add the root - %d', async (total, perc, color) => {
      const addCoverageToReadme = new AddCoverageToReadme();
      const autoHooks = makeHooks();

      mockRead.mockReturnValueOnce(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      gitShow.mockReturnValueOnce('README.md');

      const coverageSummaryEdit: CoverageSummary = {
        [`${process.cwd()}${delimiter}index.ts`]: {
          branches: {
            covered: 0,
            pct: 100,
            skipped: 0,
            total: 0,
          },
          functions: {
            covered: 0,
            pct: 100,
            skipped: 0,
            total: 0,
          },
          lines: {
            covered: Math.round((total / 100) * perc),
            pct: perc,
            skipped: 0,
            total,
          },
          statements: {
            covered: 0,
            pct: 100,
            skipped: 0,
            total: 0,
          },
        },
      };
      mockRootCoverage.mockReturnValueOnce(coverageSummaryEdit);

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '',
          `![coverage: ${perc}%](https://img.shields.io/badge/coverage-${perc}%25-${color}.svg)`,
          '',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).toHaveBeenCalledWith('git', ['add', '**/README.md']);
      expect(gitShow).toHaveBeenCalledWith('git', [
        'commit',
        '--no-verify',
        '-m',
        '"ci: :memo: Update README.md to add coverage [skip ci]"',
      ]);
    });

    test('should add two packages', async () => {
      const addCoverageToReadme = new AddCoverageToReadme();
      const autoHooks = makeHooks();

      mockRead.mockReturnValueOnce(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      mockRead.mockReturnValueOnce(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      getLernaPackages.mockReturnValueOnce(
        Promise.resolve([
          {
            path: join(process.cwd(), 'packages/eslint-plugin'),
            name: '@bepower/eslint-plugin',
            version: '1.2.3',
          },
        ]),
      );

      gitShow.mockReturnValueOnce('README.md packages/eslint-plugin/README.md');

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '',
          '![coverage: 99%](https://img.shields.io/badge/coverage-99%25-green.svg)',
          '',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'packages', 'eslint-plugin', 'README.md'),
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '',
          '![coverage: 100%](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)',
          '',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).toHaveBeenCalledWith('git', ['add', '**/README.md']);
      expect(gitShow).toHaveBeenCalledWith('git', [
        'commit',
        '--no-verify',
        '-m',
        '"ci: :memo: Update README.md to add coverage [skip ci]"',
      ]);
    });
  });

  describe('custom options', () => {
    it('should allow custom badge template', async () => {
      const addCoverageToReadme = new AddCoverageToReadme({
        badgeTemplate: 'BADGE PERC {PERC} COLOR {COLOR}',
      });
      const autoHooks = makeHooks();

      mockRead.mockReturnValueOnce(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      gitShow.mockReturnValueOnce('README.md');

      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '',
          `BADGE PERC 99 COLOR green`,
          '',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).toHaveBeenCalledWith('git', ['add', '**/README.md']);
      expect(gitShow).toHaveBeenCalledWith('git', [
        'commit',
        '--no-verify',
        '-m',
        '"ci: :memo: Update README.md to add coverage [skip ci]"',
      ]);
    });

    it('should allow custom commit message', async () => {
      const addCoverageToReadme = new AddCoverageToReadme({
        commitMessage: 'upped coverage [skip ci]',
      });
      const autoHooks = makeHooks();

      mockRead.mockReturnValueOnce(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      gitShow.mockReturnValueOnce('README.md');

      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '',
          '![coverage: 99%](https://img.shields.io/badge/coverage-99%25-green.svg)',
          '',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).toHaveBeenCalledWith('git', ['add', '**/README.md']);
      expect(gitShow).toHaveBeenCalledWith('git', [
        'commit',
        '--no-verify',
        '-m',
        '"upped coverage [skip ci]"',
      ]);
    });

    it('should allow custom commit message appending [skip ci]', async () => {
      const addCoverageToReadme = new AddCoverageToReadme({
        commitMessage: 'upped coverage',
      });
      const autoHooks = makeHooks();

      mockRead.mockReturnValueOnce(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      gitShow.mockReturnValueOnce('README.md');

      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '',
          '![coverage: 99%](https://img.shields.io/badge/coverage-99%25-green.svg)',
          '',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).toHaveBeenCalledWith('git', ['add', '**/README.md']);
      expect(gitShow).toHaveBeenCalledWith('git', [
        'commit',
        '--no-verify',
        '-m',
        '"upped coverage [skip ci]"',
      ]);
    });
  });

  describe('missing tags', () => {
    test('should not do anything if the start tag is missing', async () => {
      const addCoverageToReadme = new AddCoverageToReadme();
      const autoHooks = makeHooks();

      const readme = [
        '# Title',
        '',
        '',
        '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
      ].join('\n');

      mockRead.mockReturnValueOnce(readme);
      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(gitShow).toHaveBeenCalledTimes(1);
      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).not.toHaveBeenCalledWith('git', ['add', '**/README.md']);
    });

    test('should not do anything if the end tag is missing', async () => {
      const addCoverageToReadme = new AddCoverageToReadme();
      const autoHooks = makeHooks();

      const readme = ['# Title', '', '', '<!-- COVERAGE-BADGE:END -->'].join('\n');

      mockRead.mockReturnValueOnce(readme);
      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(gitShow).toHaveBeenCalledTimes(1);
      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).not.toHaveBeenCalledWith('git', ['add', '**/README.md']);
    });

    test('should not do anything if both tags are missing', async () => {
      const addCoverageToReadme = new AddCoverageToReadme();
      const autoHooks = makeHooks();

      const readme = ['# Title', '', ''].join('\n');

      mockRead.mockReturnValueOnce(readme);
      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      addCoverageToReadme.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise({
        bump: SEMVER.patch,
        currentVersion: '0.0.0',
        lastRelease: '0.0.0',
        releaseNotes: '',
        commits: [],
      });

      expect(mockRootCoverage).toHaveBeenCalled();

      expect(gitShow).toHaveBeenCalledTimes(1);
      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).not.toHaveBeenCalledWith('git', ['add', '**/README.md']);
    });
  });
});
