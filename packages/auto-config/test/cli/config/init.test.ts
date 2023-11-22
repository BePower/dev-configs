/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable id-length */
import fs from 'fs';
import { join } from 'path';

import yargs from 'yargs';

import * as configInit from '../../../src/cli/config/init';

describe('cli -> config -> init', () => {
  let mockExit: jest.SpyInstance;
  let mockLog: jest.SpyInstance;
  let mockLogError: jest.SpyInstance;
  let mockWrite: jest.SpyInstance;
  let mockExists: jest.SpyInstance;
  let mockRead: jest.SpyInstance;
  let parser: yargs.Argv;

  const readFileSync = fs.readFileSync;

  const writtenFileLog = expect.stringMatching(`auto configuration written to .*.autorc.js\n`);
  const writtenPackageLog = 'Release script added to your package.json file\n';

  beforeEach(() => {
    jest.resetModules();
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLogError = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    mockWrite = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    mockExists = jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
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
          'Initializes the dot file and the package.json script',
          '',
          'Options:',
          '      --version                 Show version number                    \\[boolean\\]',
          '      --help                    Show help                              \\[boolean\\]',
          '  -c, --add-coverage-to-readme  Add the "add coverage to readme" part',
          '                                                      \\[boolean\\] \\[default: false\\]',
          '  -p, --add-packages-to-readme  Add the "add packages to readme" part',
          '                                                      \\[boolean\\] \\[default: false\\]',
        ].join('\n'),
      ),
    );
  });

  describe('config file', () => {
    beforeEach(() => {
      mockRead = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce((...args) => readFileSync(...args))
        .mockImplementation(() => JSON.stringify({}));
    });

    it('should write the file without addendum', async () => {
      const argv = await parser.parseAsync('config:init');

      expect(argv).toMatchObject({
        'add-coverage-to-readme': false,
        'add-packages-to-readme': false,
        addCoverageToReadme: false,
        addPackagesToReadme: false,
        c: false,
        p: false,
      });
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.autorc.js'),
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
      const argv = await parser.parseAsync('config:init --add-coverage-to-readme');

      expect(argv).toMatchObject({
        'add-coverage-to-readme': true,
        'add-packages-to-readme': false,
        addCoverageToReadme: true,
        addPackagesToReadme: false,
        c: true,
        p: false,
      });
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.autorc.js'),
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
      const argv = await parser.parseAsync('config:init --add-packages-to-readme');

      expect(argv).toMatchObject({
        'add-coverage-to-readme': false,
        'add-packages-to-readme': true,
        addCoverageToReadme: false,
        addPackagesToReadme: true,
        c: false,
        p: true,
      });
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.autorc.js'),
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
      const argv = await parser.parseAsync(
        'config:init --add-coverage-to-readme --add-packages-to-readme',
      );

      expect(argv).toMatchObject({
        'add-coverage-to-readme': true,
        'add-packages-to-readme': true,
        addCoverageToReadme: true,
        addPackagesToReadme: true,
        c: true,
        p: true,
      });
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.autorc.js'),
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

  describe('adding the "release" script to package.json file', () => {
    it('should handle an empty package json', async () => {
      mockRead = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce((...args) => readFileSync(...args))
        .mockImplementationOnce(() => JSON.stringify({}));

      await parser.parseAsync('config:init');

      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'package.json'),
        JSON.stringify(
          {
            scripts: {
              release: 'npx auto version && npx auto shipit --message "ci: :memo: Update CHANGELOG.md [skip ci]"',
            },
          },
          undefined,
          2,
        ),
      );
    });

    it('should handle a package json without the script key', async () => {
      mockRead = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce((...args) => readFileSync(...args))
        .mockImplementationOnce(() => JSON.stringify({ foo: 'bar' }));

      await parser.parseAsync('config:init');

      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'package.json'),
        JSON.stringify(
          {
            foo: 'bar',
            scripts: {
              release: 'npx auto version && npx auto shipit --message "ci: :memo: Update CHANGELOG.md [skip ci]"',
            },
          },
          undefined,
          2,
        ),
      );
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(writtenPackageLog);
    });

    it('should handle a package json with script key', async () => {
      mockRead = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce((...args) => readFileSync(...args))
        .mockImplementationOnce(() => JSON.stringify({ scripts: 'bar' }));

      await parser.parseAsync('config:init');

      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(
        [
          'Cannot add the release script to package.json: "scripts" key isn\'t an object.',
          'Please add manually:',
          'npx auto version && npx auto shipit --message "ci: :memo: Update CHANGELOG.md [skip ci]"',
          '',
        ].join('\n'),
      );
    });

    it('should handle a package json with script object', async () => {
      mockRead = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce((...args) => readFileSync(...args))
        .mockImplementationOnce(() => JSON.stringify({ scripts: { test: 'jest' } }));

      await parser.parseAsync('config:init');

      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'package.json'),
        JSON.stringify(
          {
            scripts: {
              test: 'jest',
              release: 'npx auto version && npx auto shipit --message "ci: :memo: Update CHANGELOG.md [skip ci]"',
            },
          },
          undefined,
          2,
        ),
      );
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(writtenPackageLog);
    });

    it('should handle a package json with script object', async () => {
      mockRead = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce((...args) => readFileSync(...args))
        .mockImplementationOnce(() => JSON.stringify({ scripts: { release: 'npx auto shipit' } }));

      await parser.parseAsync('config:init');

      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(
        [
          'Cannot add the release script to package.json: already present.',
          'Please add manually:',
          'npx auto version && npx auto shipit --message "ci: :memo: Update CHANGELOG.md [skip ci]"',
          '',
        ].join('\n'),
      );
    });

    it('should not handle a non existing package.json file', async () => {
      mockRead = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce((...args) => readFileSync(...args));

      mockExists.mockReturnValueOnce(false);

      await parser.parseAsync('config:init');

      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(
        [
          'Cannot add the release script to package.json: package file not found.',
          'Please add manually:',
          'npx auto version && npx auto shipit --message "ci: :memo: Update CHANGELOG.md [skip ci]"',
          '',
        ].join('\n'),
      );
    });
  });
});
