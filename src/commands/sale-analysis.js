import _ from 'lodash'
import fs from 'fs'
import Kitties from '../kitties/Kitties'
import EthFilter from '../ethfilter/EthFilter'
import { cattributeGenes } from '../kitties/cattributes'

const saleClockAuctionAbi = JSON.parse(fs.readFileSync(`build/SaleClockAuction.abi`).toString())

export default async (argv, conf, eth) => {
  const ethFilter = EthFilter(conf.providerUrl)

  const saleClockAuctionFilter = ethFilter.contract(conf.saleClockAuctionAddress, saleClockAuctionAbi)

  const kitties = await Kitties(conf.kittyCoreAddress, eth)

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

  let rareCattributes = []
  for (var q = 0; q < 10; q++) {
    rareCattributes.push(cattributeGenes[q][0])
  }

  console.log('find pricing data for ', rareCattributes)
  console.log('')

  const txs = await saleClockAuctionFilter.events({
    fromBlock: 4711000,
    // fromBlock: 4711900,
    toBlock: 4711997,
    name: 'AuctionSuccessful'
  })

  console.log('got auction data')
  console.log('')

  const sales = _.map(txs, (t) => {
    return {
      name: t.name,
      arguments: t.arguments
    }
  })

  let salesByCattribute = {
    'COMBOS': {}
  }
  rareCattributes.forEach((c) => {
    salesByCattribute[c] = {
      salePrices: []
    }
  })
  let totalPrice, tokenId, kitty, sale
  for (var k = 0; k < sales.length; k++) {
    sale = sales[k]
    totalPrice = sale.arguments.totalPrice / 10 ** 18
    tokenId = sale.arguments.tokenId
    kitty = await kitties.getKitty(tokenId.toNumber())
    console.log(`${k + 1}|${sales.length}`)

    const cattributeMatch = _.intersection(kitty.cattributes, rareCattributes)
    const numCattributes = cattributeMatch.length
    if (numCattributes === 1) {
      salesByCattribute[cattributeMatch].salePrices.push(totalPrice)
    } else if (numCattributes > 1) {
      if (!salesByCattribute.COMBOS[numCattributes]) {
        salesByCattribute.COMBOS[numCattributes] = { salePrices: [] }
      }
      salesByCattribute.COMBOS[numCattributes].salePrices.push(totalPrice)
    }
  }

  let averages = []
  _.forEach(salesByCattribute, (s, cattribute) => {
    if (cattribute === 'COMBOS') {
      for (var num in s) {
        averages.push(
          calcAverages(`${num}_COMBO`, s[num].salePrices)
        )
      }
    } else {
      averages.push(
        calcAverages(cattribute, s.salePrices)
      )
    }
  })

  console.log('')
  console.log('AVG   | LOW   | HIGH  | CATTRIBUTE  | NUM SALES')
  console.log('-----------------------------------------------')
  const space = ' '
  _.forEach(averages, (a) => {
    console.log(`${a.averagePrice} | ${a.lowestPrice} | ${a.highestPrice} | ${strFormat(a.cattribute, 11, space)} | ${a.numSales}`)
  })
}

function calcAverages (cattribute, salePrices) {
  return {
    cattribute,
    numSales: salePrices.length,
    averagePrice: priceFormat(average(salePrices)),
    lowestPrice: priceFormat(lowest(salePrices)),
    highestPrice: priceFormat(highest(salePrices))
  }
}

function priceFormat (price) {
  price = Math.round(price * 1000) / 1000
  price = price.toString()
  price = strFormat(price, 5, '0')
  return price
}

function strFormat (str, buf, char) {
  while (str.length < buf) {
    str += `${char}`
  }
  return str
}

function average (numberArray) {
  return _.reduce(numberArray, (sum, n) => {
    return sum + n
  }, 0) / numberArray.length
}

function lowest (numberArray) {
  var lowNum = null
  _.forEach(numberArray, (n) => {
    if (lowNum === null || n < lowNum) {
      lowNum = n
    }
  })
  return lowNum
}

function highest (numberArray) {
  var lowNum = null
  _.forEach(numberArray, (n) => {
    if (lowNum === null || n > lowNum) {
      lowNum = n
    }
  })
  return lowNum
}
