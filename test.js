'use strict'

var assert = require('assert')
// eslint-disable-next-line unicorn/import-index
var importMjs = require('./index')

if (typeof Promise === 'undefined') {
  require('es-promise').polyfill()
}

global.import = function() {}

var equal = assert.strictEqual || assert.equal
var isExperimentalModulesFlag = process.execArgv[0] === '--experimental-modules'
var engine = Number(
  process.version
    .slice(1)
    .split('.')
    .shift()
)

var supported = engine >= 13

if (engine === 12 && isExperimentalModulesFlag) {
  supported = true
}

function isPromise(promise) {
  var toStringTag = Object.prototype.toString.call(promise)
  return (
    typeof promise === 'object' &&
    promise.then === 'function' &&
    (toStringTag === '[object Promise]' || toStringTag === '[object Object]')
  )
}

equal(typeof importMjs, 'function')

var check = importMjs.check()
equal(isPromise(check), true)

check.then(function(result) {
  equal(typeof result, 'boolean')
  equal(result, supported)
})

var load = importMjs('./fixtures/test.mjs')
equal(isPromise(load), true)
equal(typeof load.then, 'function')
if (supported) {
  load.then(function(result) {
    equal(typeof result, 'object')
    equal('default' in result, true)
  })
} else {
  load.then(null, function(error) {
    equal(error instanceof Error, true)
    equal(error.message, 'ECMAScript Modules are not supported.')
  })
}
