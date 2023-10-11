#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { join } from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const eslintrcContent = {
  extends: 'plugin:@bepower/node',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
};

const eslintignoreNames = ['cdk.out', 'dist'];

yargs(hideBin(process.argv))
  .command(
    'config:init',
    'Initializes the dot files',
    () => {},
    (argv) => {
      const eslintrcPath = join(process.cwd(), '.eslintrc');
      writeFileSync(eslintrcPath, JSON.stringify(eslintrcContent, undefined, 2));
      process.stderr.write(`ESLint configuration written to ${eslintrcPath}\n`);

      if (argv.ignoreFile) {
        const eslintignorePath = join(process.cwd(), '.eslintignore');
        writeFileSync(eslintignorePath, eslintignoreNames.join('\n'));
        process.stderr.write(`ESLint ignore configuration written to ${eslintignorePath}\n`);
      }
    },
  )
  .option('ignore-file', {
    alias: 'i',
    type: 'boolean',
    description: 'Initialize .eslintignore file too',
  })
  .help()
  .demandCommand(1)
  .parse();
