import configFromTs from '../src';

describe('auto config', () => {
  it('should have identical config between ts and package.json', () => {
    expect.assertions(1);

    expect(configFromTs).toEqual({
      shipit: {
        message: 'ci: :memo: Update CHANGELOG.md [skip ci]',
      },
      plugins: [
        'magic-zero',
        'npm',
        [
          'conventional-commits',
          {
            preset: 'angular',
          },
        ],
        'all-contributors',
        'first-time-contributor',
      ],
    });
  });
});
