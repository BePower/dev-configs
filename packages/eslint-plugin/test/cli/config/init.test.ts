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

  const writtenFileLog = expect.stringMatching('ESLint configuration written to .*.eslintrc\n');
  const writtenFileIgnoreLog = expect.stringMatching(
    'ESLint ignore configuration written to .*.eslintignore\n',
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
          'Initializes the dot files',
          '',
          'Options:',
          '      --version      Show version number                               \\[boolean\\]',
          '      --help         Show help                                         \\[boolean\\]',
          '  -i, --ignore-file  Initialize .eslintignore file too\\[boolean\\] \\[default: false\\]',
        ].join('\n'),
      ),
    );
  });

  describe('config file', () => {
    it('should only write config file', async () => {
      const argv = await parser.parseAsync('config:init');

      expect(argv).toMatchObject({
        'ignore-file': false,
        ignoreFile: false,
        i: false,
      });
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.eslintrc'),
        JSON.stringify(
          {
            extends: 'plugin:@bepower/node',
            parserOptions: {
              project: './tsconfig.eslint.json',
            },
          },
          undefined,
          2,
        ),
      );
      expect(mockLogError).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should write config file and ignore file', async () => {
      const argv = await parser.parseAsync('config:init --ignore-file');

      expect(argv).toMatchObject({
        'ignore-file': true,
        ignoreFile: true,
        i: true,
      });
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.eslintrc'),
        JSON.stringify(
          {
            extends: 'plugin:@bepower/node',
            parserOptions: {
              project: './tsconfig.eslint.json',
            },
          },
          undefined,
          2,
        ),
      );
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.eslintignore'),
        ['cdk.out', 'dist', 'package-lock.json'].join('\n'),
      );
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileIgnoreLog);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});
