import _ from 'lodash'
import { keccak256 } from 'js-sha3'
import ethjsAbi from 'ethjs-abi'

function fnObject (fnDef) {
  return {}
}

function eventObject (eventDef) {
  const evtStr = `${eventDef.name}(${
    _.join(
      _.map(eventDef.inputs, (input) => {
        return input.type
      }), ','
    )
  })`
  return {
    topic: `0x${keccak256(evtStr)}`,
    decode: (data) => {
      return ethjsAbi.decodeEvent(eventDef, data)
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
