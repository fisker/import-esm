function load(url) {
  return import(url)
}

function check() {
  return Promise.resolve(checkSync())
}

function checkSync() {
  return true
}

load.check = check
load.checkSync = checkSync

export default load
export {check, checkSync}
