const assert = require('assert')
const isEsmSupported = require('.')

global.import = function() {}

const equal = assert.strictEqual || assert.equal
const isExperimentalModulesFlag =
  process.execArgv[0] === '--experimental-modules'
const engine = Number(
  process.version
    .slice(1)
    .split('.')
    .shift()
)

let expectResult = engine >= 13

if (engine === 12 && isExperimentalModulesFlag) {
  expectResult = true
}

equal(typeof isEsmSupported, 'function')

const check = isEsmSupported()
equal(typeof check, 'object')
// equal(Object.prototype.toString.call(check), '[object Promise]')
equal(typeof check.then, 'function')

check.then(function(result) {
  equal(typeof result, 'boolean')
  equal(result, expectResult)
})
