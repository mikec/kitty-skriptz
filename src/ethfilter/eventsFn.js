import _ from 'lodash'

export default (eth, address, abi) => {
  return async (filterParams) => {
    let { fromBlock, toBlock, name } = filterParams
    let topic = null
    if (name) {
      topic = abi[name].topic
    }
    const logResp = await eth.getLogs({
      fromBlock,
      toBlock,
      address,
      topics: [topic]
    })
    return _.map(logResp, (event) => {

      // TODO handle null name (filter all events)
      /* if (!name) {
        for (var p in abi) {
          if (abi[p].topic && abi[p].topic === event.topics[0]) {
            name = p
          }
        }
      } */

      return _.extend(event, {
        name,
        arguments: abi[name].decode(event.data)
      })
    })
  }
}
