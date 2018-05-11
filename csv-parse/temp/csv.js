/**
 * 功能：导出table.csv内容并插入到mongodb
 */

var mongodb = require('mongodb');
var lineReader = require('line-reader');

const mongoClient = mongodb.MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

mongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db('stock');
    
    createCapped(db, function () {
        client.close();
    })
})

function createCapped(db, cb) {
    db.createCollection("stocks", { "capped": true, "size": 100000, "max": 5000}, function (err, collection) {
        if (err) {
            console.log(err);
        }else {
            console.log("Collection created.");
            console.log("Insert to collection from csv file.");
            lineReader.eachLine('table.csv', function (line, last){
                var nameJson = 'zhao';
                var stockidJson = 60000;

                //将csv文件中2015/1/12 格式的时间转化为 20150112  
                var time1 = line.split(",")[0].split("/")[1];
                var time2 = line.split(",")[0].split("/")[2];

                if (time1 < 10)
                    time1 = '0' + time1;
                if (time2 < 10)
                    time2 = '0' + time2;
                //使用split函数，以,为分隔符分割数据  
                var timeJson = Number(line.split(",")[0].split("/")[0] + time1 + time2);
                //将字符串转化为数字类型  
                var openJson = Number(line.split(",")[1]);

                var highJson = Number(line.split(",")[2]);

                var lowJSon = Number(line.split(",")[3]);

                var closeJson = Number(line.split(",")[4]);

                var volumeJson = Number(line.split(",")[5]);

                var adjJson = Number(line.split(",")[6]);
                //指定一条记录的格式  
                var json = {
                    name: nameJson, stockid: stockidJson,
                    time: timeJson, Open: openJson,
                    High: highJson, Low: lowJSon,
                    Close: closeJson, Volume: volumeJson,
                    Adj: adjJson
                };
                //存入数据库  
                collection.insert(json, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                });
            });
        } 
    });
}

