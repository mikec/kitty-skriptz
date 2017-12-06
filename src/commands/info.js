import { getKittyCore } from '../contracts'

export default async (_, conf, eth) => {
  const kittyCoreContract = await getKittyCore(eth)
  const kc = await kittyCoreContract.at(conf.kittyCoreAddress)
  const name = await prop(kc, 'name')
  const symbol = await prop(kc, 'symbol')
  const PROMO_CREATION_LIMIT = await prop(kc, 'PROMO_CREATION_LIMIT')
  const GEN0_CREATION_LIMIT = await prop(kc, 'GEN0_CREATION_LIMIT')
  const promoCreatedCount = await prop(kc, 'promoCreatedCount')
  const gen0CreatedCount = await prop(kc, 'gen0CreatedCount')
  const pregnantKitties = await prop(kc, 'pregnantKitties')
  const geneScience = await prop(kc, 'geneScience')
  const erc721Metadata = await prop(kc, 'erc721Metadata')
  const saleAuction = await prop(kc, 'saleAuction')
  const siringAuction = await prop(kc, 'siringAuction')
  const ceoAddress = await prop(kc, 'ceoAddress')
  const cfoAddress = await prop(kc, 'cfoAddress')
  const cooAddress = await prop(kc, 'cooAddress')
  const paused = await prop(kc, 'paused')

  console.log('')
  console.log('name: ', name)
  console.log('symbol: ', symbol)
  console.log('')
  console.log(`${promoCreatedCount}/${PROMO_CREATION_LIMIT} promo's created`)
  console.log(`${gen0CreatedCount}/${GEN0_CREATION_LIMIT} gen0's created`)
  console.log('')
  console.log(`${pregnantKitties} pregnant kitties`)
  console.log('')
  console.log(`GeneScience address: ${geneScience}`)
  console.log(`erc721Metadata address: ${erc721Metadata}`)
  console.log(`Sale Auction address: ${saleAuction}`)
  console.log(`Siring Auction address: ${siringAuction}`)
  console.log('')
  console.log(`CEO: ${ceoAddress}`)
  console.log(`CFO: ${cfoAddress}`)
  console.log(`COO: ${cooAddress}`)
  console.log('')
  console.log(`paused: ${paused}`)
  console.log('')
}

async function prop (contract, propName) {
  return (await contract[propName]())[0]
}
