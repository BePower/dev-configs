import yargs from 'yargs';

import * as configInit from './config/init';

export const parser = yargs.command(configInit).help();
