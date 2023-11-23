import fs from 'fs';

import Auto from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';

import AddPackagesToReadmePlugin from '../../src/scripts/add-packages-to-readme';

const writeMock = jest.fn();
const gitShow = jest.fn();
const getLernaPackages = jest.fn();

getLernaPackages.mockReturnValue(Promise.resolve([]));

const mockRead = (result: string) => jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(result);
jest.spyOn(fs, 'writeFileSync').mockImplementation(writeMock);

jest.mock(
  '@auto-it/core/dist/utils/exec-promise',
  () =>
    (...args: any[]) =>
      gitShow(...args),
);
jest.mock(
  '@auto-it/core/dist/utils/get-lerna-packages',
  () =>
    (...args: any[]) =>
      getLernaPackages(...args),
);

describe('Add packages to Readme Plugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('default options', () => {
    test('should not add any package', async () => {
      const addPackagesToReadmePlugin = new AddPackagesToReadmePlugin();
      const autoHooks = makeHooks();

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->',
          '<!-- PACKAGES-TABLE:END -->',
        ].join('\n'),
      );

      addPackagesToReadmePlugin.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise();

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(writeMock).toHaveBeenCalledWith(
        'README.md',
        [
          '# Title',
          '',
          '',
          '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->',
          '<!-- prettier-ignore-start -->',
          '| Package | Install command |',
          '| --- | --- |',
          '<!-- prettier-ignore-end -->',
          '<!-- PACKAGES-TABLE:END -->',
        ].join('\n'),
      );
    });

    test('should add two packages', async () => {
      const addPackagesToReadmePlugin = new AddPackagesToReadmePlugin();
      const autoHooks = makeHooks();

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->',
          '<!-- PACKAGES-TABLE:END -->',
        ].join('\n'),
      );

      getLernaPackages.mockReturnValueOnce(
        Promise.resolve([
          {
            path: 'packages/app',
            name: '@bepower/app',
            version: '1.2.3',
          },
          {
            path: 'packages/lib',
            name: '@bepower/lib',
            version: '1.2.3',
          },
        ]),
      );

      gitShow.mockReturnValueOnce('src/index.ts');

      addPackagesToReadmePlugin.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise();

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(writeMock).toHaveBeenCalledWith(
        'README.md',
        [
          '# Title',
          '',
          '',
          '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->',
          '<!-- prettier-ignore-start -->',
          '| Package | Install command |',
          '| --- | --- |',
          '| [![@bepower/app: 1.2.3](https://img.shields.io/badge/@bepower/app-1.2.3-brightgreen.svg)](packages/app) | `$ npm install --save-dev @bepower/app@1.2.3` |',
          '| [![@bepower/lib: 1.2.3](https://img.shields.io/badge/@bepower/lib-1.2.3-brightgreen.svg)](packages/lib) | `$ npm install --save-dev @bepower/lib@1.2.3` |',
          '<!-- prettier-ignore-end -->',
          '<!-- PACKAGES-TABLE:END -->',
        ].join('\n'),
      );
      expect(gitShow).toHaveBeenCalledWith('git', ['add', 'README.md']);
      expect(gitShow).toHaveBeenCalledWith('git', [
        'commit',
        '--no-verify',
        '-m',
        '"ci: :memo: Update README.md to add packages table [skip ci]"',
      ]);
    });
  });

  describe('custom options', () => {
    test('should use custom commit message', async () => {
      const addPackagesToReadmePlugin = new AddPackagesToReadmePlugin({
        commitMessage: 'commit message [skip ci]',
      });
      const autoHooks = makeHooks();

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->',
          '<!-- PACKAGES-TABLE:END -->',
        ].join('\n'),
      );

      getLernaPackages.mockReturnValueOnce(
        Promise.resolve([
          {
            path: 'packages/app',
            name: '@bepower/app',
            version: '1.2.3',
          },
          {
            path: 'packages/lib',
            name: '@bepower/lib',
            version: '1.2.3',
          },
        ]),
      );

      gitShow.mockReturnValueOnce('src/index.ts');

      addPackagesToReadmePlugin.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise();

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(writeMock).toHaveBeenCalledWith(
        'README.md',
        [
          '# Title',
          '',
          '',
          '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->',
          '<!-- prettier-ignore-start -->',
          '| Package | Install command |',
          '| --- | --- |',
          '| [![@bepower/app: 1.2.3](https://img.shields.io/badge/@bepower/app-1.2.3-brightgreen.svg)](packages/app) | `$ npm install --save-dev @bepower/app@1.2.3` |',
          '| [![@bepower/lib: 1.2.3](https://img.shields.io/badge/@bepower/lib-1.2.3-brightgreen.svg)](packages/lib) | `$ npm install --save-dev @bepower/lib@1.2.3` |',
          '<!-- prettier-ignore-end -->',
          '<!-- PACKAGES-TABLE:END -->',
        ].join('\n'),
      );
      expect(gitShow).toHaveBeenCalledWith('git', ['add', 'README.md']);
      expect(gitShow).toHaveBeenCalledWith('git', [
        'commit',
        '--no-verify',
        '-m',
        '"commit message [skip ci]"',
      ]);
    });

    test('should use custom commit message, adding "[skip ci]|', async () => {
      const addPackagesToReadmePlugin = new AddPackagesToReadmePlugin({
        commitMessage: 'commit message',
      });
      const autoHooks = makeHooks();

      mockRead(
        [
          '# Title',
          '',
          '',
          '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->',
          '<!-- PACKAGES-TABLE:END -->',
        ].join('\n'),
      );

      getLernaPackages.mockReturnValueOnce(
        Promise.resolve([
          {
            path: 'packages/app',
            name: '@bepower/app',
            version: '1.2.3',
          },
          {
            path: 'packages/lib',
            name: '@bepower/lib',
            version: '1.2.3',
          },
        ]),
      );

      gitShow.mockReturnValueOnce('src/index.ts');

      addPackagesToReadmePlugin.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise();

      expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
      expect(writeMock).toHaveBeenCalledWith(
        'README.md',
        [
          '# Title',
          '',
          '',
          '<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->',
          '<!-- prettier-ignore-start -->',
          '| Package | Install command |',
          '| --- | --- |',
          '| [![@bepower/app: 1.2.3](https://img.shields.io/badge/@bepower/app-1.2.3-brightgreen.svg)](packages/app) | `$ npm install --save-dev @bepower/app@1.2.3` |',
          '| [![@bepower/lib: 1.2.3](https://img.shields.io/badge/@bepower/lib-1.2.3-brightgreen.svg)](packages/lib) | `$ npm install --save-dev @bepower/lib@1.2.3` |',
          '<!-- prettier-ignore-end -->',
          '<!-- PACKAGES-TABLE:END -->',
        ].join('\n'),
      );
      expect(gitShow).toHaveBeenCalledWith('git', ['add', 'README.md']);
      expect(gitShow).toHaveBeenCalledWith('git', [
        'commit',
        '--no-verify',
        '-m',
        '"commit message [skip ci]"',
      ]);
    });
  });

  describe('missing tags', () => {
    test('should not do anything if the start tag is missing', async () => {
      const addPackagesToReadmePlugin = new AddPackagesToReadmePlugin();
      const autoHooks = makeHooks();

      mockRead(['# Title', '', '', '<!-- PACKAGES-TABLE:END -->'].join('\n'));

      addPackagesToReadmePlugin.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise();

      expect(gitShow).not.toHaveBeenCalledWith('git', ['status', '--porcelain']);
    });

    test('should not do anything if the end tag is missing', async () => {
      const addPackagesToReadmePlugin = new AddPackagesToReadmePlugin();
      const autoHooks = makeHooks();

      mockRead(['# Title', '', '', "[//]: # 'START PACKAGES TABLE'"].join('\n'));

      addPackagesToReadmePlugin.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise();

      expect(gitShow).not.toHaveBeenCalledWith('git', ['status', '--porcelain']);
    });

    test('should not do anything if both tags are missing', async () => {
      const addPackagesToReadmePlugin = new AddPackagesToReadmePlugin();
      const autoHooks = makeHooks();

      mockRead(['# Title', '', ''].join('\n'));

      addPackagesToReadmePlugin.apply({
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto);

      await autoHooks.afterChangelog.promise();

      expect(gitShow).not.toHaveBeenCalledWith('git', ['status', '--porcelain']);
    });
  });
});
