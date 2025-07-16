/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it, vi, SpyInstance } from 'vitest';

import yargs from 'yargs';

import * as configInit from '../../../src/cli/config/init';

describe('cli -> config -> init', () => {
  let mockExit: SpyInstance;
  let mockLog: SpyInstance;
  let mockLogError: SpyInstance;
  let mockWrite: SpyInstance;
  let parser: yargs.Argv;

  const writtenFileLog = expect.stringMatching('prettier configuration written to .*.prettierrc\n');
  const writtenFileIgnoreLog = expect.stringMatching(
    'prettier ignore configuration written to .*.prettierignore\n',
  );

  beforeEach(() => {
    vi.resetModules();
    mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockLogError = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    mockWrite = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    parser = yargs.command(configInit).help();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
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
          '  -i, --ignore-file  Initialize .prettierignore file too',
          '                                                      \\[boolean\\] \\[default: false\\]',
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
        join(process.cwd(), '.prettierrc'),
        '"@bepower/prettier-config"',
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
        join(process.cwd(), '.prettierrc'),
        '"@bepower/prettier-config"',
      );
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.prettierignore'),
        ['cdk.out', 'dist', 'package-lock.json'].join('\n'),
      );
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileIgnoreLog);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});
