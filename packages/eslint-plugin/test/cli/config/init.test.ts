/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs';
import { join } from 'path';

import yargs from 'yargs';

import * as configInit from '../../../src/cli/config/init';

describe('cli -> config -> init', () => {
  let mockExit: jest.SpyInstance;
  let mockLog: jest.SpyInstance;
  let mockLogError: jest.SpyInstance;
  let mockWrite: jest.SpyInstance;
  let parser: yargs.Argv;

  const writtenFileLog = expect.stringMatching(
    'ESLint configuration written to .*eslint\\.config\\.js\n',
  );

  beforeEach(() => {
    jest.resetModules();
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLogError = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    mockWrite = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    parser = yargs.command(configInit).help();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should retrieve the help message', async () => {
    const argv = await parser.parseAsync('config:init --help');

    expect(argv).toMatchObject({ help: true });
    expect(mockExit).toHaveBeenCalledWith(0);
    expect(mockLog).toHaveBeenCalledWith(
      expect.stringMatching(
        [
          '.* config:init',
          '',
          'Initializes the config file',
          '',
          'Options:',
          '      --version      Show version number                               \\[boolean\\]',
          '      --help         Show help                                         \\[boolean\\]',
          '  -i, --ignore-file  Initialize the ignore part too    \\[boolean\\] \\[default: true\\]',
        ].join('\n'),
      ),
    );
  });

  describe('config file', () => {
    it('should write config file', async () => {
      const argv = await parser.parseAsync('config:init');

      expect(argv).toMatchObject({
        'ignore-file': true,
        ignoreFile: true,
        i: true,
      });
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'eslint.config.js'),
        `const { bePowerFactory } = require('@bepower/eslint-plugin');

module.exports = [
  ...bePowerFactory({
    cdk = false,
    node = true,
    typescript = true,
    react = false,
  }, true),
];
`,
      );
      expect(mockLogError).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should write config file and not ignore file', async () => {
      const argv = await parser.parseAsync('config:init --ignore-file=false');

      expect(argv).toMatchObject({
        'ignore-file': false,
        ignoreFile: false,
        i: false,
      });
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'eslint.config.js'),
        `const { bePowerFactory } = require('@bepower/eslint-plugin');

module.exports = [
  ...bePowerFactory({
    cdk = false,
    node = true,
    typescript = true,
    react = false,
  }, false),
];
`,
      );
      expect(mockLogError).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});
