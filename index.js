const TEST_MODULE_URL = 'data:text/javascript,'

const check = async () => {
  try {
    await import(TEST_MODULE_URL)
    return true
  } catch {}

  return false
}

module.exports = check
