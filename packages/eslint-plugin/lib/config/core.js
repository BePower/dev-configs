module.exports = {
  plugins: [
    '@bepower',
  ],
  extends: [
    'plugin:@shopify/typescript',
    'plugin:@shopify/typescript-type-checking',
    'plugin:@shopify/prettier',
    'plugin:@shopify/node',
  ],
  rules: {
    'prettier/prettier': 'warn',
  },
};
