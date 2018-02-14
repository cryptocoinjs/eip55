var eip55 = require('../')
var fixtures = require('./fixtures')
var tape = require('tape')

function malform (address) {
  var i = Math.floor(Math.random() * address.length)
  var c = address.charCodeAt(i)
  var s = String.fromCharCode(c + 1)

  return address.slice(0, i) + s + address.slice(i + 1)
}

// from https://github.com/ethereum/EIPs/blob/f3a591f6718035ba358d6a479cadabe313f6ed36/EIPS/eip-55.md#implementation
var createKeccakHash = require('keccak')
var crypto = require('crypto')
function referenceImpl (address) {
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

tape('verifies each address', function (t) {
  var fail = 0

  fixtures.forEach(function (address) {
    var initial = address.toLowerCase()

    t.same(address, eip55.encode(initial))
    t.notOk(eip55.verify(initial))
    t.ok(eip55.verify(address))

    var malformed = malform(address)
    if (eip55.verify(malformed)) {
      fail++
    }
  })

  for (var i = 0; i < 1000; ++i) {
    var address = '0x' + crypto.randomBytes(20).toString('hex')
    t.same(referenceImpl(address), eip55.encode(address))
  }

  t.ok(fail < 3) // ~0.03% rate
  t.end()
})
