/* eslint-disable unicorn/prefer-module */
module.exports =
  process.env.NODE_ENV === 'production'
    ? require(`./__BUNDLE__.production.js`)
    : require(`./__BUNDLE__.development.js`);
