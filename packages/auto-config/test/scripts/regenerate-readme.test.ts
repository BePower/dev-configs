import fs from 'fs';

import Auto from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';

import RegenerateReadme from '../../scripts/regenerate-readme';

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

describe('Regenerate Readme Plugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not add any package', async () => {
    const regenerateReadme = new RegenerateReadme();
    const autoHooks = makeHooks();

    mockRead(['# Title', '', '', "[//]: # 'BEGIN TABLE'", "[//]: # 'END TABLE'"].join('\n'));

    regenerateReadme.apply({
      hooks: autoHooks,
      logger: dummyLog(),
    } as Auto);

    await autoHooks.afterVersion.promise({
      dryRun: false,
    });

    expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
    expect(writeMock).toHaveBeenCalledWith(
      'README.md',
      [
        '# Title',
        '',
        '',
        "[//]: # 'BEGIN TABLE'",
        '',
        '| Package | Install command |',
        '| --- | --- |',
        '',
        "[//]: # 'END TABLE'",
      ].join('\n'),
    );
  }, 50000);

  test('should add two packages', async () => {
    const regenerateReadme = new RegenerateReadme();
    const autoHooks = makeHooks();

    mockRead(['# Title', '', '', "[//]: # 'BEGIN TABLE'", "[//]: # 'END TABLE'"].join('\n'));

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

    regenerateReadme.apply({
      hooks: autoHooks,
      logger: dummyLog(),
    } as Auto);

    await autoHooks.afterVersion.promise({
      dryRun: false,
    });

    expect(gitShow).toHaveBeenCalledWith('git', ['status', '--porcelain']);
    expect(writeMock).toHaveBeenCalledWith(
      'README.md',
      [
        '# Title',
        '',
        '',
        "[//]: # 'BEGIN TABLE'",
        '',
        '| Package | Install command |',
        '| --- | --- |',
        '| [![@bepower/app: 1.2.3](https://img.shields.io/badge/@bepower/app-1.2.3-brightgreen.svg)](packages/app) | `$ npm install --save-dev @bepower/app@1.2.3` |',
        '| [![@bepower/lib: 1.2.3](https://img.shields.io/badge/@bepower/lib-1.2.3-brightgreen.svg)](packages/lib) | `$ npm install --save-dev @bepower/lib@1.2.3` |',
        '',
        "[//]: # 'END TABLE'",
      ].join('\n'),
    );
    expect(gitShow).toHaveBeenCalledWith('git', ['add', 'README.md']);
    expect(gitShow).toHaveBeenCalledWith('git', [
      'commit',
      '--no-verify',
      '-m',
      '"ci: :memo: Update README.md [skip ci]"',
    ]);
  }, 50000);
});
