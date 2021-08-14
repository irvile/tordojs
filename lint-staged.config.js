module.exports = {
  '**/*.ts': () => 'yarn test:types',
  './packages/**/*.(ts|js)': filenames => [
    `yarn lint --fix ${filenames.join(' ')}`,
    `yarn format ${filenames.join(' ')}`,
  ],
  './scripts/**/*.(ts|js)': filenames => [
    `yarn lint --fix ${filenames.join(' ')}`,
    `yarn format ${filenames.join(' ')}`,
  ],
}
