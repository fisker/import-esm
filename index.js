'use strict'

var TEST_MODULE = 'data:text/javascript,'
var import_

function importModule(url) {
  if (!import_) {
    import_ = require('./import')
  }
  return import_(url)
}

function check() {
  try {
    return importModule(TEST_MODULE).then(
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
      return importModule(url)
    }

    throw new Error('ECMAScript Modules are not supported.')
  })
}

module.exports = load
module.exports.check = check
