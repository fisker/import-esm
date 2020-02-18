'use strict'

var assert = require('assert')
// eslint-disable-next-line unicorn/import-index
var importEsm = require('./index')

if (typeof Promise === 'undefined') {
  global.Promise = require('./third-party/lie.min')
}

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

// Make sure global `import` function doesn't effect result
if (supported) {
  global.import = function() {
    return Promise.reject(new Error('Error from `global.import`.'))
  }
} else {
  global.import = function() {
    return Promise.resolve({
      default: 'A fake module from `global.import`.'
    })
  }
}

function isPromise(promise) {
  var toStringTag = Object.prototype.toString.call(promise)
  return (
    typeof promise === 'object' &&
    (toStringTag === '[object Promise]' || toStringTag === '[object Object]') &&
    typeof promise.then === 'function'
  )
}

equal(typeof importEsm, 'function')

var check = importEsm.check()
equal(isPromise(check), true)

check.then(function(result) {
  equal(typeof result, 'boolean')
  equal(result, supported)
})

var load = importEsm('./fixtures/test.mjs')
equal(isPromise(load), true)
equal(typeof load.then, 'function')
if (supported) {
  load.then(function(module) {
    equal(typeof module, 'object')
    equal('default' in module, true)
  })
} else {
  load.then(null, function(error) {
    equal(error instanceof Error, true)
    equal(error.message, 'ECMAScript Modules are not supported.')
  })
}
