/* eslint-disable @typescript-eslint/naming-convention */
import { check } from 'prettier';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../index.json');

config.parser = 'babel-ts';

const tests = {
  printWidth: {
    'a + b;\n': true,
    'a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b;\n':
      true,
    'a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b + a + b;\n':
      false,
    'a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b +\n  a +\n  b;\n':
      true,
    'if (true) {\n  console.log(3);\n}\n': true,
    'if (true) {\n console.log(4);\n}\n': false,
    'if (true) {\n\tconsole.log(5);\n}\n': false,
    'a + b\n': false,
    "if (true) {\n  console.log('a');\n}\n": true,
    'if (true) {\n  console.log("b");\n}\n': false,
    "const a = { a: 2, 'a-1': 1 };\n": true,
    "const a = { 'a': 2, 'a-1': 1 };\n": false,
    'const a = {\n  a: 2,\n  b: 3,\n};\n': true,
    'const a = {\n  a: 2,\n  b: 3\n};\n': false,
    'const a = { a: 2 };\n': true,
    'const a = {a: 2};\n': false,
    '[].map((a) => 2);\n': true,
    '[].map(a => 2);\n': false,
  },
};

describe('prettier', () => {
  Object.entries(tests).forEach(([rule, value]) => {
    describe(rule, () => {
      Object.entries(value).forEach(([testString, result]) => {
        test(testString, async () => {
          expect.assertions(1);

          await expect(check(testString, config)).resolves.toBe(result);
        });
      });
    });
  });
});
