const base = require('@bepower/auto-config').default;

/* add-packages-to-readme:start */
const packages = require.resolve('@bepower/auto-config/scripts/add-packages-to-readme');
/* add-packages-to-readme:stop */
/* add-coverage-to-readme:start */
const coverage = require.resolve('@bepower/auto-config/scripts/add-coverage-to-readme');
/**
 * @type {import('@bepower/auto-config/scripts/add-coverage-to-readme').AddCoverageToReadmePluginOptions}
 */
const coverageOptions = {
  badgeTemplate: '[badge-coverage]: https://img.shields.io/badge/coverage-{PERC}%25-{COLOR}.svg',
};
/* add-coverage-to-readme:stop */

/**
 * @returns {import('@auto-it/core').default}
 */
function config() {
  /* add-packages-to-readme:start */
  base.plugins.push(packages);
  /* add-packages-to-readme:stop */
  /* add-coverage-to-readme:start */
  base.plugins.push([coverage, coverageOptions]);
  /* add-coverage-to-readme:stop */

  return base;
}

module.exports = config;
