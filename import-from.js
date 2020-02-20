const path = require('path')
const {pathToFileURL} = require('url')

function importEsmFrom(url, parentModule) {
  if (typeof url === 'string' && url[0] === '.') {
    const directory = parentModule ? path.dirname(parentModule) : process.cwd()
    url = path.join(directory, url)
  }
  if (typeof url === 'string' && !/^(?:data|file):/.test(url)) {
    url = pathToFileURL(url)
  }
  return import(url)
}

module.exports = importEsmFrom
