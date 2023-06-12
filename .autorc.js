const base = require('@bepower/auto-config').default;

const regenerate = require.resolve('@bepower/auto-config/scripts/regenerate-readme');
console.log(regenerate);

/**
 * @returns {import('@auto-it/core').default}
 */
function config() {
  base.plugins.push(regenerate);

  return base;
}

module.exports = config;
