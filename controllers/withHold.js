/*所有银行发起的request都由这个controller handler处理，
 *根据不同的transcode和opertype(或dealtype)执行不同的业务代码
 */
const express = require('express');
const parseString = require('xml2js').parseString;
const mongodb = require('mongodb');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const aesutil = require('../utils/aesutil');

const url = 'mongodb://localhost:27017';
let count = 0;

const router = express.Router();

var parsePostBody = function (req, done) { // done是一个回掉函数，处理异步函数接口返回的结果chunks
    let arr = [];
    let chunks;

    req.on('data', buffer => {
        arr.push(buffer);
    });

    req.on('end', () => {
        chunks = Buffer.concat(arr);
        done(chunks);
    });
};

router.post('/', function (req, res) {
    parsePostBody(req, (chunks) => {
        let body = chunks.toString();
        let decryption_body = aesutil.decrypt(body);
        parseString(decryption_body, function (err, result) { // result-->解密后的xml文件转换成的JSON Object
            assert.equal(err, null);
            let transcode = result.root.head[0].transcode; //根据transcode执行不同的逻辑代码            
            if (transcode == 'T0001') {
                //代扣签约
                // let username = result.root.body[0].name;
                // mongoquery.identify(username);
                // console.log(result.root.body);
                // res.send(result.root.body[0]);     // result.root.body是一个arr[]数组, arr[0]是一个JSON Object
                let data = '<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>签约登记请求成功</retmsg></head><body><note1></note1><note2></note2></body></root>';
                res.writeHead(200, {
                    'Content-Type': 'application/xml'
                });
                res.send(data);
                
            } else if (transcode == 'T0002') { // 双向接口
                let dealtype = result.root.body[0].dealtype;
                //  01-代扣申请 02-代扣结果 03-签约对账
                if (dealtype == '01') { //模拟银行对T0002-01（代扣总金额请求） request的response
                    let data = '<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>代扣总金额请求成功</retmsg></head><body><note1></note1><note2></note2></body></root>';
                    res.writeHead(200, {
                        'Content-Type': 'application/xml'
                    });
                    res.end(data);
                } else if (dealtype == '02') { //响应银行发起的T0002-02（代扣总金额结果） request
                    let data = '<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>代扣总金额结果请求成功</retmsg></head><body><note1></note1><note2></note2></body></root>';
                    res.writeHead(200, {
                        'Content-Type': 'application/xml'
                    });
                    res.end(data);
                } else if (dealtype == '03') { //响应银行发起的T0002-03（签约校准请求） request      
                    let batchno = result.root.body[0].batchno,
                        totalcnt = result.root.body[0].totalcnt;
                    // assert.equal(typeof(batchno), 'object', 'no batchno found!');
                    if (typeof (batchno) != 'undefined') {
                        let data = `<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>签约校准请求成功，总笔数: ${totalcnt}, 流水号：${batchno}</retmsg></head><body><note1></note1><note2></note2></body></root>`;
                        res.writeHead(200, {
                            'Content-Type': 'application/xml'
                        });
                        res.end(data);
                        //将request插入数据库
                        const mongoClient = mongodb.MongoClient;
                        mongoClient.connect(url, function (err, client) {
                            assert.equal(null, err);
                            console.log('Connected correctly to server');

                            const db = client.db('stock');
                            db.createCollection('batchrecords', {
                                'capped': true,
                                'size': 100000,
                                'max': 5000
                            }, function (err, collection) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Collection created.');
                                    //指定一条记录的格式  
                                    let json = {
                                        batchno: `${batchno}`,
                                        totalcnt: `${totalcnt}`
                                    };
                                    //存入数据库  
                                    collection.insert(json, function (err, result) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(result);
                                        client.close();
                                    });
                                }
                            });

                        });
                    } else {
                        res.end('no batchno found, please check!');
                    }
                } else {
                    res.send('unknown T0002 dealtype, please check!');
                }
            } else if (transcode == 'T0003') { // 响应银行发起的（代扣明细信息查询） request。response格式暂时是从xml文件中读取返回
                let currpage = ++(result.root.body[0].currpage);
                let readstream = fs.createReadStream(path.resolve(__dirname + `/${currpage}.xml`));
                let data = [];
                readstream.on('data', function (chunk) {
                    data.push(chunk.toString());
                });
                readstream.on('end', function () {
                    data = data.toString();
                    res.send(data);
                });
            } else if (transcode == 'T0004') { // 模拟银行对（代扣结果查询）request的响应
                let batchno = result.root.body[0].batchno,
                    totalpagenum = Math.ceil(result.root.body[0].totalcnt / 10),
                    nowpagenum = result.root.body[0].currpage;
                let data = `<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>批扣结果查询成功</retmsg></head><body><batchno>${batchno}</batchno><totalpagenum>${totalpagenum}</totalpagenum><nowpagenum>${nowpagenum}</nowpagenum><pagerownum>10</pagerownum><LIST></LIST><LIST></LIST><note1></note1><note2></note2></body></root>`;
                res.writeHead(200, {
                    'Content-Type': 'application/xml'
                });
                res.end(data);               
            }
            else if (transcode == 'T0005') { // 模拟银行对T0005 request的response。
                let data = `<?xml version="1.0" encoding="GBK"?><root><head><retcode>000000</retcode><retmsg>签约对账数据查询成功</retmsg></head><body><totalpagenum>10</totalpagenum><nowpagenum>${count}</nowpagenum><pagerownum>10</pagerownum><opertype>1</opertype><name>张三</name><id>321111111111111113</id><phone>13888888883</phone><accno>626666666666663</accno><note1></note1><note2></note2></body></root>`;
                res.writeHead(200, {
                    'Content-Type': 'application/xml'
                });
                res.end(data);
                count++;
            } else {
                res.end('unknown transcode');
            }
        });
    });
});

module.exports = router;

