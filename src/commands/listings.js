import _ from 'lodash'
import fs from 'fs'
import { getKittyCore } from '../contracts'
import EthFilter from '../ethfilter/EthFilter'

const kittyCoreAbi = JSON.parse(fs.readFileSync(`build/KittyCore.abi`).toString())

export default async (argv, conf, eth) => {
  const ethFilter = EthFilter(conf.providerUrl)

  const kittyCore = getKittyCore(eth)
  const kittyCoreFilter = ethFilter.contract(conf.kittyCoreAddress, kittyCoreAbi)

  /*
  const evts = await kittyCoreFilter.events({
    // fromBlock: 4605167,
    fromBlock: 4694000,
    toBlock: 4695238,
    name: 'Birth'
  })

  const eventOutputs = _.map(evts, (e) => {
    return `${e.name}(${e.arguments})`
  })
  // eventOutputs.forEach(o => console.log(o))
  */

  const txs = await kittyCoreFilter.transactions({
    // fromBlock: 4605167,
    fromBlock: 4702800,
    toBlock: 4702888,
    name: 'createSaleAuction'
  })
  const fnOutputs = _.map(txs, (t) => {
    return {
      from: t.from,
      name: t.name,
      inputs: t.input.decoded
    }
  })
  const fnStrs = _.map(fnOutputs, (o) => {
    const props = _.filter(_.keys(o.inputs), p => isNaN(parseInt(p)))
    let argPairStrs = []
    _.forEach(props, p => {
      argPairStrs.push(`${p}: ${o.inputs[p]}`)
    })
    return `${o.name}(${argPairStrs.join(', ')}) : ${o.from}`
  })
  _.forEach(fnStrs, s => console.log(s))
}
