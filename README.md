# BePower Code Style

## Files

`.eslintrc.json` or `"eslintConfig"` property inside `package.json`

```json
{
  "extends": ["@bepower/code-style"],
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

`.prettierrc` or `"prettier"` property inside `package.json`

```json
"@bepower/code-style/prettier"
```

## Scripts

### ESLint

`eslint --fix . --ext .js,.jsx,.ts,.tsx`

### Prettier

`prettier --write "**/*.{js,json,md,yml}"`
