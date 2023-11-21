import { readFileSync } from 'fs';
import { join } from 'path';

import { ESLint } from 'eslint';

import { cdk, node } from '../../src/configs';

describe('config', () => {
  let eslint: ESLint;
  let text: string;

  describe('node', () => {
    beforeEach(() => {
      eslint = new ESLint({ baseConfig: node });
      text = readFileSync(join(__dirname, '../fixtures/node.ts'), 'utf8');
    });

    it('should validate', async () => {
      const results = await eslint.lintText(text);

      expect(results).toHaveLength(1);
      expect(results[0].messages).toHaveLength(2);
      expect(results).toHaveProperty('0.messages.0.ruleId', 'import/no-anonymous-default-export');
      expect(results).toHaveProperty(
        '0.messages.0.message',
        'Assign object to a variable before exporting as module default',
      );
      expect(results).toHaveProperty('0.messages.1.ruleId', 'no-new');
      expect(results).toHaveProperty('0.messages.1.message', "Do not use 'new' for side effects.");
    });
  });

  describe('cdk', () => {
    beforeEach(() => {
      eslint = new ESLint({ baseConfig: node, overrideConfig: cdk });
      text = readFileSync(join(__dirname, '../fixtures/node.ts'), 'utf8');
    });

    it('should validate', async () => {
      const results = await eslint.lintText(text);

      expect(results).toHaveLength(1);
      expect(results[0].messages).toHaveLength(1);
      expect(results).toHaveProperty('0.messages.0.ruleId', 'import/no-anonymous-default-export');
      expect(results).toHaveProperty(
        '0.messages.0.message',
        'Assign object to a variable before exporting as module default',
      );
    });
  });
});
