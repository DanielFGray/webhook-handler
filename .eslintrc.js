module.exports = {
  env: {
    "node": true,
  },
  extends: ["airbnb-base"],
  rules: {
    semi: ['error', 'never'],
    indent: ['error', 2, { flatTernaryExpressions: true }],
    'no-unexpected-multiline': 'error',
    'no-nested-ternary': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'space-unary-ops': ['error', { overrides: { '!': true } }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_$' }],
  }
}
