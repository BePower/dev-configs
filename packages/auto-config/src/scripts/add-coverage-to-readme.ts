import { readFileSync, writeFileSync } from 'fs';
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

export interface AddCoverageToReadmePluginOptions {
  badgeTemplate?: string;
  commitMessage?: string;
}

export default class AddCoverageToReadmePlugin implements IPlugin {
  static readonly START_TAG =
    '<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->';

  static readonly END_TAG = '<!-- COVERAGE-BADGE:END -->';

  static readonly COLOR_PERCENTAGES: { color: string; perc: number }[] = [
    { perc: 99, color: 'brightgreen' },
    { perc: 95, color: 'green' },
    { perc: 90, color: 'yellowgreen' },
    { perc: 80, color: 'yellow' },
    { perc: 60, color: 'orange' },
    { perc: -1, color: 'red' },
  ];

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
      let packages: LernaPackage[];
      const rootPackage: LernaPackage = { name: 'root', path: process.cwd(), version: '0.0.0' };

      try {
        packages = [rootPackage, ...(await getLernaPackages())];
      } catch (err) {
        packages = [rootPackage];
      }

      auto.logger.verbose.info('Found packages:', packages);

      const coverageFolderName = 'coverage';
      const coverageJsonName = 'coverage-summary.json';
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const coverage: CoverageSummary = require(
        join(process.cwd(), coverageFolderName, coverageJsonName),
      );
      const readmeFileName = 'README.md';

      const changedFiles = packages.map(({ name, path }): boolean => {
        auto.logger.verbose.start(`Package: ${name}`);

        const coverageTotals = Object.entries(coverage)
          .filter(([key]) => key !== 'totals')
          .filter(([key]) => key.startsWith(path))
          .reduce(
            (sum, [_, file]) => {
              Object.values(file).reduce((innerSum, what) => {
                innerSum.total += what.total;
                innerSum.covered += what.covered;

                return innerSum;
              }, sum);
              return sum;
            },
            { total: 0, covered: 0 },
          );
        auto.logger.verbose.debug('CoverageTotals', coverageTotals);

        const coveragePerc = Math.round((coverageTotals.covered / coverageTotals.total) * 100);
        const coverageColor = AddCoverageToReadmePlugin.COLOR_PERCENTAGES.find(
          ({ perc }) => coveragePerc > perc,
        )!.color;
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
            '\n\n',
            badgeString,
            '\n\n',
            AddCoverageToReadmePlugin.END_TAG,
            lastPart,
          ].join(''),
        );

        return true;
      });

      const gitChangedFiles = await execPromise('git', ['status', '--porcelain']);

      if (gitChangedFiles && changedFiles.some((changedFile) => changedFile)) {
        await execPromise('git', ['add', 'README.md']);
        await execPromise('git', ['add', '**/README.md']);
        await execPromise('git', ['commit', '--no-verify', '-m', `"${this.commitMessage}"`]);
        auto.logger.verbose.warn('Committed updates to "README.md"');
      }
    });
  }
}
