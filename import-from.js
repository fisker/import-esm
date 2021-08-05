const path = require('path')
const process = require('process')
const {pathToFileURL} = require('url')

function importFrom(url, from) {
  if (typeof url === 'string' && !path.isAbsolute(url)) {
    const directory = from ? path.dirname(from) : process.cwd()
    url = path.join(directory, url)
  }
  if (typeof url === 'string' && !/^(?:data|file):/.test(url)) {
    url = pathToFileURL(url)
  }
  return import(url)
}

module.exports = importFrom
