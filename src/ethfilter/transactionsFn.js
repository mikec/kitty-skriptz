import _ from 'lodash'

export default (eth, address, abi) => {
  return async (filterParams) => {
    const { fromBlock, toBlock, name } = filterParams
    let transactions = []
    for (var i = fromBlock; i <= toBlock; i++) {
      const b = await eth.getBlockByNumber(i, true)
      // console.log(i)
      transactions = _.concat(
        transactions,
        _.filter(b.transactions, (tx) => {
          return name ? tx.input.substr(0, 10) === abi[name].signature : tx.to === address.toLowerCase()
        })
      )
    }
    transactions = _.map(transactions, t => {
      return _.extend(t, {
        name,
        input: {
          decoded: abi[name].decodeInputs(t.input),
          raw: t.input
        }
      })
    })
    return transactions
  }
}
