var eip55 = require('../')
var fixtures = require('./fixtures')
var tape = require('tape')

function malform (address) {
  var i = Math.floor(Math.random() * address.length)
  var c = address.charCodeAt(i)
  var s = String.fromCharCode(c + 1)

  return address.slice(0, i) + s + address.slice(i + 1)
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

  t.ok(fail < 3) // ~0.03% rate
  t.end()
})
