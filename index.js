'use strict'

var resolve =
  typeof Promise !== 'undefined'
    ? Promise.resolve.bind(Promise)
    : function(value) {
        return {
          // eslint-disable-next-line object-shorthand
          then: function(resolve) {
            resolve(value)
          }
        }
      }

function check() {
  try {
    // eslint-disable-next-line no-new-func
    return new Function('return import("data:text/javascript,")')().then(
      function() {
        return resolve(true)
      },
      function() {
        return resolve(false)
      }
    )
  } catch (_) {}
  return resolve(false)
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
