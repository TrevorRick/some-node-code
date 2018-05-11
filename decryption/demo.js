const fs = require('fs');
const path = require('path');
const assert = require('assert');
const aesutil = require('../utils/aesutil');
const config = require('./config')

const key = config.key;
const iv = config.iv;

// let readstream = fs.createReadStream(path.resolve(__dirname + '/data'));
let data = fs.readFileSync(path.resolve(__dirname + '/data'), 'utf-8');

let hashkey = aesutil.maphash(key);
let hashiv = aesutil.maphash(iv, config.addalgorithm);

encryption = aesutil.encryption(data, hashkey, hashiv);
console.log("base64 ciphertext: " + encryption);



// DECRYPT = {
//     encryption: aesutil.encryption(data, hashkey, hashiv),
//     decryption: aesutil.encryption(data, hashkey, hashiv)
// }

// module.exports = DECRPYT;

// let data = [];
// let encryption = '';

// readstream.on('data', function (chunk) {
//     data.push(chunk.toString());
// })

// readstream.on('end', function () {
//     console.log('final output: ' + data);
//     // data = data.toString();
//     // assert.equal(typeof data, 'string');

//     // const key = config.key;
//     // const iv = config.iv;       
//     // let hashkey = aesutil.maphash(key);
//     // let hashiv = aesutil.maphash(iv, config.addalgorithm);

//     // encryption = aesutil.encryption(data, hashkey, hashiv);
//     // console.log( "base64 ciphertext: "+ encryption);

//     // let decryption = aesutil.decryption(encryption, hashkey, hashiv);
//     // // console.log( "UTF8 plaintext deciphered: " + decryption); 
// })

// readstream.on('close', function () {
//     data = data.toString();
//     assert.equal(typeof data, 'string');

//     const key = config.key;
//     const iv = config.iv;       
//     let hashkey = aesutil.maphash(key);
//     let hashiv = aesutil.maphash(iv, config.addalgorithm);

//     encryption = aesutil.encryption(data, hashkey, hashiv);
//     console.log( "base64 ciphertext: "+ encryption);
// });