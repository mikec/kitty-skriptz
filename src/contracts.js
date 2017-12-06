import fs from 'fs'
import eth from './eth'

export const getKittyCore = getContractFn('KittyCore')

function getContractFn (contractName) {
  const abi = JSON.parse(fs.readFileSync(`build/${contractName}.abi`).toString())
  const bin = fs.readFileSync(`build/${contractName}.bin`).toString()
  return async () => {
    const accounts = await eth.accounts()
    const ethContract = eth.contract(abi, bin, {
      from: accounts[0],
      gas: 4712388
    })
    return {
      new: newContract(ethContract),
      at: ethContract.at
    }
  }
}

function newContract (ethContract) {
  return async () => {
    const txAddress = await ethContract.new()
    const txReceipt = await eth.getTransactionReceipt(txAddress)
    return ethContract.at(txReceipt.contractAddress)
  }
}
