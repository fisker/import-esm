'use strict'

var assert = require('assert')
// eslint-disable-next-line unicorn/import-index
var importMjs = require('./index')

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

equal(typeof importMjs, 'function')

var check = importMjs.check()
equal(typeof check, 'object')
// equal(Object.prototype.toString.call(check), '[object Promise]')
equal(typeof check.then, 'function')

check.then(function(result) {
  equal(typeof result, 'boolean')
  equal(result, supported)
})

var load = importMjs('./fixtures/test.mjs')
equal(typeof load, 'object')
equal(Object.prototype.toString.call(load), '[object Promise]')
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
