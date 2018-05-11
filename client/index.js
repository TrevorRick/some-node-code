const http = require('http');  
const querystring =require('querystring');  
const chinaTime = require('china-time');
const parseString = require('xml2js').parseString;
const config = require('../config');
const aesutil = require('../utils/aesutil');

const key = config.key;
const iv = config.iv;
const hashkey = aesutil.maphash(key);
const hashiv = aesutil.maphash(iv, config.addalgorithm);

let date = chinaTime('YYYYMMDD'); 
let time = chinaTime('HHmmss');

let currpage = 0;

let post_data = `<?xml version="1.0" encoding="GBK"?><root><head><transcode>T0005</transcode><transdate>${date}</transdate><transtime>${time}</transtime></head><body><workdate>20180308</workdate><totalcnt>10</totalcnt><currpage>${currpage}</currpage><note1></note1><note2></note2></body></root>`
let encrypt_data = aesutil.encryption(post_data, hashkey, hashiv);
console.log("base64 ciphertext: " + encrypt_data);
 
let options = {  
                   hostname:'localhost',     //此处不能写协议，如 ： http://,https://  否则会报错  
                   port:5817,  
                   path:'/demo',  
                   method:'POST',  
                   headers: {  
                        'Content-Type':'text/plain'
                   }  
               };  
let req = http.request(options,function(res){      
                        console.log('STATUS:'+res.statusCode);  
                        console.log('HEADERS:'+JSON.stringify(res.headers));  
                        res.setEncoding('utf8');  
                        res.on('data',function(chunk){  
                                console.log('BODY:'+chunk);  
                        });  
                       });  
// write data to request body  
req.write(encrypt_data);  
req.end();  