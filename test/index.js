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

tape('verifies edge cases', function (t) {
  // encode edge cases
  // non-string should throw
  t.throws(function () { eip55.encode(-34.23) }, 'Bad address')
  // no-leading-0x should not throw
  t.doesNotThrow(function () { eip55.encode('82c025c453c9ad2824a9b3710763d90d8f454760') })
  // not 40 hex chars should throw
  t.throws(function () { eip55.encode('82c025c453c9ad2824a9b3710763d90d8f4547') }, 'Bad address')
  // not 40 hex chars should throw even with 0x
  t.throws(function () { eip55.encode('0x82c025c453c9ad2824a9b3710763d90d8f4547') }, 'Bad address')
  // non-hex character (z) should throw
  t.throws(function () { eip55.encode('z2c025c453c9ad2824a9b3710763d90d8f454760') }, 'Bad address')
  // non-hex character (z) should throw even with 0x
  t.throws(function () { eip55.encode('0xz2c025c453c9ad2824a9b3710763d90d8f454760') }, 'Bad address')
  // 42 z characters should throw
  t.throws(function () { eip55.encode('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }, 'Bad address')

  // verify edge cases
  // verify returns false when no 0x is prepended
  t.notOk(eip55.verify('82C025c453C9aD2824A9b3710763D90D8F454760'))
  // verify returns true if allowOneCase is true and address is one case (lower)
  t.ok(eip55.verify('0x82c025c453c9ad2824a9b3710763d90d8f454760', true))
  // verify returns true if allowOneCase is true and address is one case (upper)
  t.ok(eip55.verify('0x82C025C453C9AD2824A9B3710763D90D8F454760', true))
  // verify should never throw (incorrect type)
  t.doesNotThrow(function () {
    // all of these should not throw and return false instead
    t.notOk(eip55.verify(-34.23))
    t.notOk(eip55.verify({}))
    t.notOk(eip55.verify('0x82c025c453c9ad2824a9b3710763d90d8f4547'))
    t.notOk(eip55.verify('0xz2c025c453c9ad2824a9b3710763d90d8f454760'))
    t.notOk(eip55.verify('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'))
    t.notOk(eip55.verify('0xzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'))
  })

  // EIP-1191 tests (using test vector with most [a-f] characters)
  var flatAddress = '0xdbf03b407c01e7cd3cbea99509d93f8dddc8c6fb'
  var chainId30Addr = '0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB'
  var chainId31Addr = '0xdbF03B407C01E7cd3cbEa99509D93f8dDDc8C6fB'
  t.same(chainId30Addr, eip55.encode(flatAddress, 30))
  t.same(chainId31Addr, eip55.encode(flatAddress, 31))
  t.throws(function () { eip55.encode(flatAddress, {}) }, 'Bad chainId')
  t.throws(function () { eip55.encode(flatAddress, 30.4) }, 'Bad chainId')
  t.throws(function () { eip55.encode(flatAddress, 0) }, 'Bad chainId')
  t.throws(function () { eip55.encode(flatAddress, -30) }, 'Bad chainId')
  t.ok(eip55.verify(chainId30Addr, false, 30))
  t.ok(eip55.verify(chainId31Addr, false, 31))
  t.throws(function () { eip55.verify(chainId30Addr, false, {}) }, 'Bad chainId')
  t.throws(function () { eip55.verify(chainId30Addr, false, 30.4) }, 'Bad chainId')
  t.throws(function () { eip55.verify(chainId30Addr, false, 0) }, 'Bad chainId')
  t.throws(function () { eip55.verify(chainId30Addr, false, -30) }, 'Bad chainId')

  t.end()
})
