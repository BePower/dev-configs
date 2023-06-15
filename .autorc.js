const base = require('@bepower/auto-config').default;

const packages = require.resolve('@bepower/auto-config/scripts/add-packages-to-readme');
const coverage = require.resolve('@bepower/auto-config/scripts/add-coverage-to-readme');

/**
 * @returns {import('@auto-it/core').default}
 */
function config() {
  base.plugins.push(packages);
  base.plugins.push(coverage);

  return base;
}

module.exports = config;
