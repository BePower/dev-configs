# `@bepower/eslint-plugin`

Opinionated eslint configuration based on [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## Installation

Place a `.npmrc` file in the root of the project:

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@bepower:registry=https://npm.pkg.github.com
```

and then add the `GITHUB_TOKEN` environment variable

Then install the npm package:

```bash
$ npm install --save-dev @bepower/eslint-plugin
```

## Usage

Create an `eslint.config.js` file in the root of your project:

```js
import { bePowerFactory } from '@bepower/eslint-plugin';

export default [
  ...bePowerFactory({
    // Options (all default to these values except cdk)
    cdk: false,      // Set to true for AWS CDK projects
    node: true,      // Node.js environment
    typescript: true, // TypeScript support
    react: false,    // React support
  }),
  // Add your custom configurations here
];
```

### Quick Setup

You can also use the CLI to generate a basic configuration:

```bash
$ npx @bepower/eslint-plugin config:init
```

## Features

- Based on [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- Uses the new ESLint flat config format
- Includes sensible defaults for TypeScript and Node.js projects
- Optional support for React and AWS CDK projects
- Stylistic rules with semicolons and 1tbs brace style

## Script

```bash
$ eslint --fix .
```
