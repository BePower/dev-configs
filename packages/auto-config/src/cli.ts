#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function escapeSpecialCharacters(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

const matchEverything = '(.|\\n|\\r)*?';
const addCoverageToReadmeStart = escapeSpecialCharacters('/* add-coverage-to-readme:start */');
const addCoverageToReadmeStop = escapeSpecialCharacters('/* add-coverage-to-readme:stop */');
const addPackagesToReadmeStart = escapeSpecialCharacters('/* add-packages-to-readme:start */');
const addPackagesToReadmeStop = escapeSpecialCharacters('/* add-packages-to-readme:stop */');

yargs(hideBin(process.argv))
  .command(
    'config:init',
    'Initializes the dot file',
    () => {},
    (argv) => {
      const autorcPath = join(process.cwd(), '.autorc.js');
      let autorcContent = readFileSync(join(__dirname, 'templates', '.autorc.js'), 'utf-8');

      if (!argv.addCoverageToReadme) {
        autorcContent = autorcContent.replace(
          new RegExp(
            ` *${addCoverageToReadmeStart}${matchEverything}${addCoverageToReadmeStop}\\n?`,
            'g',
          ),
          '',
        );
      }

      if (!argv.addPackagesToReadme) {
        autorcContent = autorcContent.replace(
          new RegExp(
            ` *${addPackagesToReadmeStart}${matchEverything}${addPackagesToReadmeStop}\\n?`,
            'g',
          ),
          '',
        );
      }

      writeFileSync(autorcPath, autorcContent);
      process.stderr.write(`auto configuration written to ${autorcPath}\n`);

      const releaseScript = 'npx auto shipit --message "ci: :memo: Update CHANGELOG.md [skip ci]"';
      const packageJsonPath = join(process.cwd(), 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJsonString = readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonString) as {
          scripts?: { [key: string]: string };
        };

        if (!packageJson.scripts) {
          packageJson.scripts = {};
        }
        if (packageJson.scripts.release) {
          process.stderr.write(
            `Cannot add the release script to package.json: already present.\nPlease add manually:\n${releaseScript}\n`,
          );
        } else {
          packageJson.scripts.release = releaseScript;
          process.stderr.write(`Release script added to your package.json file\n`);
          writeFileSync(packageJsonPath, JSON.stringify(packageJson));
        }
      } else {
        process.stderr.write(
          `Cannot add the release script to package.json: package file not found.\nPlease add manually:\n${releaseScript}\n`,
        );
      }
    },
  )
  .option('add-coverage-to-readme', {
    alias: 'c',
    type: 'boolean',
    default: false,
    description: 'Add the "add coverage to readme" part',
  })
  .option('add-packages-to-readme', {
    alias: 'p',
    type: 'boolean',
    default: false,
    description: 'Add the "add packages to readme" part',
  })
  .help()
  .demandCommand(1)
  .parse();
