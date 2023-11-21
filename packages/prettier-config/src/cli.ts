#!/usr/bin/env node
import { hideBin } from 'yargs/helpers';

import { parser } from './cli/index';

parser.parse(hideBin(process.argv));
