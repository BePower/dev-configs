#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { join } from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const prettierrcContent = '@bepower/prettier-config';

const prettierignoreNames = ['dist', 'package-lock.json'];

yargs(hideBin(process.argv))
  .command(
    'config:init',
    'Initializes the dot files',
    () => {},
    (argv) => {
      const prettierrcPath = join(process.cwd(), '.prettierrc');
      writeFileSync(prettierrcPath, prettierrcContent);
      process.stderr.write(`prettier configuration written to ${prettierrcPath}\n`);

      if (argv.ignoreFile) {
        const prettierignorePath = join(process.cwd(), '.prettierignore');
        writeFileSync(prettierignorePath, prettierignoreNames.join('\n'));
        process.stderr.write(`prettier ignore configuration written to ${prettierignorePath}\n`);
      }
    },
  )
  .option('ignore-file', {
    alias: 'i',
    type: 'boolean',
    description: 'Initialize .prettierignore file too',
  })
  .help()
  .demandCommand(1)
  .parse();
