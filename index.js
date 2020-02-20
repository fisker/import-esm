'use strict'

var TEST_MODULE = 'data:text/javascript,'
var supported = ''
var UNSUPPORTED_MESSAGE = 'ECMAScript Modules are not supported.'

function returnTrue() {
  return true
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
    promise = require('./import')(TEST_MODULE).then(returnTrue, returnFalse)
  } catch (_) {}

  // We don't need wait for cache called
  promise.then(cacheResult)

  return promise
}

function checkSync() {
  return supported
}

function importOrThrow(url, parentModule, reject) {
  if (supported) {
    return require('./import-from')(url, parentModule)
  }

  var error = new Error(UNSUPPORTED_MESSAGE)

  if (reject) {
    // Always return `Promise`
    return Promise.reject(error)
  }

  throw error
}

function load(url) {
  var parentModule = require('parent-module')()
  if (supported !== '') {
    return importOrThrow(url, parentModule, true)
  }

  return check().then(function tryImportModule() {
    return importOrThrow(url, parentModule)
  })
}

module.exports = load
module.exports.check = check
module.exports.checkSync = checkSync
