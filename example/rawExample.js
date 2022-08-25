const Ethash = require('..')
const levelup = require('levelup')
const memdown = require('memdown')

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


var cacheDB = levelup('', {
  db: memdown
})

var ethash = new Ethash(cacheDB);

var header = Buffer('053690289a0a9dac132c268d6ffe64ad8e025b74eefa61b51934c57d2a49d9e4', 'hex');

ethash.verifySubmit(15658542, header, 'fe09000002a784b0', function (result) {
  console.log(result.toString('hex'));
});
