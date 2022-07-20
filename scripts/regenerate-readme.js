const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const packagesFolder = 'packages';
const packagesPath = join(__dirname, '..', packagesFolder);
const packages = readdirSync(packagesPath).map((package) => ({
  package,
  version: require(join(packagesPath, package, 'package.json')).version,
}));

const readmePath = join(__dirname, '..', 'README.md');
const readme = readFileSync(readmePath, 'utf8');
const startTag = '[//]: # (BEGIN TABLE)';
const endTag = '[//]: # (END TABLE)';

const [firstPart] = readme.split(startTag);
const [,lastPart] = readme.split(endTag);

const rows = ['| Name | Version |'];
rows.push(...packages.map(({ package, version }) => `| [${package}](${packagesFolder}/${package}) | [![${package}: ${version}](https://img.shields.io/badge/${package.replace(/-/g, '--')}-${version}-brightgreen.svg)](${packagesFolder}/${package}/package.json) |`));

writeFileSync(readmePath, [firstPart, startTag, '\n', '\n', rows.join('\n'), '\n', '\n', endTag, lastPart].join(''));