'use strict'

var TEST_MODULE = 'data:text/javascript,'
var import_
var cached = false
var supported
var UNSUPPORTED_MESSAGE = 'ECMAScript Modules are not supported.'

function importModule(url) {
  if (!import_) {
    import_ = require('./import')
  }
  return import_(url)
}

function returnTrue() {
  return true
}

function returnFalse() {
  return false
}

function cacheResult(result) {
  cached = true
  supported = result
  return result
}

function check() {
  if (cached) {
    return Promise.resolve(supported)
  }

  var promise = Promise.resolve(false)

  try {
    promise = importModule(TEST_MODULE).then(returnTrue, returnFalse)
  } catch (_) {}

  // We don't need wait for cache called
  promise.then(cacheResult)

  return promise
}

function importOrThrow(url, reject) {
  if (supported) {
    return importModule(url)
  }

  var error = new Error(UNSUPPORTED_MESSAGE)

  if (reject) {
    // Always return `Promise`
    return Promise.reject(error)
  }

  throw error
}

function load(url) {
  if (cached) {
    return importOrThrow(url, true)
  }

  return check().then(function tryImportModule() {
    importOrThrow(url)
  })
}

module.exports = load
module.exports.check = check
