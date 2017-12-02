# eip55

[![build status](https://secure.travis-ci.org/dcousens/eip55.png)](http://travis-ci.org/dcousens/eip55)
[![Version](http://img.shields.io/npm/v/eip55.svg)](https://www.npmjs.org/package/eip55)

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
```


## License [ISC](LICENSE)
