/*!
 * config file for `eslint`
 *
 * update: wget -O .eslintrc.js https://git.io/fjVjK
 * document: https://eslint.org/docs/user-guide/configuring
 */

/* @fisker/eslint-config https://git.io/fjOeH */

module.exports = {
  root: true,
  env: {},
  parserOptions: {},
  extends: ['@fisker'],
  settings: {},
  plugins: ['es'],
  globals: {},
  rules: {strict: 'off'},
  overrides: [
    {
      files: ['index.js', 'import.js', 'tests/main.js'],
      rules: {
        'no-var': 'off',
        strict: 'off',
        'object-shorthand': 'off',
        'es/no-promise': 'off',
        'prefer-template': 'off',
        'prefer-destructuring': 'off',
        'unicorn/no-process-exit': 'off',
        'unicorn/prefer-optional-catch-binding': 'off',
      },
    },
  ],
}
