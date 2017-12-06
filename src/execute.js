import eth from './eth'
import { getKittyCore } from './contracts'

const kittyCoreMainnetAddress = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'

export default async () => {
  const accounts = await eth.accounts()
  console.log(accounts)
  console.log('')

  const kittyCoreContract = await getKittyCore()
  const kittyCore = await kittyCoreContract.at(kittyCoreMainnetAddress)
  const name = (await kittyCore.name())[0]
  const symbol = (await kittyCore.symbol())[0]
  console.log('name: ', name)
  console.log('symbol: ', symbol)
}
