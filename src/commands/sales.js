import _ from 'lodash'
import fs from 'fs'
import EthFilter from '../ethfilter/EthFilter'

const saleClockAuctionAbi = JSON.parse(fs.readFileSync(`build/SaleClockAuction.abi`).toString())

export default async (argv, conf, eth) => {
  const ethFilter = EthFilter(conf.providerUrl)
  const saleClockAuctionFilter = ethFilter.contract(conf.saleClockAuctionAddress, saleClockAuctionAbi)

  const txs = await saleClockAuctionFilter.events({
    fromBlock: 4700000,
    toBlock: 4706633,
    name: 'AuctionSuccessful'
  })

  const fnOutputs = _.map(txs, (t) => {
    return {
      name: t.name,
      arguments: t.arguments
    }
  })
  const fnStrs = _.map(fnOutputs, (o) => {
    const props = _.filter(_.keys(o.arguments), p => isNaN(parseInt(p)))
    let argPairStrs = []
    _.forEach(props, p => {
      let val = o.arguments[p]
      if (p === 'totalPrice') val = val / (10 ** 18)
      // if (val > 10 ** 18) val = val / (10 ** 18)
      argPairStrs.push(`${p}: ${val}`)
    })
    return `${o.name}(${argPairStrs.join(', ')})`
  })
  _.forEach(fnStrs, s => console.log(s))
}
