const base = require('@bepower/auto-config').default;

/**
 * @returns {import('@auto-it/core').default}
 */
function config() {
  base.plugins.push('./scripts/regenerate-readme.js');

  return base;
}

module.exports = config;
