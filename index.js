'use strict'

var resolve =
  typeof Promise === 'undefined'
    ? Promise.resolve()
    : function(value) {
        return {
          // eslint-disable-next-line object-shorthand
          then: function() {
            return value
          },
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

module.exports = check
