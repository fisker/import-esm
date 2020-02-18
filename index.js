const TEST_MODULE_URL = 'data:text/javascript,'

const check = async () => {
  try {
    // eslint-disable-next-line no-new-func
    await new Function(`return import("${TEST_MODULE_URL}")`)()
    return true
  } catch {}

  return false
}

module.exports = check
