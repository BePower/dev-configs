const { execSync } = require('child_process');
const { join } = require('path');

function configFile(name) {
  return join(__dirname, '..', 'lib', 'config', `${name}.js`);
}

function fixtureFile(fixture) {
  return join(__dirname, 'fixtures', fixture);
}

const eslintIgnorePath = join(__dirname, 'fixtures', '.eslintignore');

exports.execEslint = (config, fixture) => {
  try {
    const args = [
      'npx',
      'eslint',
      '--no-eslintrc', // we need to disable to default config
      '--ignore-path',
      eslintIgnorePath, // we need to move the focus elsewhere
      '--config',
      configFile(config),
      fixtureFile(fixture || config),
    ];
    return execSync(args.join(' ')).toString();
  } catch (error) {
    if (error.stdout) {
      return error.stdout.toString();
    }

    throw error;
  }
}
