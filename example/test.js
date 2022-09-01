const Ethash = require('..')
const levelup = require('levelup')
const memdown = require('memdown')
const ethHashUtil = require('../util.js')
Ethash.prototype.verifySubmit = function (number, headerHash, nonce, cb) {
  var self = this
  console.log(number);
  this.loadEpoc(number, function () {
    console.log("EPOC set");
    console.log(self.seed.toString('hex'));
    var a = self.run(headerHash, new Buffer(nonce, 'hex'));
    cb(a.hash);
  })
}

console.log("epch",ethHashUtil.getEpoc(7080007))

var cacheDB = levelup('', {
  db: memdown
})

var ethash = new Ethash(cacheDB);

var header = Buffer('93b2930cb3de350b662fb31e8d2ffba5dde2e5373183a684c43396146fdc35cc', 'hex');

ethash.verifySubmit(15824795, header, '78fc813bf50e677f', function (result) {

  console.log("result"+","+result.toString('hex'));
});
