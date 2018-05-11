const fs = require('fs');
const path = require('path');
const assert = require('assert');
const aesutil = require('../utils/aesutil');
const config = require('../config');

const key = config.key;
const iv = config.iv;

let data = fs.readFileSync(path.resolve(__dirname + '/demo.xml'), 'utf-8');

let hashkey = aesutil.maphash(key);
let hashiv = aesutil.maphash(iv, config.addalgorithm);
let encryption = aesutil.encryption(data, hashkey, hashiv);

DECRPYT = {
    decryption: aesutil.decryption(encryption, hashkey, hashiv)
}

module.exports = DECRPYT;