# `@bepower/auto-config`

<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->

[badge-coverage]: https://img.shields.io/badge/coverage-98%25-green.svg

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

To mark the badge you have to add `<!-- COVERAGE-BADGE:START - Do not remove or modify this section -->` and `<!-- COVERAGE-BADGE:END -->`.

### `scripts/add-packages-to-readme.js`

Regenerates the `README.md` file in the root of the project to reflect npm packages under the `packages` folder (or whatever folder you choose).

To mark the badge you have to add `<!-- PACKAGES-TABLE:START - Do not remove or modify this section -->` and `<!-- PACKAGES-TABLE:END -->`.
