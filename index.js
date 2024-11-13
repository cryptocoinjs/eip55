var keccak256 = require('@noble/hashes/sha3').keccak_256

function encodeInternal (address, parsed, chainId) {
  checkChainId(chainId)
  parsed = parsed === undefined ? getHex(address) : parsed
  if (parsed === null) throw new TypeError('Bad address')

  var addressHex = parsed[1].toLowerCase()
  var forHash = chainId !== undefined
    ? chainId.toString(10) + '0x' + addressHex
    : addressHex
  var checksum = keccak256(forHash)

  var ret = '0x'
  for (var i = 0; i < 20; ++i) {
    var byte = checksum[i]
    var ha = addressHex.charAt(i * 2)
    var hb = addressHex.charAt(i * 2 + 1)
    ret += (byte & 0xf0) >= 0x80 ? ha.toUpperCase() : ha
    ret += (byte & 0x0f) >= 0x08 ? hb.toUpperCase() : hb
  }

  return ret
}

function encode (address, chainId) {
  return encodeInternal(address, undefined, chainId)
}

function verify (address, allowOneCase, chainId) {
  checkChainId(chainId)
  var parsed = getHex(address)
  if (parsed !== null) {
    if (address.indexOf('0x') !== 0) return false
    if (allowOneCase && isOneCase(parsed[1])) return true
    return encodeInternal(address, parsed, chainId) === address
  }
  return false
}

function checkChainId (n) {
  if (n !== undefined && !isPositiveInteger(n)) {
    throw new TypeError('Bad chainId')
  }
}

function isPositiveInteger (n) {
  return (typeof n === 'number' || n instanceof Number) &&
    n > 0 &&
    n + 0 === Math.floor(n)
}

function isOneCase (s) {
  return s === s.toLowerCase() || s === s.toUpperCase()
}

function isString (data) {
  return typeof data === 'string' || data instanceof String
}

function getHex (data) {
  return isString(data) ? data.match(/^(?:0x)?([0-9a-fA-F]{40})$/) : null
}

module.exports = { encode, verify }
