/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['packages/*/src/**/*', '!**/.autorc.js', '!**/cli.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'json-summary', 'lcov', 'text', 'text-summary'],
};
