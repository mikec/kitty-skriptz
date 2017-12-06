const HTTPProvider = require('ethjs-provider-http')
const ethdeployBase = require('./base.config.js')

module.exports = ethdeployBase({
  name: 'testrpc',
  provider: new HTTPProvider('http://localhost:8546'),
  defaultTxObject: {
    from: 0,
    gas: 4000000
  }
})
