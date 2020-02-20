'use strict'

var TEST_MODULE = 'data:text/javascript,'
var import_
var supported

function importModule(url) {
  if (!import_) {
    import_ = require('./import')
  }
  return import_(url)
}

function check() {
  if (typeof supported === 'boolean') {
    return Promise.resolve(supported)
  }
  try {
    return importModule(TEST_MODULE).then(
      function() {
        supported = true
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

function importOrThrow(url) {
  if (supported) {
    return importModule(url)
  }

  throw new Error('ECMAScript Modules are not supported.')
}

function load(url) {
  if (typeof supported === 'boolean') {
    return importOrThrow(url)
  }

  return check().then(function() {
    importOrThrow(url)
  })
}

module.exports = load
module.exports.check = check
