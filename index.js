'use strict'

var TEST_MODULE = 'data:text/javascript,'

function check() {
  try {
    return require('./import')(TEST_MODULE).then(
      function() {
        return true
      },
      function() {
        return false
      }
    )
  } catch (_) {}

  /* istanbul ignore next */
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
