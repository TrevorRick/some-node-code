const express = require('express');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const parseString = require('xml2js').parseString;

const config = require('../config');
const aesutil = require('../utils/aesutil');
const mongoquery = require('../utils/mongoquery');

const key = config.key;
const iv = config.iv;

const router = express.Router();

var parsePostBody = function (req, done) {      // done是一个回掉函数，处理异步函数接口返回的结果chunks
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
                let data = '<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>交易成功</retmsg></head><body><note1></note1><note2></note2></body></root>'
                res.writeHead(200, {'Content-Type': 'application/xml'});

                res.end(data);
                // let username = result.root.body[0].name;
                // mongoquery.identify(username);
                // console.log(result.root.body);
                // res.send(result.root.body[0]);     // result.root.body是一个arr[]数组, arr[0]是一个JSON Object
            } else if (transcode == "T0002") {
                let dealtype = result.root.body[0].dealtype; 
                //  01-代扣申请 02-代扣结果 03-签约对账
                if (dealtype == "01") {
                    
                } else if (dealtype == "02") {
                    
                } else if (dealtype == "03") {
                    let data = '<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>签约对账请求成功</retmsg></head><body><note1></note1><note2></note2></body></root>'
                    res.writeHead(200, {'Content-Type': 'application/xml'});
                } else {
                    res.send('unknown dealtype, please check!');
                }

            } else {
                res.send('unknown transcode')
            };            
        })       
    })
})

module.exports = router;
