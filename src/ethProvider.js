const Eth = require('ethjs')
export default (providerUrl) => {
  return new Eth(new Eth.HttpProvider(providerUrl))
}
