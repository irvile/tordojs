module.exports = {
  '**/*.ts': () => 'yarn test:types',
  '**/*.(ts|js)': filenames => [`yarn lint --fix ${filenames.join(' ')}`, `yarn format ${filenames.join(' ')}`],
}
