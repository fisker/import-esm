'use strict'

var RANDOM_NUMBER = Math.random()
var TEST_MODULE =
  'data:text/javascript,export const number = ' + RANDOM_NUMBER + ';'
var import_
var supported = ''
var UNSUPPORTED_MESSAGE = 'ECMAScript Modules are not supported.'

function importModule(url) {
  if (!import_) {
    import_ = require('./import')
  }
  return import_(url)
}

function checkModule(module) {
  return module && module.number === RANDOM_NUMBER
}

function returnFalse() {
  return false
}

function cacheResult(result) {
  supported = result
  return result
}

function check() {
  if (supported !== '') {
    return Promise.resolve(supported)
  }

  var promise = Promise.resolve(false)

  try {
    promise = importModule(TEST_MODULE).then(checkModule, returnFalse)
  } catch (_) {}

  // We don't need wait for cache called
  promise.then(cacheResult)

  return promise
}

function checkSync() {
  return supported
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
  if (supported !== '') {
    return importOrThrow(url, true)
  }

  return check().then(function tryImportModule() {
    return importOrThrow(url)
  })
}

module.exports = load
module.exports.check = check
module.exports.checkSync = checkSync
