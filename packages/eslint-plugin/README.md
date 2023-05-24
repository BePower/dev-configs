# `@bepower/eslint-plugin`

Opinionated eslint configuration

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

`.eslintrc.json` or `"eslintConfig"` property inside `package.json`

```json
{
  "extends": "plugin:@bepower/node",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

## Script

`eslint --fix . --ext .js,.jsx,.ts,.tsx`
