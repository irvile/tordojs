/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/prefer-module */

function wrapWarningInDevelopmentCheck(babel) {
  const babelTypes = babel.types;

  const DEV_EXPRESSION = babelTypes.identifier('__DEV__');
  const SEEN_SYMBOL = Symbol('expression.seen');
  const IDENTIFIER_NAME = 'warn';

  return {
    visitor: {
      CallExpression: {
        exit(path) {
          const node = path.node;

          if (node[SEEN_SYMBOL]) {
            return;
          }

          if (path.get('callee').isIdentifier({ name: IDENTIFIER_NAME })) {
            node[SEEN_SYMBOL] = true;

            path.replaceWith(t.ifStatement(DEV_EXPRESSION, t.blockStatement([t.expressionStatement(node)])));
          }
        },
      },
    },
  };
}

module.exports = wrapWarningInDevelopmentCheck;
