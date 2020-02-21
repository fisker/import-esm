/*!
 * config file for `prettier`
 *
 * update: wget -O prettier.config.js https://git.io/fjVjd
 * document: https://prettier.io/docs/en/options.html
 */

module.exports = require('@fisker/prettier-config').extend({
  overrides: [
    {
      files: ['index.js', 'import.js', 'tests/main.js'],
      options: {trailingComma: 'none'},
    },
  ],
})
