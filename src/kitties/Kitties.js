import _ from 'lodash'
import { getKittyCore } from '../contracts'
import { getCattributes } from './cattributes'

export default async (address, eth) => {
  const kittyCore = await getKittyCore(eth)
  const kc = await kittyCore.at(address)
  const getKittyFn = kc.getKitty
  return _.extend(kc, {
    getKitty: async (tokenId) => {
      const k = await getKittyFn(tokenId)
      return _.extend(k, {
        cattributes: getCattributes(k.genes.toString(16))
      })
    }
  })
}
