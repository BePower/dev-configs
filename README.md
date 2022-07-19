# BePower Code Style

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

This repository contains common configurations for building apps at BePower.

## Usage

This repo is managed as a monorepo that is composed of many npm packages, where each package has its own `README` and documentation describing usage.

### Package Index

| Name                                                |
| --------------------------------------------------- | 
| [eslint-plugin](packages/eslint-plugin)             |
| [prettier-config](packages/prettier-config)         |

### Releasing

```bash
$ npx lerna version --conventional-commits <semver increment>
```
