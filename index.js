var TEST_MODULE_URL = 'data:text/javascript,'

var resolve =
  typeof Promise === 'undefined'
    ? Promise.resolve()
    : function(value) {
        return {
          then() {
            return value
          },
        }
      }

function check() {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`return import("${TEST_MODULE_URL}")`)().then(
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
