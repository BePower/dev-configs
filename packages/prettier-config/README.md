# `@bepower/prettier-config`

Opinionated prettier configuration

## Installation

Place a `.npmrc` file in the root of the project:

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@bepower:registry=https://npm.pkg.github.com
```

and then add the `GITHUB_TOKEN` environment variable

Then install the npm package:

```bash
$ npm install --save-dev @bepower/prettier-config
```

## Usage

`.prettierrc.json` or `"prettier"` property inside `package.json`

```json
"@bepower/prettier-config"
```

## Script

`prettier --write "**/*.{js,ts,json,md,yml}"`
