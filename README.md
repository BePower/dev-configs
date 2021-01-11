# BePower Code Style

## Files

`.eslintrc.js`

```js
module.exports = {
  extends: ['@bepower/code-style'].map(require.resolve),
  parserOptions: {
    project: './tsconfig.json',
  },
}
```

`.prettierrc` or `"prettier"` property inside `package.json`

```json
"@bepower/code-style/.prettierrc.json"
```

## Scripts

### ESLint

`eslint --fix . --ext .js,.jsx,.ts,.tsx`

### Prettier

`prettier --write "**/*.{js,json,md,yml}"`
