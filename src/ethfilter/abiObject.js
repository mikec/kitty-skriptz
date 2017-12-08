import _ from 'lodash'
import { keccak256 } from 'js-sha3'
import ethjsAbi from 'ethjs-abi'

function fnObject (fnDef) {
  return {
    signature: ethjsAbi.encodeSignature(fnDef),
    decodeInputs: data => {
      const inputTypes = _.map(fnDef.inputs, input => input.type)
      const inputNames = _.map(fnDef.inputs, input => input.name)
      return ethjsAbi.decodeParams(inputNames, inputTypes, `0x${data.substr(10)}`)
    }
  }
}

function eventObject (eventDef) {
  const inputTypes = _.map(eventDef.inputs, input => input.type)
  const inputNames = _.map(eventDef.inputs, input => input.name)
  const evtStr = `${eventDef.name}(${_.join(inputTypes, ',')})`
  return {
    topic: `0x${keccak256(evtStr)}`,
    decode: data => {
      const args = ethjsAbi.decodeEvent(eventDef, data)
      return _.pick(args, inputNames)
    }
  }
}

export default (abiJSON) => {
  return _.mapValues(
    _.keyBy(abiJSON, 'name'),
    (def) => {
      if (def.type === 'function') {
        return fnObject(def)
      } else if (def.type === 'event') {
        return eventObject(def)
      } else {
        return {}
      }
    }
  )
}
