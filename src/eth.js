const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'))
export default eth
