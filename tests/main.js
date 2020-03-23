'use strict'

var assert = require('assert')
// eslint-disable-next-line unicorn/import-index
var importEsm = require('../index')

if (typeof Promise === 'undefined') {
  global.Promise = require('./third-party/lie.min')
}

var equal = assert.strictEqual || assert.equal
var isExperimentalModulesFlag = process.execArgv[0] === '--experimental-modules'
var engine = Number(process.version.slice(1).split('.').shift())

var supported = engine >= 13

if (engine === 12 && isExperimentalModulesFlag) {
  supported = true
}

// Make sure global `import` function doesn't effect result
if (supported) {
  // eslint-disable-next-line es/no-keyword-properties
  global.import = function () {
    return Promise.reject(new Error('Error from `global.import`.'))
  }
} else {
  // eslint-disable-next-line es/no-keyword-properties
  global.import = function () {
    return Promise.resolve({
      // eslint-disable-next-line es/no-keyword-properties
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

function testCheck() {
  var promise
  try {
    promise = importEsm.check()
  } catch (error) {
    console.log('`importEsm.check()` should never throws')
    console.error(error)
    process.exit(1)
  }

  equal(isPromise(promise), true)

  promise.then(function (result) {
    equal(typeof result, 'boolean')
    equal(result, supported)
  })
}

function testLoad() {
  var promise
  try {
    promise = importEsm('./fixtures/foo.mjs')
  } catch (error) {
    console.log('`importEsm()` should never throws')
    console.error(error)
    process.exit(1)
  }

  equal(isPromise(promise), true)
  if (supported) {
    promise.then(function (module) {
      equal(Object.prototype.toString.call(module), '[object Module]')
      equal(module.filename, 'foo.mjs')
    })
    importEsm('./fixtures/commonjs-package/index.mjs').then(function (module) {
      equal(module.packageName, 'commonjs-package')
    }, throwNotFoundModuleError)
    importEsm('./fixtures/module-package/index.mjs').then(function (module) {
      equal(module.packageName, 'module-package')
    }, throwNotFoundModuleError)
    require('./fixtures/import-from-directory').then(function (module) {
      equal(module.filename, 'bar.mjs')
    }, throwNotFoundModuleError)
    importEsm('./fixtures/non-exists-file.mjs').then(null, function (error) {
      equal(/Cannot find module/.test(error.message), true)
    })
  } else {
    promise.then(null, function (error) {
      equal(error instanceof Error, true)
      equal(error.message, 'ECMAScript Modules are not supported.')
    })
  }
}

function throwNotFoundModuleError(error) {
  console.log('Should find module')
  console.error(error)
  process.exit(1)
}

equal(typeof importEsm, 'function')
equal(typeof importEsm.check, 'function')
equal(typeof importEsm.checkSync, 'function')

equal(importEsm.checkSync(), '')

testLoad()
testCheck()

// Make sure still returns `Promise` when result is already cached
// eslint-disable-next-line es/no-keyword-properties
importEsm
  .check()
  .then(function () {
    equal(importEsm.checkSync(), supported)
  })
  .then(testCheck)
  .catch(function (error) {
    console.log('`testCheck` should never throws')
    console.error(error)
    process.exit(1)
  })
  .then(testLoad)
  .catch(function (error) {
    console.log('`testLoad` should never throws')
    console.error(error)
    process.exit(1)
  })
