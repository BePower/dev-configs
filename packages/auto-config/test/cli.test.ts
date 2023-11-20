import fs from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/require-await
async function runCommand(...args: string[]) {
  process.argv = ['node', 'cli.js', ...args];

  return require('../src/cli');
}

describe('cli', () => {
  let originalArgv: string[];
  let mockExit: jest.SpyInstance;
  let mockLog: jest.SpyInstance;
  let mockLogError: jest.SpyInstance;
  let mockWrite: jest.SpyInstance;
  let mockExists: jest.SpyInstance;
  let mockRead: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    originalArgv = process.argv;
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });
    mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLogError = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    mockWrite = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    mockExists = jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    mockRead = jest.spyOn(fs, 'readFileSync').mockImplementation(() => '{}');
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.argv = originalArgv;
  });

  it('should print the help', async () => {
    expect.assertions(3);

    await runCommand('--help');

    expect(mockLog).toHaveBeenCalledWith(
      [
        'cli.js <command>',
        '',
        'Commands:',
        '  cli.js config:init  Initializes the dot file',
        '',
        'Options:',
        '      --version                 Show version number                    [boolean]',
        '  -c, --add-coverage-to-readme  Add the "add coverage to readme" part',
        '                                                      [boolean] [default: false]',
        '  -p, --add-packages-to-readme  Add the "add packages to readme" part',
        '                                                      [boolean] [default: false]',
        '      --help                    Show help                              [boolean]',
      ].join('\n'),
    );
    expect(mockLogError).not.toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  describe('config:init', () => {
    const writtenFileLog = `auto configuration written to ${join(process.cwd(), '.autorc.js')}\n`;
    const writtenPackageLog = 'Release script added to your package.json file\n';

    it('should write the file without addendum', async () => {
      expect.assertions(5);

      await runCommand('config:init');

      expect(mockWrite).toHaveBeenCalledWith(
        join(__dirname, '..', '.autorc.js'),
        [
          "const base = require('@bepower/auto-config').default;",
          '',
          '',
          '/**',
          " * @returns {import('@auto-it/core').default}",
          ' */',
          'function config() {',
          '',
          '  return base;',
          '}',
          '',
          'module.exports = config;',
          '',
        ].join('\n'),
      );
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(writtenPackageLog);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should write the file with coverage addendums', async () => {
      expect.assertions(5);

      await runCommand('config:init', '--add-coverage-to-readme');

      expect(mockWrite).toHaveBeenCalledWith(
        join(__dirname, '..', '.autorc.js'),
        [
          "const base = require('@bepower/auto-config').default;",
          '',
          '/* add-coverage-to-readme:start */',
          "const coverage = require.resolve('@bepower/auto-config/scripts/add-coverage-to-readme');",
          '/**',
          " * @type {import('@bepower/auto-config/scripts/add-coverage-to-readme').AddCoverageToReadmePluginOptions}",
          ' */',
          'const coverageOptions = {',
          "  badgeTemplate: '[badge-coverage]: https://img.shields.io/badge/coverage-{PERC}%25-{COLOR}.svg',",
          '};',
          '/* add-coverage-to-readme:stop */',
          '',
          '/**',
          " * @returns {import('@auto-it/core').default}",
          ' */',
          'function config() {',
          '  /* add-coverage-to-readme:start */',
          '  base.plugins.push([coverage, coverageOptions]);',
          '  /* add-coverage-to-readme:stop */',
          '',
          '  return base;',
          '}',
          '',
          'module.exports = config;',
          '',
        ].join('\n'),
      );
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(writtenPackageLog);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should write the file with packages addendums', async () => {
      expect.assertions(5);

      await runCommand('config:init', '--add-packages-to-readme');

      expect(mockWrite).toHaveBeenCalledWith(
        join(__dirname, '..', '.autorc.js'),
        [
          "const base = require('@bepower/auto-config').default;",
          '',
          '/* add-packages-to-readme:start */',
          "const packages = require.resolve('@bepower/auto-config/scripts/add-packages-to-readme');",
          '/* add-packages-to-readme:stop */',
          '',
          '/**',
          " * @returns {import('@auto-it/core').default}",
          ' */',
          'function config() {',
          '  /* add-packages-to-readme:start */',
          '  base.plugins.push(packages);',
          '  /* add-packages-to-readme:stop */',
          '',
          '  return base;',
          '}',
          '',
          'module.exports = config;',
          '',
        ].join('\n'),
      );
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(writtenPackageLog);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should write the file with both addendums', async () => {
      expect.assertions(5);

      await runCommand('config:init', '--add-coverage-to-readme', '--add-packages-to-readme');

      expect(mockWrite).toHaveBeenCalledWith(
        join(__dirname, '..', '.autorc.js'),
        [
          "const base = require('@bepower/auto-config').default;",
          '',
          '/* add-packages-to-readme:start */',
          "const packages = require.resolve('@bepower/auto-config/scripts/add-packages-to-readme');",
          '/* add-packages-to-readme:stop */',
          '/* add-coverage-to-readme:start */',
          "const coverage = require.resolve('@bepower/auto-config/scripts/add-coverage-to-readme');",
          '/**',
          " * @type {import('@bepower/auto-config/scripts/add-coverage-to-readme').AddCoverageToReadmePluginOptions}",
          ' */',
          'const coverageOptions = {',
          "  badgeTemplate: '[badge-coverage]: https://img.shields.io/badge/coverage-{PERC}%25-{COLOR}.svg',",
          '};',
          '/* add-coverage-to-readme:stop */',
          '',
          '/**',
          " * @returns {import('@auto-it/core').default}",
          ' */',
          'function config() {',
          '  /* add-packages-to-readme:start */',
          '  base.plugins.push(packages);',
          '  /* add-packages-to-readme:stop */',
          '  /* add-coverage-to-readme:start */',
          '  base.plugins.push([coverage, coverageOptions]);',
          '  /* add-coverage-to-readme:stop */',
          '',
          '  return base;',
          '}',
          '',
          'module.exports = config;',
          '',
        ].join('\n'),
      );
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(writtenPackageLog);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});
