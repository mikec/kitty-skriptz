import _ from 'lodash'
import fs from 'fs'
import axios from 'axios'
// import { getSaleClockAuction } from '../contracts'
import { getKittyCore } from '../contracts'
import EthFilter from '../ethfilter/EthFilter'

const saleClockAuctionAbi = JSON.parse(fs.readFileSync(`build/SaleClockAuction.abi`).toString())

export default async (argv, conf, eth) => {
  const ethFilter = EthFilter(conf.providerUrl)

  // const saleClockAuction = await getSaleClockAuction(eth)
  const kittyCore = await getKittyCore(eth)
  const kc = await kittyCore.at(conf.kittyCoreAddress)
  const saleClockAuctionFilter = ethFilter.contract(conf.saleClockAuctionAddress, saleClockAuctionAbi)

  const hexVals = '0123456789abcdef'
  let salesByTrait = {}
  let val
  for (var i = 0; i < 60; i++) {
    for (var j = 0; j < 16; j++) {
      val = hexVals[j]
      salesByTrait[`${i}_${val}`] = {
        sales: [],
        avg: null
      }
    }
  }

  const txs = await saleClockAuctionFilter.events({
    fromBlock: 4706000,
    toBlock: 4706633,
    name: 'AuctionSuccessful'
  })

  const sales = _.map(txs, (t) => {
    return {
      name: t.name,
      arguments: t.arguments
    }
  })

  let totalPrice, tokenId, kitty, sale, geneStr
  for (var k = 0; k < sales.length; k++) {
    sale = sales[k]
    totalPrice = sale.arguments.totalPrice / 10 ** 18
    tokenId = sale.arguments.tokenId
    kitty = await kc.getKitty(tokenId.toNumber())
    geneStr = kitty.genes.toString(16)
    for (var m = 0; m < geneStr.length; m++) {
      salesByTrait[`${m}_${geneStr[m]}`].sales.push(totalPrice)
    }
  }

  let highest = [null, 0]
  for (var n in salesByTrait) {
    let salesArr = salesByTrait[n].sales
    const avg = _.reduce(salesArr, (sum, n) => {
      return sum + n
    }, 0) / salesArr.length
    if (avg > highest[1]) highest = [n, avg]
  }
  console.log(highest)

}
