import { bePowerFactory } from '../src';

describe('plugin factory', () => {
  it('should create the default plugin', () => {
    const defaultConfig = bePowerFactory();
    const defaultConfigWithIgnores = bePowerFactory({}, true);
    const defaultConfigWithoutCdk = bePowerFactory({ cdk: false });
    const defaultConfigWithNode = bePowerFactory({ node: true });
    const defaultConfigWithTypescript = bePowerFactory({ typescript: true });
    const defaultConfigWithoutReact = bePowerFactory({ react: false });

    // Check that all configurations return arrays
    expect(Array.isArray(defaultConfig)).toBe(true);
    expect(Array.isArray(defaultConfigWithIgnores)).toBe(true);
    expect(Array.isArray(defaultConfigWithoutCdk)).toBe(true);
    expect(Array.isArray(defaultConfigWithNode)).toBe(true);
    expect(Array.isArray(defaultConfigWithTypescript)).toBe(true);
    expect(Array.isArray(defaultConfigWithoutReact)).toBe(true);

    // Check that all configurations have at least some rules
    expect(defaultConfig.length).toBeGreaterThan(0);
    
    // Check that default configurations are equivalent
    expect(defaultConfig.length).toBe(defaultConfigWithIgnores.length);
    expect(defaultConfig.length).toBe(defaultConfigWithoutCdk.length);
    expect(defaultConfig.length).toBe(defaultConfigWithNode.length);
    expect(defaultConfig.length).toBe(defaultConfigWithTypescript.length);
    expect(defaultConfig.length).toBe(defaultConfigWithoutReact.length);
  });

  it('should create the default plugin without the ignore', () => {
    const defaultConfig = bePowerFactory();
    const configWithoutIgnores = bePowerFactory({}, false);
    
    // Without ignores should have fewer configs
    expect(configWithoutIgnores.length).toBeLessThan(defaultConfig.length);
  });

  it('should create the plugin with cdk', () => {
    const defaultConfig = bePowerFactory();
    const configWithCdk = bePowerFactory({ cdk: true });
    const configWithCdkAndIgnores = bePowerFactory({ cdk: true }, true);
    const configWithCdkWithoutIgnores = bePowerFactory({ cdk: true }, false);
    
    // With CDK should have more configs
    expect(configWithCdk.length).toBeGreaterThan(defaultConfig.length);
    expect(configWithCdkAndIgnores.length).toBe(configWithCdk.length);
    expect(configWithCdkWithoutIgnores.length).toBeLessThan(configWithCdkAndIgnores.length);
  });

  it('should create the plugin without node', () => {
    const defaultConfig = bePowerFactory();
    const configWithoutNode = bePowerFactory({ node: false });
    const configWithoutNodeWithIgnores = bePowerFactory({ node: false }, true);
    const configWithoutNodeWithoutIgnores = bePowerFactory({ node: false }, false);
    
    // Without node should have fewer configs
    expect(configWithoutNode.length).toBeLessThanOrEqual(defaultConfig.length);
    expect(configWithoutNodeWithIgnores.length).toBe(configWithoutNode.length);
    expect(configWithoutNodeWithoutIgnores.length).toBeLessThan(configWithoutNodeWithIgnores.length);
  });

  it('should create the plugin without typescript', () => {
    const defaultConfig = bePowerFactory();
    const configWithoutTypescript = bePowerFactory({ typescript: false });
    const configWithoutTypescriptWithIgnores = bePowerFactory({ typescript: false }, true);
    const configWithoutTypescriptWithoutIgnores = bePowerFactory({ typescript: false }, false);
    
    // Without typescript should have fewer configs
    expect(configWithoutTypescript.length).toBeLessThanOrEqual(defaultConfig.length);
    expect(configWithoutTypescriptWithIgnores.length).toBe(configWithoutTypescript.length);
    expect(configWithoutTypescriptWithoutIgnores.length).toBeLessThan(configWithoutTypescriptWithIgnores.length);
  });

  it('should create the plugin with react', () => {
    const defaultConfig = bePowerFactory();
    const configWithReact = bePowerFactory({ react: true });
    const configWithReactWithIgnores = bePowerFactory({ react: true }, true);
    const configWithReactWithoutIgnores = bePowerFactory({ react: true }, false);
    
    // With react should have more configs
    expect(configWithReact.length).toBeGreaterThanOrEqual(defaultConfig.length);
    expect(configWithReactWithIgnores.length).toBe(configWithReact.length);
    expect(configWithReactWithoutIgnores.length).toBeLessThan(configWithReactWithIgnores.length);
  });
});
