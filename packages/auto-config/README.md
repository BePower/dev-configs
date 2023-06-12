# `@bepower/auto-config`

A collection of `auto` config and scripts to ease package deployment

## Default Config

```json
{
  "plugins": [
    "npm",
    "all-contributors",
    [
      "conventional-commits",
      {
        "preset": "angular"
      }
    ],
    "first-time-contributor"
  ]
}
```

## Additional scripts

### `scripts/regenerate-readme.js`

Regenerates the `README.md` file in the root of the project to reflect npm packages under the `packages` folder.

To mark the packages table you have to add `[//]: # 'BEGIN TABLE'

| Package | Install command |
| --- | --- |
| [![\Users\niccolo.olivieri\Projects\dev-configs\packages\auto-config: @bepower/auto-config](https://img.shields.io/badge/\Users\niccolo.olivieri\Projects\dev--configs\packages\auto--config-@bepower/auto-config-brightgreen.svg)](C) | `$ npm install --save-dev \Users\niccolo.olivieri\Projects\dev-configs\packages\auto-config@@bepower/auto-config` |
| [![\Users\niccolo.olivieri\Projects\dev-configs\packages\eslint-plugin: @bepower/eslint-plugin](https://img.shields.io/badge/\Users\niccolo.olivieri\Projects\dev--configs\packages\eslint--plugin-@bepower/eslint-plugin-brightgreen.svg)](C) | `$ npm install --save-dev \Users\niccolo.olivieri\Projects\dev-configs\packages\eslint-plugin@@bepower/eslint-plugin` |
| [![\Users\niccolo.olivieri\Projects\dev-configs\packages\prettier-config: @bepower/prettier-config](https://img.shields.io/badge/\Users\niccolo.olivieri\Projects\dev--configs\packages\prettier--config-@bepower/prettier-config-brightgreen.svg)](C) | `$ npm install --save-dev \Users\niccolo.olivieri\Projects\dev-configs\packages\prettier-config@@bepower/prettier-config` |

[//]: # 'END TABLE'`.
