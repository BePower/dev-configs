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

  const writtenFileLog = expect.stringMatching(`auto configuration written to .*.autorc.ts\n`);
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
      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.autorc.ts'),
        [
          "import base, { coverage, packages, AddCoverageToReadmePluginOptions, AddPackagesToReadmePluginOptions } from '@bepower/auto-config';",
          "import { AutoRc } from 'auto';",
          '',
          '',
          '',
          'export default function config(): AutoRc {',
          '',
          '  base.author = {',
          "    name: 'BePower',",
          "    email: 'it.aws@bepower.com',",
          '  };',
          '',
          '  return base;',
          '}',
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
      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.autorc.ts'),
        [
          "import base, { coverage, packages, AddCoverageToReadmePluginOptions, AddPackagesToReadmePluginOptions } from '@bepower/auto-config';",
          "import { AutoRc } from 'auto';",
          '',
          '/* add-coverage-to-readme:start */',
          'const coverageOptions: AddCoverageToReadmePluginOptions = {',
          "  badgeTemplate: '[badge-coverage]: https://img.shields.io/badge/coverage-{PERC}%25-{COLOR}.svg',",
          '};',
          '/* add-coverage-to-readme:stop */',
          '',
          '',
          'export default function config(): AutoRc {',
          '  /* add-coverage-to-readme:start */',
          '  base.plugins!.push([coverage, coverageOptions]);',
          '  /* add-coverage-to-readme:stop */',
          '',
          '  base.author = {',
          "    name: 'BePower',",
          "    email: 'it.aws@bepower.com',",
          '  };',
          '',
          '  return base;',
          '}',
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
      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.autorc.ts'),
        [
          "import base, { coverage, packages, AddCoverageToReadmePluginOptions, AddPackagesToReadmePluginOptions } from '@bepower/auto-config';",
          "import { AutoRc } from 'auto';",
          '',
          '',
          '/* add-packages-to-readme:start */',
          'const packagesOptions: AddPackagesToReadmePluginOptions = {};',
          '/* add-packages-to-readme:stop */',
          '',
          'export default function config(): AutoRc {',
          '  /* add-packages-to-readme:start */',
          '  base.plugins!.push([packages, packagesOptions]);',
          '  /* add-packages-to-readme:stop */',
          '',
          '  base.author = {',
          "    name: 'BePower',",
          "    email: 'it.aws@bepower.com',",
          '  };',
          '',
          '  return base;',
          '}',
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
      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), '.autorc.ts'),
        [
          "import base, { coverage, packages, AddCoverageToReadmePluginOptions, AddPackagesToReadmePluginOptions } from '@bepower/auto-config';",
          "import { AutoRc } from 'auto';",
          '',
          '/* add-coverage-to-readme:start */',
          'const coverageOptions: AddCoverageToReadmePluginOptions = {',
          "  badgeTemplate: '[badge-coverage]: https://img.shields.io/badge/coverage-{PERC}%25-{COLOR}.svg',",
          '};',
          '/* add-coverage-to-readme:stop */',
          '',
          '/* add-packages-to-readme:start */',
          'const packagesOptions: AddPackagesToReadmePluginOptions = {};',
          '/* add-packages-to-readme:stop */',
          '',
          'export default function config(): AutoRc {',
          '  /* add-coverage-to-readme:start */',
          '  base.plugins!.push([coverage, coverageOptions]);',
          '  /* add-coverage-to-readme:stop */',
          '  /* add-packages-to-readme:start */',
          '  base.plugins!.push([packages, packagesOptions]);',
          '  /* add-packages-to-readme:stop */',
          '',
          '  base.author = {',
          "    name: 'BePower',",
          "    email: 'it.aws@bepower.com',",
          '  };',
          '',
          '  return base;',
          '}',
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

      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'package.json'),
        JSON.stringify(
          {
            scripts: {
              release: 'npx auto shipit',
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

      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'package.json'),
        JSON.stringify(
          {
            foo: 'bar',
            scripts: {
              release: 'npx auto shipit',
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

      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(
        [
          'Cannot add the release script to package.json: "scripts" key isn\'t an object.',
          'Please add manually:',
          'npx auto shipit',
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

      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledWith(
        join(process.cwd(), 'package.json'),
        JSON.stringify(
          {
            scripts: {
              test: 'jest',
              release: 'npx auto shipit',
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

      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(
        [
          'Cannot add the release script to package.json: already present.',
          'Please add manually:',
          'npx auto shipit',
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

      expect(mockRead).toHaveBeenCalledTimes(1);
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockLogError).toHaveBeenCalledTimes(2);
      expect(mockLogError).toHaveBeenCalledWith(writtenFileLog);
      expect(mockLogError).toHaveBeenCalledWith(
        [
          'Cannot add the release script to package.json: package file not found.',
          'Please add manually:',
          'npx auto shipit',
          '',
        ].join('\n'),
      );
    });
  });
});
