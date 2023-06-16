const base = require('@bepower/auto-config').default;

const packages = require.resolve('@bepower/auto-config/scripts/add-packages-to-readme');

const coverage = require.resolve('@bepower/auto-config/scripts/add-coverage-to-readme');
/**
 * @type {import('@bepower/auto-config/scripts/add-coverage-to-readme').AddCoverageToReadmePluginOptions}
 */
const coverageOptions = {
  badgeTemplate: '[badge-coverage]: https://img.shields.io/badge/coverage-{PERC}%25-{COLOR}.svg',
};

/**
 * @returns {import('@auto-it/core').default}
 */
function config() {
  base.plugins.push(packages);
  base.plugins.push([coverage, coverageOptions]);

  return base;
}

module.exports = config;
