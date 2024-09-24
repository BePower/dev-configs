import factory from '../src';

describe('plugin factory', () => {
  it('should create the default plugin', () => {
    const setOfRules = 10;

    expect(factory()).toHaveLength(setOfRules);
    expect(factory({ node: true })).toHaveLength(setOfRules);
    expect(factory({ typescript: true })).toHaveLength(setOfRules);
    expect(factory({ react: false })).toHaveLength(setOfRules);
  });

  it('should create the plugin without node', () => {
    const config = factory({ node: false });

    expect(config).toHaveLength(9);
  });

  it('should create the plugin without typescript', () => {
    const config = factory({ typescript: false });

    expect(config).toHaveLength(5);
  });

  it('should create the plugin with react', () => {
    const config = factory({ react: true });

    expect(config).toHaveLength(13);
  });
});
