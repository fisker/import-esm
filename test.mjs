import {strictEqual} from 'assert'
import importEsm, {check, checkSync} from './index.mjs'

function isPromise(promise) {
  const toStringTag = Object.prototype.toString.call(promise)
  return (
    typeof promise === 'object' &&
    (toStringTag === '[object Promise]' || toStringTag === '[object Object]') &&
    typeof promise.then === 'function'
  )
}

function testCheck() {
  let promise
  try {
    promise = importEsm.check()
  } catch (error) {
    console.log('`importEsm.check()` should never throws')
    console.error(error)
    process.exit(1)
  }

  strictEqual(isPromise(promise), true)

  promise.then(function(result) {
    strictEqual(typeof result, 'boolean')
    strictEqual(result, true)
  })
}

function testLoad() {
  let promise
  try {
    promise = importEsm('./fixtures/foo.mjs')
  } catch (error) {
    console.log('`importEsm()` should never throws')
    console.error(error)
    process.exit(1)
  }

  strictEqual(isPromise(promise), true)

  promise.then(function(module) {
    strictEqual(typeof module, 'object')
    strictEqual('default' in module, true)
    strictEqual(module.name, 'foo')
  })
  importEsm('./fixtures/commonjs-package/name.mjs').then(function(module) {
    strictEqual(module.name, 'commonjs-package')
  })
  importEsm('./fixtures/module-package/name.mjs').then(function(module) {
    strictEqual(module.name, 'module-package')
  })
}

strictEqual(typeof importEsm, 'function')
strictEqual(typeof importEsm.check, 'function')
strictEqual(typeof importEsm.checkSync, 'function')
strictEqual(importEsm.check, check)
strictEqual(importEsm.checkSync, checkSync)

strictEqual(importEsm.checkSync(), true)

testLoad()
testCheck()

// Make sure still returns `Promise` when result is already cached
importEsm
  .check()
  .then(function() {
    strictEqual(importEsm.checkSync(), true)
    testCheck()
    testLoad()
  })
  .catch(function() {
    console.log('`testLoad` should never throws')
    process.exit(1)
  })
