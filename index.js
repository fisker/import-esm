'use strict'

var RANDOM_NUMBER = Math.random()
var TEST_MODULE = 'data:text/javascript,export default ' + RANDOM_NUMBER + ';'

function check() {
  try {
    // eslint-disable-next-line no-new-func
    return new Function('return import("' + TEST_MODULE + '")')().then(
      function(module) {
        return module && module.default === RANDOM_NUMBER
      },
      function() {
        return false
      }
    )
  } catch (_) {}

  return Promise.resolve(false)
}

function load(url) {
  return check().then(function(supported) {
    if (supported) {
      return require('./import')(url)
    }

    throw new Error('ECMAScript Modules are not supported.')
  })
}

module.exports = load
module.exports.check = check
