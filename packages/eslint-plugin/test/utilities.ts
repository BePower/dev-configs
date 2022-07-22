import { execSync }  from 'child_process';
import { join } from 'path';

function configFile(name: string): string {
  return join(__dirname, '..', 'dist', 'configs', `${name}.js`);
}

function fixtureFile(fixture: string): string {
  return join(__dirname, 'fixtures', fixture);
}

function fixtureConfigFile(fixture: string): string {
  return join(fixtureFile(fixture), '.eslintrc.js');
}

const eslintIgnorePath = join(__dirname, 'fixtures', '.eslintignore');

export function execEslint (config: string, fixture?: string) {
  try {
    const args = [
      'npx',
      'eslint',
      '--no-eslintrc', // we need to disable to default config
      '--ignore-path',
      eslintIgnorePath, // we need to move the focus elsewhere
      '--config',
      fixtureConfigFile(config),
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
