import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { Auto, IPlugin, LernaPackage, execPromise, getLernaPackages } from '@auto-it/core';

export type CoverageSummary = {
  [key in 'total' | string]: {
    [what in 'lines' | 'statements' | 'functions' | 'branches']: {
      total: number;
      covered: number;
      skipped: number;
      pct: number;
    };
  };
};

interface AddCoverageToReadmePluginOptions {
  badgeTemplate?: string;
  commitMessage?: string;
}

export default class AddCoverageToReadmePlugin implements IPlugin {
  static readonly START_TAG = "[//]: # 'BEGIN COVERAGE BADGE'";
  static readonly END_TAG = "[//]: # 'END COVERAGE BADGE'";

  name = 'add-coverage-to-readme';
  private readonly badgeTemplate: string;
  private readonly commitMessage: string;

  constructor(options?: AddCoverageToReadmePluginOptions) {
    this.badgeTemplate =
      options?.badgeTemplate ??
      `![coverage: {PERC}%](https://img.shields.io/badge/coverage-{PERC}%25-{COLOR}.svg)`;
    this.commitMessage =
      options?.commitMessage ?? 'ci: :memo: Update README.md to add coverage [skip ci]';
    if (!this.commitMessage.includes('[skip ci]')) {
      this.commitMessage = `${this.commitMessage} [skip ci]`;
    }
  }

  apply(auto: Auto): void {
    auto.hooks.afterChangelog.tapPromise(this.name, async () => {
      const packages: LernaPackage[] = [
        { name: 'root', path: process.cwd(), version: '0.0.0' },
        ...(await getLernaPackages()),
      ];

      auto.logger.verbose.info('Found packages:', packages);

      const coverageFolderName = 'coverage';
      const coverageJsonName = 'coverage-summary.json';
      const readmeFileName = 'README.md';

      const filteredPackages = packages.filter(({ path }) =>
        existsSync(join(path, coverageFolderName, coverageJsonName)),
      );

      auto.logger.verbose.info('Filtered packages:', packages);

      const changedFiles = filteredPackages.map(({ name, path }): boolean => {
        auto.logger.verbose.start(`Package: ${name}`);

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const coverage: CoverageSummary = require(join(path, coverageFolderName, coverageJsonName));
        const coverageTotals = Object.values(coverage.total).reduce(
          (sum, what) => {
            sum.total += what.total;
            sum.covered += what.covered;

            return sum;
          },
          { total: 0, covered: 0 },
        );
        auto.logger.verbose.debug('CoverageTotals', coverageTotals);

        const coveragePerc = Math.round((coverageTotals.covered / coverageTotals.total) * 100);
        let coverageColor;
        if (coveragePerc > 99) {
          coverageColor = 'brightgreen';
        } else if (coveragePerc > 95) {
          coverageColor = 'green';
        } else if (coveragePerc > 90) {
          coverageColor = 'yellowgreen';
        } else if (coveragePerc > 80) {
          coverageColor = 'yellow';
        } else if (coveragePerc > 60) {
          coverageColor = 'orange';
        } else {
          coverageColor = 'red';
        }
        const readmePath = join(path, readmeFileName);
        const readme = readFileSync(readmePath, 'utf8');

        if (
          !readme.includes(AddCoverageToReadmePlugin.START_TAG) ||
          !readme.includes(AddCoverageToReadmePlugin.END_TAG)
        ) {
          auto.logger.log.warn('Readme file does not contain either StartTag or EndTag');

          return false;
        }

        const [firstPart] = readme.split(AddCoverageToReadmePlugin.START_TAG);
        const [, lastPart] = readme.split(AddCoverageToReadmePlugin.END_TAG);

        const badgeString = this.badgeTemplate
          .replace(/{PERC}/g, coveragePerc.toString())
          .replace(/{COLOR}/g, coverageColor);

        auto.logger.verbose.info('Badge string:', badgeString);

        writeFileSync(
          readmePath,
          [
            firstPart,
            AddCoverageToReadmePlugin.START_TAG,
            '\n',
            badgeString,
            '\n',
            AddCoverageToReadmePlugin.END_TAG,
            lastPart,
          ].join(''),
        );

        return true;
      });

      const gitChangedFiles = await execPromise('git', ['status', '--porcelain']);

      if (gitChangedFiles && changedFiles.some((changedFile) => changedFile)) {
        await execPromise('git', ['add', '**/README.md']);
        await execPromise('git', ['commit', '--no-verify', '-m', `"${this.commitMessage}"`]);
        auto.logger.verbose.warn('Committed updates to "README.md"');
      }
    });
  }
}
