const ethUtil =  require('ethereumjs-util')
const MR = require('miller-rabin')
const BN = ethUtil.BN

exports.params = {
  DATASET_BYTES_INIT: 1073741824, //2^30  
  DATASET_BYTES_GROWTH: 8388608, //2 ^ 23
  CACHE_BYTES_INIT: 16777216,    // 2**24          # bytes in dataset at genesis
  CACHE_BYTES_GROWTH: 131072,    // 2**17  cache growth per epoch
  CACHE_MULTIPLIER: 1024,        // Size of the DAG relative to the cache
    ETHASH_EPOCH_LENGTH : 30000,          // blocks per epoch    ETH=30000,ETC=60000
    ETCHASH_EPOCH_LENGTH:60000,
    ETCHASH_EPOCH_HEIGHT:11700000,  //11700000  2520000
  MIX_BYTES: 128,                // width of mix
  HASH_BYTES: 64,                // hash length in bytes
  DATASET_PARENTS: 256,          // number of parents of each dataset element
  CACHE_ROUNDS: 3,               // number of rounds in cache production
  ACCESSES: 64,
  WORD_BYTES: 4
}

exports.getCacheSize = function(epoc){
  var mr = new MR()
  var sz = exports.params.CACHE_BYTES_INIT + exports.params.CACHE_BYTES_GROWTH * epoc
  sz -= exports.params.HASH_BYTES
  while(!mr.test(new BN(sz / exports.params.HASH_BYTES))){
    sz -= 2 * exports.params.HASH_BYTES
  }
  return sz
}

exports.getFullSize = function(epoc){
  var mr = new MR()
  var sz = exports.params.DATASET_BYTES_INIT + exports.params.DATASET_BYTES_GROWTH * epoc
  sz -= exports.params.MIX_BYTES
  while(!mr.test(new BN(sz / exports.params.MIX_BYTES))){
    sz -= 2 * exports.params.MIX_BYTES
  }
  return sz
}

exports.getEpoc = function(blockNumber){
    const epoch_length = blockNumber >= exports.params.ETCHASH_EPOCH_HEIGHT ? exports.params.ETCHASH_EPOCH_LENGTH : exports.params.ETHASH_EPOCH_LENGTH;
    const epoch       = blockNumber / epoch_length;
  return Math.floor(epoch)
}

/**
 * Generates a seed give the end epoc and optional the begining epoc and the 
 * begining epoc seed
 * @method getSeed
 * @param end Number
 * @param begin Number 
 * @param seed Buffer
 */
exports.getSeed = function(seed, begin, end){
  for(var i = begin; i < end; i++){
    seed = ethUtil.sha3(seed)
  }
  // console.log(seed.toString('hex'))
  return seed
}

var fnv = exports.fnv = function(x, y){
  return (((x * 0x01000000 | 0) + (x * 0x193 | 0)) ^ y ) >>> 0
}

exports.fnvBuffer = function(a, b){
  var r = new Buffer(a.length)
  for(var i = 0; i < a.length ; i = i + 4){
      r.writeUInt32LE(fnv(a.readUInt32LE(i), b.readUInt32LE(i)), i) 
  }
  return r
}

exports.bufReverse = function(a){
  const length = a.length
  var b = new Buffer(length)
  for(var i = 0; i < length; i++){
    b[i] = a[length - i- 1]
  }
  return b
}
