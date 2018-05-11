const fs = require('fs');
const path = require('path');

const decrypt = require('./decrypt');
let decryption = decrypt.decryption;

console.log("UTF8 plaintext deciphered: " + '\n' + decryption);
