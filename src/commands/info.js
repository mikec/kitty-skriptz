import { getKittyCore } from '../contracts'

export default async (_, conf, eth) => {
  const accounts = await eth.accounts()
  console.log(accounts)
  console.log('')

  const kittyCoreContract = await getKittyCore(eth)
  const kittyCore = await kittyCoreContract.at(conf.kittyCoreMainnetAddress)
  const name = (await kittyCore.name())[0]
  const symbol = (await kittyCore.symbol())[0]
  console.log('name: ', name)
  console.log('symbol: ', symbol)
  console.log('')
}
