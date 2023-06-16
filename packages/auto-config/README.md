# `@bepower/auto-config`

<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->

![coverage: 100%](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

<!-- COVERAGE-BADGE:END -->

![Coverage][badge-coverage]

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

### `scripts/add-coverage-to-readme.js`

Regenerates the `README.md` file in every package to add the coverage badge, if present.

To mark the badge you have to add `[//]: # 'BEGIN BADGE'` `[//]: # 'END BADGE'`.

### `scripts/regenerate-readme.js`

Regenerates the `README.md` file in the root of the project to reflect npm packages under the `packages` folder.

To mark the packages table you have to add `[//]: # 'BEGIN TABLE'` `[//]: # 'END TABLE'`.
