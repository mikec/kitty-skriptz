import _ from 'lodash'
import fs from 'fs'
import EthFilter from '../ethfilter/EthFilter'

const kittyCoreAbi = JSON.parse(fs.readFileSync(`build/KittyCore.abi`).toString())

export default async (argv, conf, eth) => {
  const ethFilter = EthFilter(conf.providerUrl)

  const kittyCoreFilter = ethFilter.contract(conf.kittyCoreAddress, kittyCoreAbi)
  const birthEvents = await kittyCoreFilter.events({
    // fromBlock: 4605167,
    fromBlock: 4695000,
    toBlock: 4695238,
    name: 'Birth'
  })
  const eventOutputs = _.map(birthEvents, (e) => {
    const { owner, kittyId, matronId, sireId } = e.arguments
    return `${e.name}(owner: ${owner}, kittyId: ${kittyId}, matronId: ${matronId}, sireId: ${sireId})`
  })
  eventOutputs.forEach(o => console.log(o))
}
