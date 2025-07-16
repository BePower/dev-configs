import { afterEach, beforeEach, describe, expect, it, vi, SpyInstance } from 'vitest';

import { parser } from '../../src/cli/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../package.json');

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
          '  .* config:init  Initializes the dot file and the package.json\\s+script',
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
