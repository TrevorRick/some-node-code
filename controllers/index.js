// /**
//  * 模拟银行的接口，获取request API的response
//  */
// const express = require('express');
// const parseString = require('xml2js').parseString;

// const aesutil = require('../utils/aesutil');

// let count = 0;

// const router = express.Router();

// var parsePostBody = function (req, done) { 
//     let arr = [];
//     let chunks;

//     req.on('data', buffer => {
//         arr.push(buffer);
//     });

//     req.on('end', () => {
//         chunks = Buffer.concat(arr);
//         done(chunks);
//     });
// };

// router.post('/', function (req, res) {  
//     parsePostBody(req, (chunks) => {
//         let body = chunks.toString();
//         let decryption_body = aesutil.decrypt(body); 
//         parseString(decryption_body, function (err, result) {           
//             let data = `<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>签约对账数据查询成功</retmsg></head><body><totalpagenum>10</totalpagenum><nowpagenum>${count}</nowpagenum><pagerownum>10</pagerownum><opertype>1</opertype><name>张三</name><id>321111111111111113</id><phone>13888888883</phone><accno>626666666666663</accno><note1></note1><note2></note2></body></root>`;
//             res.writeHead(200, {'Content-Type': 'application/xml'});
//             res.end(data);
//             count++;    
//         }); 
//     });
// });

// module.exports = router;

