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

var header = Buffer('b4f56370bbf2705583da32f9e66a23856dcc5877ff3bd800463c6459023fba85', 'hex');

ethash.verifySubmit(35414, header, '951bbad4f01eaa7c', function (result) {

  console.log("result"+","+result.toString('hex'));
});
