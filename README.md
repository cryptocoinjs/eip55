# eip55

[![build status](https://secure.travis-ci.org/cryptocoinjs/eip55.png)](https://travis-ci.org/cryptocoinjs/eip55)
[![Version](https://img.shields.io/npm/v/eip55.svg)](https://www.npmjs.org/package/eip55)

An [EIP55](https://github.com/ethereum/EIPs/blob/f3a591f6718035ba358d6a479cadabe313f6ed36/EIPS/eip-55.md) compatible address encoding library.


## Example

``` javascript
let eip55 = require('eip55')

eip55.encode('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
// => 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359

eip55.verify('0xAcA128edBD274F2aBa534d67dD55Ebf67767B9A5')
// => true

eip55.verify('0xaca128edbd274f2aba534d67dd55ebf67767b9a5')
// => false

// The second argument of verify allows for single case addresses
// In this case it will only verify the leading 0x and length
// therefore the above example returns true instead of false

// lower case
eip55.verify('0xaca128edbd274f2aba534d67dd55ebf67767b9a5', true)
// => true

// upper case
eip55.verify('0xACA128EDBD274F2ABA534D67DD55EBF67767B9A5', true)
// => true

// EIP-1191 chainId support has been added
// pass the optional chainId to get the casing for that network

// Encode for RSK Mainnet (chainId 30) (notice the difference from above)
eip55.encode('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359', 30)
// => 0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359

eip55.verify('0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359')
// => false (we need to pass the chainId)

// Note: the second argument is allowOneCase (default: false)
eip55.verify('0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359', false, 30)
// => true
```


## License [MIT](LICENSE)
