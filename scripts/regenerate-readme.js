const { execSync } = require('child_process');
const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const packagesFolder = 'packages';
const packagesPath = join(__dirname, '..', packagesFolder);

const readmePath = join(__dirname, '..', 'README.md');
const startTag = '[//]: # (BEGIN TABLE)';
const endTag = '[//]: # (END TABLE)';

module.exports = class TestPlugin {
  constructor() {
    this.name = 'update-readme';
  }

  /**
   * Tap into auto plugin points.
   * @param {import('@auto-it/core').default} auto
   */
  apply(auto) {
    auto.hooks.afterVersion.tap(this.name, () => {
      auto.logger.verbose.info('packagesPath', packagesPath);
      auto.logger.verbose.info('readmePath', readmePath);
      auto.logger.verbose.info('readdirSync(packagesPath)', readdirSync(packagesPath));

      const packages = readdirSync(packagesPath)
        .map((thePackage) => ({
          package: thePackage,
          version: require(join(packagesPath, thePackage, 'package.json')).version,
        }));

      auto.logger.verbose.info('packages', packages);

      const readme = readFileSync(readmePath, 'utf8');

      const [firstPart] = readme.split(startTag);
      const [,lastPart] = readme.split(endTag);

      const rows = ['| Name | Version | Install command |', '| --- | --- | --- |'];
      rows.push(...packages.map(({ package: thePackage, version }) => [
        '| ',
        `[${thePackage}](${packagesFolder}/${thePackage})`,
        ' | ',
        `[![${thePackage}: ${version}](https://img.shields.io/badge/${thePackage.replace(/-/g, '--')}-${version}-brightgreen.svg)](${packagesFolder}/${thePackage}/package.json)`,
        ' | ',
        `\`$ npm install --save-dev @bepower/${thePackage}@${version}\``,
        ' |',
      ].join('')));

      writeFileSync(readmePath, [firstPart, startTag, '\n', '\n', rows.join('\n'), '\n', '\n', endTag, lastPart].join(''));

      execSync(`git add ${readmePath}`)
    });
  }
}



