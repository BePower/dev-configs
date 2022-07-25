import { execEslint } from '../utilities';

describe('config', () => {
  describe('node', () => {
    it('validates against the core rules', () => {
      const result = execEslint('node');

      expect(result).toMatch('3 problems (2 errors, 1 warning)');
      expect(result).toMatch('1:20  warning  Insert `;`  prettier/prettier');
      expect(result).toMatch(
        '0:1  error  This rule requires the `strictNullChecks` compiler option to be turned on to function correctly  @typescript-eslint/no-unnecessary-condition',
      );
      expect(result).toMatch(
        '1:1  error  Assign object to a variable before exporting as module default                                   import/no-anonymous-default-export',
      );
    });
  });
});
