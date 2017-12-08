import Eth from 'ethjs'
import eventsFn from './eventsFn'
import transactionsFn from './transactionsFn'
import abiObject from './abiObject'

const contractFn = (eth) => {
  return (address, abiJSON) => {
    const abi = abiObject(abiJSON)
    return {
      events: eventsFn(eth, address, abi),
      transactions: transactionsFn(eth, address, abi)
    }
  }
}

export default (providerUrl) => {
  const eth = new Eth(new Eth.HttpProvider(providerUrl))
  return {
    contract: contractFn(eth)
  }
}
