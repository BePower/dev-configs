import plugin = require('../src');

describe('plugin interface', () => {
  it('should export a plugin', () => {
    expect(plugin).toHaveProperty('configs');
    expect(plugin).toHaveProperty('configs.base');
    expect(plugin).toHaveProperty('configs.cdk');
    expect(plugin).toHaveProperty('configs.node');
    expect(plugin).toHaveProperty('rules', {});
  });
});
