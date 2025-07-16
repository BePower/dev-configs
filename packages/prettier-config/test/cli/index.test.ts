import { readFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it, vi, SpyInstance } from 'vitest';

import { parser } from '../../src/cli/index';

const packageStr = readFileSync(join(__dirname, '../../package.json'), 'utf8');
const { version } = JSON.parse(packageStr);

describe('cli', () => {
  let mockExit: SpyInstance;
  let mockLog: SpyInstance;

  beforeEach(() => {
    vi.resetModules();
    mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockLog = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should retrieve the help message', async () => {
    const argv = await parser.parseAsync('--help');

    expect(argv).toMatchObject({ help: true });
    expect(mockExit).toHaveBeenCalledWith(0);
    expect(mockLog).toHaveBeenCalledWith(
      expect.stringMatching(
        [
          '.* \\[command\\]',
          '',
          'Commands:',
          '  .* config:init  Initializes the dot files',
          '',
          'Options:',
          '  --version  Show version number                                       \\[boolean\\]',
          '  --help     Show help                                                 \\[boolean\\]',
        ].join('\n'),
      ),
    );
  });

  it('should retrieve the version', async () => {
    const argv = await parser.parseAsync('--version');

    expect(argv).toMatchObject({ version: true });
    expect(mockExit).toHaveBeenCalledWith(0);
    expect(mockLog).toHaveBeenCalledWith(version);
  });
});
