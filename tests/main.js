'use strict'

var assert = require('assert')
var importEsm = require('..')

if (typeof Promise === 'undefined') {
  global.Promise = require('./third-party/lie.min.js')
}

var equal = assert.strictEqual || assert.equal
var engine = Number(process.version.slice(1).split('.').shift())

var supported = engine >= 12

// Make sure global `import` function doesn't effect result
if (supported) {
  global.import = function () {
    return Promise.reject(new Error('Error from `global.import`.'))
  }
} else {
  global.import = function () {
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
    require('./fixtures/import-from-directory.js').then(function (module) {
      equal(module.filename, 'bar.mjs')
    }, throwNotFoundModuleError)
    importEsm('./fixtures/non-exists-file.mjs').then(
      undefined,
      function (error) {
        equal(/Cannot find module/.test(error.message), true)
      }
    )
  } else {
    promise.then(undefined, function (error) {
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
