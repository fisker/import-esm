'use strict'

function check() {
  try {
    // eslint-disable-next-line no-new-func
    return new Function('return import("data:text/javascript,")')().then(
      function() {
        return true
      },
      function() {
        return false
      }
    )
  } catch (_) {}
  return Promise.resolve(false)
}

function load(file) {
  return check().then(function(supported) {
    if (supported) {
      return require('./import')(file)
    }

    throw new Error('ECMAScript Modules are not supported.')
  })
}

load.check = check

module.exports = load
