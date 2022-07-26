# BePower Code Style

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

This repository contains common configurations for building apps at BePower.

## Usage

This repo is managed as a monorepo that is composed of many npm packages, where each package has its own `README` and documentation describing usage.

### Package Index

[//]: # (BEGIN TABLE)

| Name | Version | Install command |
| --- | --- | --- |
| [eslint-plugin](packages/eslint-plugin) | [![eslint-plugin: 1.0.3](https://img.shields.io/badge/eslint--plugin-1.0.3-brightgreen.svg)](packages/eslint-plugin/package.json) | `$ npm install --save-dev @bepower/eslint-plugin@1.0.3` |
| [prettier-config](packages/prettier-config) | [![prettier-config: 1.0.2](https://img.shields.io/badge/prettier--config-1.0.2-brightgreen.svg)](packages/prettier-config/package.json) | `$ npm install --save-dev @bepower/prettier-config@1.0.2` |

[//]: # (END TABLE)

### Releasing

```bash
$ npx lerna version
```
