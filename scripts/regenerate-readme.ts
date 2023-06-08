import { Auto, IPlugin, execPromise, getLernaPackages } from '@auto-it/core';
import { readFileSync, writeFileSync } from 'fs';

export default class RegenerateReadmePlugin implements IPlugin {
  static readonly START_TAG = '[//]: # (BEGIN TABLE)';
  static readonly END_TAG = '[//]: # (END TABLE)';

  name = 'regenerate-readme';

  apply(auto: Auto): void {
    auto.hooks.afterVersion.tapPromise(this.name, async () => {
      const packages = await getLernaPackages();

      const folder = 'packages';
      const readmePath = 'README.md';
      const readme = readFileSync(readmePath, { encoding: 'utf8' });

      const [firstPart] = readme.split(RegenerateReadmePlugin.START_TAG);
      const [,lastPart] = readme.split(RegenerateReadmePlugin.END_TAG);

      const rows = ['| Name | Version | Install command |', '| --- | --- | --- |'];
      rows.push(...packages.map(({ name, version }) => [
        '| ',
        `[${name}](${folder}/${name})`,
        ' | ',
        `[![${name}: ${version}](https://img.shields.io/badge/${name.replace(/-/g, '--')}-${version}-brightgreen.svg)](${folder}/${name}/package.json)`,
        ' | ',
        `\`$ npm install --save-dev @bepower/${name}@${version}\``,
        ' |',
      ].join('')));

      writeFileSync(readmePath, [firstPart, RegenerateReadmePlugin.START_TAG, '\n', '\n', rows.join('\n'), '\n', '\n', RegenerateReadmePlugin.END_TAG, lastPart].join(''));

      const changedFiles = await execPromise('git', ['status', '--porcelain']);

      if (changedFiles) {
        await execPromise('git', ['add', 'README.md']);
        await execPromise('git', [ 'commit', '--no-verify', '-m', '"ci: :memo: Update README.md [skip ci]"']);
        auto.logger.verbose.warn('Committed updates to "README.md"');
      }
    });
  }
}
