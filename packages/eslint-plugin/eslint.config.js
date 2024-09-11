module.exports = [
  {
    rules: {
      'node/shebang': [
        'error',
        {
          convertPath: {
            'src/**/*.ts': ['^src/(.+?)\\.ts$', 'dist/$1.js'],
          },
        },
      ],
    },
  },
];
