import { writeFileSync } from 'fs';
import { join } from 'path';

import { CommandModule } from 'yargs';

export const command: CommandModule['command'] = 'config:init';

export const describe: CommandModule['describe'] = 'Initializes the dot files';

export const builder: CommandModule['builder'] = {
  'ignore-file': {
    alias: 'i',
    type: 'boolean',
    default: false,
    description: 'Initialize .prettierignore file too',
  },
};

export const handler: CommandModule['handler'] = (argv) => {
  const prettierrcContent = '@bepower/prettier-config';
  const prettierignoreNames = ['cdk.out', 'dist', 'package-lock.json'];
  const prettierrcPath = join(process.cwd(), '.prettierrc');

  writeFileSync(prettierrcPath, JSON.stringify(prettierrcContent));
  process.stderr.write(`prettier configuration written to ${prettierrcPath}\n`);

  if (argv.ignoreFile) {
    const prettierignorePath = join(process.cwd(), '.prettierignore');
    writeFileSync(prettierignorePath, prettierignoreNames.join('\n'));
    process.stderr.write(`prettier ignore configuration written to ${prettierignorePath}\n`);
  }
};
