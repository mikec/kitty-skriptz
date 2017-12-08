// import { getKittyCore } from '../contracts'
import fs from 'fs'
// import Eth from 'ethjs'
import EthFilter from '../ethfilter/EthFilter'

const kittyCoreAbi = JSON.parse(fs.readFileSync(`build/KittyCore.abi`).toString())

export default async (argv, conf, eth) => {
  const ethFilter = EthFilter(conf.providerUrl)

  const kittyCoreFilter = ethFilter.contract(conf.kittyCoreAddress, kittyCoreAbi)
  const birthEvents = await kittyCoreFilter.events({
    fromBlock: 4688289,
    toBlock: 4688290,
    name: 'Birth'
  })
  console.log(birthEvents)
}
