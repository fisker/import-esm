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
  overrides: [
    {
      files: '{index,import,test}.js',
      extends: [
        'plugin:es/no-2019',
        'plugin:es/no-2018',
        'plugin:es/no-2017',
        'plugin:es/no-2016',
        'plugin:es/no-2015',
        'plugin:es/no-5',
      ],
      rules: {
        'no-var': 'off',
        strict: 'off',
        'object-shorthand': 'off',
        'es/no-promise': 'off',
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
