import configFromTs from '../src';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');

const { auto: config } = packageJson;

describe('auto config', () => {
  it('should have identical config between ts and package.json', () => {
    expect.assertions(1);

    expect(configFromTs).toEqual(config);
  });
});
