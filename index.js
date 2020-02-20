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

function checkLoadedModule() {
  return true
}

function returnFalse() {
  return false
}

function check() {
  if (typeof supported === 'boolean') {
    return Promise.resolve(supported)
  }

  var promise = Promise.resolve(false)

  try {
    promise = importModule(TEST_MODULE).then(checkLoadedModule, returnFalse)
  } catch (_) {}

  return promise.then(function(result) {
    supported = result
    return result
  })
}

function importOrThrow(url, reject) {
  if (supported) {
    return importModule(url)
  }

  const error = new Error('ECMAScript Modules are not supported.')
  // if (reject) {
  //   return Promise.reject(error)
  // }

  throw error
}

function load(url) {
  if (typeof supported === 'boolean') {
    return importOrThrow(url, true)
  }

  return check().then(function() {
    importOrThrow(url)
  })
}

module.exports = load
module.exports.check = check
