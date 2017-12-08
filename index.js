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
    var ha = address.charAt(i * 2)
    var hb = address.charAt(i * 2 + 1)
    ret += (byte & 0xf0) >= 0x80 ? ha.toUpperCase() : ha
    ret += (byte & 0x0f) >= 0x08 ? hb.toUpperCase() : hb
  }

  return ret
}

function verify (address) {
  return encode(address) === address
}

module.exports = { encode, verify }
