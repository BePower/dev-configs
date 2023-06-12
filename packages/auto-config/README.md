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

To mark the packages table you have to add `[//]: # 'BEGIN TABLE'` and `[//]: # 'END TABLE'`.
