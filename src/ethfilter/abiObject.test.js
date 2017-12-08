/* global describe it beforeEach expect */

import abiObject from './abiObject'

const mockAbi = getMockAbi()

describe('abiObject', () => {
  let abi
  beforeEach(() => {
    abi = abiObject(mockAbi)
  })

  describe('when given valid abi', () => {
    it('should add all function keys to return object', () => {
      expect(abi.supportsInterface).toBeDefined()
      expect(abi.cfoAddress).toBeDefined()
      expect(abi.tokenMetadata).toBeDefined()
    })

    it('should add all event keys to return object', () => {
      expect(abi.Approval).toBeDefined()
      expect(abi.Birth).toBeDefined()
      expect(abi.ContractUpgrade).toBeDefined()
    })

    it('should add topic hash to events', () => {
      expect(abi.Birth.topic).toBe('0x0a5311bd2a6608f08a180df2ee7c5946819a649b204b554bb8e39825b2c50ad5')
    })

    describe('[event].decode()', () => {
      it('should return decoded arguments', () => {
        const data = abi.Birth.decode(mockEventData)
        expect(data.owner).toBe('0xb4ad4e91b0ed52c1ea039ed464b690225d5ef9b9')
        expect(data.kittyId.toString()).toBe('119769')
        expect(data.matronId.toString()).toBe('117534')
        expect(data.sireId.toString()).toBe('83763')
        expect(data.genes.toString()).toBe('628667576846678424859899207044551024397691042969409830286272734388672971')
      })
    })

    describe('[function].decodeInputs()', () => {
      it('should return decoded arguments', () => {
        const data = abi.createSaleAuction.decodeInputs(mockFnInput)
        expect(data._kittyId.toString()).toBe('116697')
        expect(data._startingPrice.toString()).toBe('40000000000000000')
        expect(data._endingPrice.toString()).toBe('5000000000000000')
        expect(data._duration.toString()).toBe('43200')
      })
    })
  })
})

function getMockAbi () {
  return [
    {
      'constant': true,
      'inputs': [
        {
          'name': '_interfaceID',
          'type': 'bytes4'
        }
      ],
      'name': 'supportsInterface',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'cfoAddress',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_tokenId',
          'type': 'uint256'
        },
        {
          'name': '_preferredTransport',
          'type': 'string'
        }
      ],
      'name': 'tokenMetadata',
      'outputs': [
        {
          'name': 'infoUrl',
          'type': 'string'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_kittyId',
          'type': 'uint256'
        },
        {
          'name': '_startingPrice',
          'type': 'uint256'
        },
        {
          'name': '_endingPrice',
          'type': 'uint256'
        },
        {
          'name': '_duration',
          'type': 'uint256'
        }
      ],
      'name': 'createSaleAuction',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'constructor'
    },
    {
      'payable': true,
      'stateMutability': 'payable',
      'type': 'fallback'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'owner',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'approved',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'tokenId',
          'type': 'uint256'
        }
      ],
      'name': 'Approval',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'owner',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'kittyId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'matronId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'sireId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'genes',
          'type': 'uint256'
        }
      ],
      'name': 'Birth',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'newContract',
          'type': 'address'
        }
      ],
      'name': 'ContractUpgrade',
      'type': 'event'
    }
  ]
}

// for 'Birth' event
const mockEventData = '0x000000000000000000000000b4ad4e91b0ed52c1ea039ed464b690225d5ef9b9000000000000000000000000000000000000000000000000000000000001d3d9000000000000000000000000000000000000000000000000000000000001cb1e000000000000000000000000000000000000000000000000000000000001473300005b169390c54846172ae90140521266335aa2942129266294c5639ef5d9cb'

// for 'createSaleAuction' function
const mockFnInput = '0x3d7d3f5a000000000000000000000000000000000000000000000000000000000001c7d9000000000000000000000000000000000000000000000000008e1bc9bf0400000000000000000000000000000000000000000000000000000011c37937e08000000000000000000000000000000000000000000000000000000000000000a8c0'