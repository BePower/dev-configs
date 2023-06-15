const base = require('@bepower/auto-config').default;

const regenerate = require.resolve('@bepower/auto-config/scripts/regenerate-readme');
const coverage = require.resolve('@bepower/auto-config/scripts/add-coverage-to-readme');

/**
 * @returns {import('@auto-it/core').default}
 */
function config() {
  // base.plugins.push(regenerate);
  // base.plugins.push(coverage);

  return base;
}

module.exports = config;
