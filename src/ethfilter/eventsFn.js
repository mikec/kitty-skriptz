import _ from 'lodash'

export default (eth, address, abi, _tmpABI) => {
  return async (filterParams) => {
    const { fromBlock, toBlock, name } = filterParams
    const { topic } = abi[name]
    const logResp = await eth.getLogs({
      fromBlock,
      toBlock,
      address,
      topics: [topic]
    })
    return _.map(logResp, (event) => {
      return _.extend(event, {
        name,
        arguments: abi[name].decode(event.data)
      })
    })
  }
}
