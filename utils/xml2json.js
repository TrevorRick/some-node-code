/*
* 'data2xml' module convert temlpate data to xml.'xml2js' module convert xml to json object
* and 'csvtojson' module convert a csv resource to a json objetc
*/

const assert = require('assert');
const data2xml = require('data2xml');
const convert = data2xml({xmlHeader: '<?xml version="1.0" encoding="GBK"?>\n'});
const parseString = require('xml2js').parseString;
const path = require('path');
const csvFilePath = path.resolve(__dirname + '/stocks.csv');
const csv = require('csvtojson');

let batchno = 18,
    // totalcnt = 41,
    pagerownum = 10
    nowpagenum = 1;

let j = 0;

let xml = convert(
    'root', {
        head: [
            {
                'retcode': '000000',
                'retmsg': '查询成功'
            }
        ],
        body: [
            {
                'batchno': `${batchno}`,
                'totalpagenum': '',
                'nowpagenum': `${nowpagenum}`,
                'pagerownum': `${pagerownum}`,
                'LIST': [
                    {
                        'workdate': '20180523',
                        'serialno': '1',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '2',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '3',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '4',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '5',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '6',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '7',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '8',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '9',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    },
                    {
                        'workdate': '20180523',
                        'serialno': '10',
                        'name': 'xx',
                        'id': 'xxxxx',
                        'amount': 'xxxxx'
                    }
                ]
            }
        ]
    }
);

parseString(xml, function (err, result) {
    assert.equal(err, null);
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            for (let i = 0; i < jsonObj.length; i++) {
                if (jsonObj[i].pageno == 1) {                  
                    result.root.body[0].LIST[j].workdate = jsonObj[i].workdate;
                    result.root.body[0].LIST[j].serialno = jsonObj[i].serialno;
                    result.root.body[0].LIST[j].name = jsonObj[i].name;
                    result.root.body[0].LIST[j].id = jsonObj[i].id;
                    result.root.body[0].LIST[j].amount = jsonObj[i].amount;
                    j++;
                }
            }
            console.log(JSON.stringify(result));
        });
      
});

