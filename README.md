# BePower Code Style

## Files

`.eslintrc.json` or `eslintConfig` property inside `package.json`

```json
{
  "extends": "@bepower/code-style",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

`.prettierrc.json` or `"prettier"` property inside `package.json`

```json
"@bepower/code-style/.prettierrc.json"
```

## Scripts

### ESLint

`eslint --fix . --ext .js,.jsx,.ts,.tsx`

### Prettier

`prettier --write "**/*.{js,ts,json,md,yml}"`
