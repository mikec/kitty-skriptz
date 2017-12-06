// import { getKittyCore } from '../contracts'
import Eth from 'ethjs'

export default async (_, conf, eth) => {
  // const block = await eth.getBlockByNumber(4683827, true)
  // console.log(block)

  const logs = await eth.getLogs({
    fromBlock: new Eth.BN('4683827'),
    toBlock: new Eth.BN('4683827'),
    address: conf.kittyCoreAddress,
    topics: [null]
  })
  console.log(logs)
  console.log('')
}
