/**
 * 模拟银行的接口，获取request API的response
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const parseString = require('xml2js').parseString;

const config = require('../config');
const aesutil = require('../utils/aesutil');

const key = config.key;
const iv = config.iv;

const router = express.Router();

var parsePostBody = function (req, done) { 
    let arr = [];
    let chunks;

    req.on('data', buffer => {
        arr.push(buffer);
    });

    req.on('end', () => {
        chunks = Buffer.concat(arr);
        done(chunks);
    })
}

router.post('/', function (req, res) {
    parsePostBody(req, (chunks) => {
        let body = chunks.toString();

        let hashkey = aesutil.maphash(key);
        let hashiv = aesutil.maphash(iv, config.addalgorithm);
        let decryption_body = aesutil.decryption(body, hashkey, hashiv); 
        parseString(decryption_body, function (err, result) { // result-->解密后的xml文件转换成的JSON Object
            let transcode = result.root.head[0].transcode;  //根据transcode执行不同的逻辑代码
            if ( transcode == "T0001") {
                // 代扣签约
                res.writeHead(200, {'Content-Type': 'application/xml'});
                res.end("T0001 request");
            } else if (transcode == "T0002") {
                res.writeHead(200, {'Content-Type': 'application/xml'});
                res.end("T0001 request");
            } else if (transcode == "T0005"){
                let data = '<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>签约对账数据查询成功</retmsg></head><body><totalpage>10</totalpage><nowpage>0</nowpage><pagerownum>20</pagerownum><opertype>1</opertype><name>张三</name><id>321111111111111113</id><phone>13888888883</phone><accno>626666666666663</accno><note1></note1><note2></note2></body></root>'
                res.writeHead(200, {'Content-Type': 'application/xml'});
                res.end(data);
            };            
        })       
    })
})

module.exports = router;