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
  plugins: [],
  globals: {},
  overrides: [
    {
      files: '{index,import,test}.js',
      rules: {
        'no-var': 'off',
        strict: 'off',
        'object-shorthand': 'off',
      },
    },
    {
      files: 'test.js',
      rules: {
        'unicorn/no-process-exit': 'off',
      },
    },
  ],
}
