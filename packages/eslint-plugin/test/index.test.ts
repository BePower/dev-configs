import { bePowerFactory } from '../src';

describe('plugin factory', () => {
  it('should create the default plugin', () => {
    const setOfRules = 12;

    expect(bePowerFactory()).toHaveLength(setOfRules);
    expect(bePowerFactory({}, true)).toHaveLength(setOfRules);
    expect(bePowerFactory({ cdk: false })).toHaveLength(setOfRules);
    expect(bePowerFactory({ node: true })).toHaveLength(setOfRules);
    expect(bePowerFactory({ typescript: true })).toHaveLength(setOfRules);
    expect(bePowerFactory({ react: false })).toHaveLength(setOfRules);
  });

  it('should create the default plugin without the ignore', () => {
    expect(bePowerFactory({}, false)).toHaveLength(11);
  });

  it('should create the plugin with cdk', () => {
    expect(bePowerFactory({ cdk: true })).toHaveLength(14);
    expect(bePowerFactory({ cdk: true }, true)).toHaveLength(14);
    expect(bePowerFactory({ cdk: true }, false)).toHaveLength(12);
  });

  it('should create the plugin without node', () => {
    expect(bePowerFactory({ node: false })).toHaveLength(11);
    expect(bePowerFactory({ node: false }, true)).toHaveLength(11);
    expect(bePowerFactory({ node: false }, false)).toHaveLength(10);
  });

  it('should create the plugin without typescript', () => {
    expect(bePowerFactory({ typescript: false })).toHaveLength(6);
    expect(bePowerFactory({ typescript: false }, true)).toHaveLength(6);
    expect(bePowerFactory({ typescript: false }, false)).toHaveLength(5);
  });

  it('should create the plugin with react', () => {
    expect(bePowerFactory({ react: true })).toHaveLength(15);
    expect(bePowerFactory({ react: true }, true)).toHaveLength(15);
    expect(bePowerFactory({ react: true }, false)).toHaveLength(14);
  });
});
