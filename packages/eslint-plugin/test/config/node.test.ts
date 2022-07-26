import { execEslint } from '../utilities';

describe('config', () => {
  describe('node', () => {
    it('validates against the core rules', () => {
      const result = execEslint('node');

      expect(result).toMatch('2 problems (2 errors, 0 warnings)');
      expect(result).toMatch(
        '0:1  error  This rule requires the `strictNullChecks` compiler option to be turned on to function correctly  @typescript-eslint/no-unnecessary-condition',
      );
      expect(result).toMatch(
        '1:1  error  Assign object to a variable before exporting as module default                                   import/no-anonymous-default-export',
      );
    });
  });
});
