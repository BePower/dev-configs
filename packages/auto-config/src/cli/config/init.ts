/* eslint-disable @typescript-eslint/naming-convention */
import { ArgumentsCamelCase, CommandBuilder } from 'yargs';

export const command = 'config:init';

export const describe = 'Initializes the dot file and the package.json script';

export const builder: CommandBuilder<never, any> = {
  'add-coverage-to-readme': {
    alias: 'c',
    type: 'boolean',
    default: false,
    description: 'Add the "add coverage to readme" part',
  },
  'add-packages-to-readme': {
    alias: 'p',
    type: 'boolean',
    default: false,
    description: 'Add the "add packages to readme" part',
  },
};

export const handler: (args: ArgumentsCamelCase<any>) => void | Promise<void> = (args) => {
  
};
