import { readFileSync } from 'fs';
import { join } from 'path';

import { parser } from '../../src/cli/index';

const packageStr = readFileSync(join(__dirname, '../../package.json'), 'utf8');
const { version } = JSON.parse(packageStr);

describe('cli', () => {
  let mockExit: jest.SpyInstance;
  let mockLog: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
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
