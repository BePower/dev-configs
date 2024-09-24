/* eslint-disable @typescript-eslint/naming-convention */
import { writeFileSync } from 'fs';
import { join } from 'path';

import { CommandModule } from 'yargs';

type EslintCommandModule = CommandModule<{}, { ignoreFile: boolean }>;

export const command: EslintCommandModule['command'] = 'config:init';

export const describe: EslintCommandModule['describe'] = 'Initializes the config file';

export const builder: EslintCommandModule['builder'] = {
  'ignore-file': {
    alias: 'i',
    type: 'boolean',
    default: true,
    description: 'Initialize the ignore part too',
  },
};

export const handler: EslintCommandModule['handler'] = (argv) => {
  const eslintConfig = `const { bePowerFactory } = require('@bepower/eslint-plugin');

module.exports = [
  ...bePowerFactory({
    cdk = false,
    node = true,
    typescript = true,
    react = false,
  }, ${argv.ignoreFile ? 'true' : 'false'}),
];
`;

  const eslintConfigPath = join(process.cwd(), 'eslint.config.js');

  writeFileSync(eslintConfigPath, eslintConfig);
  process.stderr.write(`ESLint configuration written to ${eslintConfigPath}\n`);
};
