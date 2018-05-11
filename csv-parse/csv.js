/**
 * userInfo.csv内容并插入到mongodb
 */

const mongodb = require('mongodb');
const lineReader = require('line-reader');
const chinaTime = require('china-time');
const mongoClient = mongodb.MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

mongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    const db = client.db('stock');

    createCapped(db, function () {
        client.close();
        console.log("Closed db connection.")
    })
})

function createCapped(db, callback) {
    db.createCollection("stocks", { "capped": true, "size": 100000, "max": 5000}, function (err, collection) {
        if (err) {
            console.log(err);
        }else {
            console.log("Collection created.");
            console.log("Insert to collection from csv file.");
            lineReader.eachLine('userInfo.csv', function (line, last){  
                let transdataJson = chinaTime('YYYYMMDD');      
                let transtimeJson = chinaTime('HHmmss');
                let nameJson = line.split(",")[8];
                let idJson = line.split(",")[10];
                let phoneJSon = line.split(",")[16];
                let accnoJson =line.split(",")[31];

                //指定一条记录的格式  
                let json = {
                    tranCode: 1,
                    transdata: transdataJson,
                    transtime: transtimeJson,
                    name: nameJson, 
                    id: idJson,
                    phone: phoneJSon,
                    accno: accnoJson                 
                };
                //存入数据库  
                collection.insert(json, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                });
            });
            console.log("close db connection.")
            callback();
        }      
    })
}