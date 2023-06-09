import base from '@bepower/auto-config';
import { AutoRc } from 'auto';

const configObj = base;
configObj.plugins?.push('./scripts/regenerate-readme.js');

const config = (): AutoRc => configObj;

export default config;
