import { execSync } from 'child_process';
import { join } from 'path';

function configFile(name: string) {
  return join(__dirname, '..', 'lib', 'config', `${name}.js`);
}

function fixtureFile(fixture: string) {
  return join(__dirname, 'fixtures', fixture);
}

const eslintIgnorePath = join(__dirname, 'fixtures', '.eslintignore');

export function execEslint(config: string, fixture?: string) {
  try {
    const args = [
      'npx',
      'eslint',
      '--no-eslintrc', // we need to disable to default config
      '--ignore-path',
      eslintIgnorePath, // we need to move the focus elsewhere
      '--config',
      configFile(config),
      fixtureFile(fixture ?? config),
    ];
    return execSync(args.join(' ')).toString();
  } catch (error: any) {
    if (error.stdout) {
      return error.stdout.toString();
    }

    throw error;
  }
}
