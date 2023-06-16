import { readFileSync, writeFileSync } from 'fs';

import { Auto, IPlugin, execPromise, getLernaPackages } from '@auto-it/core';

interface AddPackagesToReadmePluginOptions {
  commitMessage?: string;
}

export default class AddPackagesToReadmePlugin implements IPlugin {
  static readonly START_TAG = "[//]: # 'BEGIN PACKAGES TABLE'";
  static readonly END_TAG = "[//]: # 'END PACKAGES TABLE'";

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
    auto.hooks.afterVersion.tapPromise(this.name, async () => {
      const packages = await getLernaPackages();

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
      const [, lastPart] = readme.split(AddPackagesToReadmePlugin.END_TAG);

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

      writeFileSync(
        readmePath,
        [
          firstPart,
          AddPackagesToReadmePlugin.START_TAG,
          '\n',
          '\n',
          rowsString,
          '\n',
          '\n',
          AddPackagesToReadmePlugin.END_TAG,
          lastPart,
        ].join(''),
      );

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
