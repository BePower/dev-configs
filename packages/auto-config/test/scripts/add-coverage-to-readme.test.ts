import fs from 'fs';
import { join } from 'path';

import Auto, { SEMVER } from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';

import AddCoverageToReadme, { CoverageSummary } from '../../src/scripts/add-coverage-to-readme';

const existsMock = jest.fn();
const writeMock = jest.fn();
const gitShow = jest.fn();
const getLernaPackages = jest.fn();

const coverageSummary: CoverageSummary = {
  total: {
    lines: {
      total: 100,
      covered: 100,
      skipped: 0,
      pct: 100,
    },
    statements: {
      total: 27,
      covered: 27,
      skipped: 0,
      pct: 100,
    },
    functions: {
      total: 4,
      covered: 4,
      skipped: 0,
      pct: 100,
    },
    branches: {
      total: 2,
      covered: 2,
      skipped: 0,
      pct: 100,
    },
  },
};
const mockRootCoverage = jest.fn();
const mockPackageCoverage = jest.fn();

getLernaPackages.mockReturnValue(Promise.resolve([]));

const mockRead = (result: string) => jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(result);
jest.spyOn(fs, 'existsSync').mockImplementation(existsMock);
jest.spyOn(fs, 'writeFileSync').mockImplementation(writeMock);
jest.spyOn(fs, 'readdirSync').mockImplementation(() => []);

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
  beforeEach(() => {
    jest.mock(join(process.cwd(), 'coverage', 'coverage-summary.json'), () => mockRootCoverage(), {
      virtual: true,
    });
    jest.mock(
      join(process.cwd(), 'packages', 'app', 'coverage', 'coverage-summary.json'),
      () => mockPackageCoverage(),
      { virtual: true },
    );

    const coverageSummary2: CoverageSummary = JSON.parse(JSON.stringify(coverageSummary));
    coverageSummary2.total.lines.total = 120;
    mockPackageCoverage.mockReturnValueOnce(coverageSummary2);
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
        '![coverage: 100%](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)',
        '',
        '<!-- COVERAGE-BADGE:END -->',
      ].join('\n');

      mockRead(readme);
      existsMock.mockReturnValueOnce(true);
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

      expect(existsMock).toHaveBeenCalledTimes(1);
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).not.toHaveBeenCalled();

      expect(gitShow).toHaveBeenCalledTimes(1);
      expect(writeMock).toHaveBeenCalledWith(join(process.cwd(), 'README.md'), readme);
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

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      existsMock.mockReturnValueOnce(true);
      gitShow.mockReturnValueOnce('README.md');

      const coverageSummary2: CoverageSummary = JSON.parse(JSON.stringify(coverageSummary));
      coverageSummary2.total.lines.total = total;
      mockRootCoverage.mockClear().mockReturnValueOnce(coverageSummary2);

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

      expect(existsMock).toHaveBeenCalledWith(
        join(process.cwd(), 'coverage', 'coverage-summary.json'),
      );
      expect(existsMock).not.toHaveBeenCalledWith(
        join(process.cwd(), 'packages', 'app', 'coverage', 'coverage-summary.json'),
      );
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).not.toHaveBeenCalled();

      expect(writeMock).toHaveBeenCalledWith(
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

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      existsMock.mockReturnValueOnce(true);
      existsMock.mockReturnValueOnce(true);
      mockRootCoverage.mockReturnValueOnce(coverageSummary);

      getLernaPackages.mockReturnValueOnce(
        Promise.resolve([
          {
            path: join(process.cwd(), 'packages/app'),
            name: '@bepower/app',
            version: '1.2.3',
          },
        ]),
      );

      gitShow.mockReturnValueOnce('README.md packages/app/README.md');

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

      expect(existsMock).toHaveBeenCalledWith(
        join(process.cwd(), 'coverage', 'coverage-summary.json'),
      );
      expect(existsMock).toHaveBeenCalledWith(
        join(process.cwd(), 'packages', 'app', 'coverage', 'coverage-summary.json'),
      );
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).toHaveBeenCalled();

      expect(writeMock).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
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
      expect(writeMock).toHaveBeenCalledWith(
        join(process.cwd(), 'packages', 'app', 'README.md'),
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '',
          '![coverage: 87%](https://img.shields.io/badge/coverage-87%25-yellow.svg)',
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

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      existsMock.mockReturnValueOnce(true);
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

      expect(existsMock).toHaveBeenCalledWith(
        join(process.cwd(), 'coverage', 'coverage-summary.json'),
      );
      expect(existsMock).not.toHaveBeenCalledWith(
        join(process.cwd(), 'packages', 'app', 'coverage', 'coverage-summary.json'),
      );
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).not.toHaveBeenCalled();

      expect(writeMock).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '',
          `BADGE PERC 100 COLOR brightgreen`,
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

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      existsMock.mockReturnValueOnce(true);
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

      expect(existsMock).toHaveBeenCalledWith(
        join(process.cwd(), 'coverage', 'coverage-summary.json'),
      );
      expect(existsMock).not.toHaveBeenCalledWith(
        join(process.cwd(), 'packages', 'app', 'coverage', 'coverage-summary.json'),
      );
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).not.toHaveBeenCalled();

      expect(writeMock).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
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
        '"upped coverage [skip ci]"',
      ]);
    });

    it('should allow custom commit message appending [skip ci]', async () => {
      const addCoverageToReadme = new AddCoverageToReadme({
        commitMessage: 'upped coverage',
      });
      const autoHooks = makeHooks();

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->',
          '<!-- COVERAGE-BADGE:END -->',
        ].join('\n'),
      );
      existsMock.mockReturnValueOnce(true);
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

      expect(existsMock).toHaveBeenCalledWith(
        join(process.cwd(), 'coverage', 'coverage-summary.json'),
      );
      expect(existsMock).not.toHaveBeenCalledWith(
        join(process.cwd(), 'packages', 'app', 'coverage', 'coverage-summary.json'),
      );
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).not.toHaveBeenCalled();

      expect(writeMock).toHaveBeenCalledWith(
        join(process.cwd(), 'README.md'),
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

      mockRead(readme);
      existsMock.mockReturnValueOnce(true);
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

      expect(existsMock).toHaveBeenCalledTimes(1);
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).not.toHaveBeenCalled();

      expect(gitShow).toHaveBeenCalledTimes(1);
      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).not.toHaveBeenCalledWith('git', ['add', '**/README.md']);
    });

    test('should not do anything if the end tag is missing', async () => {
      const addCoverageToReadme = new AddCoverageToReadme();
      const autoHooks = makeHooks();

      const readme = ['# Title', '', '', '<!-- COVERAGE-BADGE:END -->'].join('\n');

      mockRead(readme);
      existsMock.mockReturnValueOnce(true);
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

      expect(existsMock).toHaveBeenCalledTimes(1);
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).not.toHaveBeenCalled();

      expect(gitShow).toHaveBeenCalledTimes(1);
      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).not.toHaveBeenCalledWith('git', ['add', '**/README.md']);
    });

    test('should not do anything if both tags are missing', async () => {
      const addCoverageToReadme = new AddCoverageToReadme();
      const autoHooks = makeHooks();

      const readme = ['# Title', '', ''].join('\n');

      mockRead(readme);
      existsMock.mockReturnValueOnce(true);
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

      expect(existsMock).toHaveBeenCalledTimes(1);
      expect(mockRootCoverage).toHaveBeenCalled();
      expect(mockPackageCoverage).not.toHaveBeenCalled();

      expect(gitShow).toHaveBeenCalledTimes(1);
      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(gitShow).not.toHaveBeenCalledWith('git', ['add', '**/README.md']);
    });
  });
});
