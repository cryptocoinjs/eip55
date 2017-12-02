var createKeccakHash = require('keccak')

function encode (address) {
  if (address.length !== 42) throw new TypeError('Bad address')
  address = address.slice(2).toLowerCase()
  var checksum = createKeccakHash('keccak256')
    .update(address)
    .digest()

  var ret = '0x'
  for (var i = 0; i < 20; ++i) {
    var byte = checksum[i]
    var y = i * 2
    var hex = address.slice(y, y + 2)

    ret += (byte >> 4) > 0x08 ? hex[0].toUpperCase() : hex[0]
    ret += (byte & 0x0f) > 0x08 ? hex[1].toUpperCase() : hex[1]
  }

  return ret
}

function verify (address) {
  return encode(address) === address
}

module.exports = { encode, verify }
