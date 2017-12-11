import _ from 'lodash'
import fs from 'fs'
import path from 'path'
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

  // 24 hrs ~= 5,500 blocks
  const txs = await saleClockAuctionFilter.events({
    // fromBlock: 4711997 - 10000,
    // fromBlock: 4711997 - 5000,
    // fromBlock: 4711997 - 1000,
    fromBlock: 4711997 - 100,
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
      sales: []
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
      salesByCattribute[cattributeMatch].sales.push({ tokenId, totalPrice })
    } else if (numCattributes > 1) {
      if (!salesByCattribute.COMBOS[numCattributes]) {
        salesByCattribute.COMBOS[numCattributes] = { sales: [] }
      }
      salesByCattribute.COMBOS[numCattributes].sales.push({ tokenId, totalPrice })
    }
  }

  console.log('')
  console.log('LOWEST SALES')
  console.log('')
  _.forEach(salesByCattribute, (s, cattribute) => {
    if (cattribute !== 'COMBOS') {
      let lowestSale = null
      _.forEach(s.sales, (s) => {
        if (lowestSale === null || s.totalPrice < lowestSale.totalPrice) {
          lowestSale = s
        }
      })
      console.log(cattribute)
      console.log(priceFormat(lowestSale.totalPrice))
      console.log(`https://cryptokittydex.com/kitties/${lowestSale.tokenId}`)
    }
  })

  let averages = []
  _.forEach(salesByCattribute, (s, cattribute) => {
    if (cattribute === 'COMBOS') {
      for (var num in s) {
        averages.push(
          calcAverages(`${num}_COMBO`, s[num].sales)
        )
      }
    } else {
      averages.push(
        calcAverages(cattribute, s.sales)
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

  const outputPath = 'data/average-sales.json'
  console.log('')
  console.log(`writing ${outputPath}`)
  ensureDirectoryExistence(outputPath)
  fs.writeFile(outputPath, JSON.stringify(averages), err => {
    if (err) console.error(err)
    else console.log('done')
  })
}

function calcAverages (cattribute, sales) {
  sales = _.map(sales, s => s.totalPrice)
  return {
    cattribute,
    numSales: sales.length,
    averagePrice: priceFormat(average(sales)),
    lowestPrice: priceFormat(lowest(sales)),
    highestPrice: priceFormat(highest(sales))
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

function ensureDirectoryExistence (filePath) {
  var dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}
