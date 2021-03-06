// eslint-disable-next-line unicorn/prefer-module
module.exports = (api) => {
  const isTest = api.env('test')
  const modules = isTest ? 'commonjs' : false
  const targets = {}

  if (isTest) {
    targets.node = true
  }

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          modules,
          targets,
        },
      ],
    ],
    plugins: clean([
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-nullish-coalescing-operator',
      [
        'inline-replace-variables',
        {
          __DEV__: {
            type: 'node',
            replacement: "process.env.NODE_ENV !== 'production'",
          },
          __TEST__: {
            type: 'node',
            replacement: "process.env.NODE_ENV === 'test'",
          },
        },
      ],
    ]),
  }
}

function clean(config) {
  return config.filter(Boolean)
}
