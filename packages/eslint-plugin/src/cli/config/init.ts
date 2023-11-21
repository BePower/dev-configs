/* eslint-disable @typescript-eslint/naming-convention */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { CommandModule } from 'yargs';

export const command: CommandModule['command'] = 'config:init';

export const describe: CommandModule['describe'] = 'Initializes the dot files';

export const builder: CommandModule['builder'] = {
  'ignore-file': {
    alias: 'i',
    type: 'boolean',
    default: false,
    description: 'Initialize .eslintignore file too',
  },
};

export const handler: CommandModule['handler'] = (argv) => {
  const eslintrcContent = {
    extends: 'plugin:@bepower/node',
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
  };
  const eslintignoreNames = ['cdk.out', 'dist', 'package-lock.json'];
  const eslintrcPath = join(process.cwd(), '.eslintrc');

  writeFileSync(eslintrcPath, JSON.stringify(eslintrcContent, undefined, 2));
  process.stderr.write(`ESLint configuration written to ${eslintrcPath}\n`);

  if (argv.ignoreFile) {
    const eslintignorePath = join(process.cwd(), '.eslintignore');
    writeFileSync(eslintignorePath, eslintignoreNames.join('\n'));
    process.stderr.write(`ESLint ignore configuration written to ${eslintignorePath}\n`);
  }
};
