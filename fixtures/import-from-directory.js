const {pathToFileURL} = require('url')
const path = require('path')
const importEsm = require('..')

// module.exports = importEsm(pathToFileURL(path.join(__dirname, './bar.mjs')))
module.exports = importEsm('./bar.mjs')
