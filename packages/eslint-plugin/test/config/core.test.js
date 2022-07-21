const { execEslint } = require('../utilities');

describe('config', () => {
  describe('core', () => {
    it('validates against the core rules', () => {
      expect(execEslint('core')).toBe('');
    });
  });
});
