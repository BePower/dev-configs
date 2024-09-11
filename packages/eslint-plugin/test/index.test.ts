import * as plugin from '../src';

describe('plugin interface', () => {
  it('should export a plugin', () => {
    expect(plugin).toHaveProperty('configs');
    expect(plugin).toHaveProperty('configs.cdk');
    expect(plugin).toHaveProperty('configs.node');
    expect(plugin).toHaveProperty('configs.react');
    expect(plugin).toHaveProperty('rules', {});
  });
});
