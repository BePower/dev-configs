import { readFileSync, writeFileSync } from 'fs';

import { Auto, IPlugin, LernaPackage, execPromise, getLernaPackages } from '@auto-it/core';

export interface AddPackagesToReadmePluginOptions {
  commitMessage?: string;
}

export default class AddPackagesToReadmePlugin implements IPlugin {
  static readonly START_TAG =
    '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->';

  static readonly END_TAG = '<!-- PACKAGES-TABLE:END -->';

  name = 'add-packages-to-readme';
  private readonly commitMessage: string;

  constructor(options?: AddPackagesToReadmePluginOptions) {
    this.commitMessage =
      options?.commitMessage ?? 'ci: :memo: Update README.md to add packages table [skip ci]';
    if (!this.commitMessage.includes('[skip ci]')) {
      this.commitMessage = `${this.commitMessage} [skip ci]`;
    }
  }

  apply(auto: Auto): void {
    auto.hooks.afterChangelog.tapPromise(this.name, async () => {
      let packages: LernaPackage[];

      try {
        packages = await getLernaPackages();
      } catch (err) {
        packages = [];
      }

      auto.logger.verbose.info('Found packages:', packages);

      const folder = process.cwd();
      const readmePath = 'README.md';
      const readme = readFileSync(readmePath, { encoding: 'utf8' });

      if (
        !readme.includes(AddPackagesToReadmePlugin.START_TAG) ||
        !readme.includes(AddPackagesToReadmePlugin.END_TAG)
      ) {
        auto.logger.log.warn('Readme file does not contain either StartTag or EndTag');

        return;
      }

      const [firstPart] = readme.split(AddPackagesToReadmePlugin.START_TAG);
      const [, lastPart, ...otherParts] = readme.split(AddPackagesToReadmePlugin.END_TAG);

      const rows = ['| Package | Install command |', '| --- | --- |'];
      rows.push(
        ...packages.map(({ name, path, version }) =>
          [
            '| ',
            `[![${name}: ${version}](https://img.shields.io/badge/${name.replace(
              /-/g,
              '--',
            )}-${version}-brightgreen.svg)](${path.replace(`${folder}/`, '')})`,
            ' | ',
            `\`$ npm install --save-dev ${name}@${version}\``,
            ' |',
          ].join(''),
        ),
      );

      const rowsString = rows.join('\n');
      auto.logger.verbose.info('Packages table:', rowsString);

      const contentArr = [
        firstPart,
        AddPackagesToReadmePlugin.START_TAG,
        '\n',
        '<!-- prettier-ignore-start -->',
        '\n',
        rowsString,
        '\n',
        '<!-- prettier-ignore-end -->',
        '\n',
        AddPackagesToReadmePlugin.END_TAG,
        lastPart,
      ];
      if (otherParts.length > 0 && readme.endsWith(AddPackagesToReadmePlugin.END_TAG)) {
        contentArr.push(AddPackagesToReadmePlugin.END_TAG);
      }

      writeFileSync(readmePath, contentArr.join(''));

      const changedFiles = await execPromise('git', ['status', '--porcelain']);

      auto.logger.verbose.info('Changes files:', changedFiles);

      if (changedFiles) {
        await execPromise('git', ['add', 'README.md']);
        await execPromise('git', ['commit', '--no-verify', '-m', `"${this.commitMessage}"`]);
        auto.logger.verbose.warn('Committed updates to "README.md"');
      }
    });
  }
}
