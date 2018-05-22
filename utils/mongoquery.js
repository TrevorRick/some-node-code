// const mongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// const config = require('../config');

// const url = 'mongodb://localhost:27017';
// const dbName = 'stock';


// const mongoquery = module.exports = {};

// mongoquery.identify = function (name, id, phone, accno) {
//     mongoClient.connect(url, function (err, client) {
//         assert.equal(null, err);
//         console.log("Connected successfully to server");
        
//         const collection = client.db(dbName).find({
//             name: name,
//             id: id,
//             phone: phone,
//             accno: accno
//         }).toArray(function (err, docs) {
//             assert.equal(err, null);
//             return true;
//         })
    //    findDocuments(db, name, function (docs) {
    //         callback((docs[0].id == id && docs[0].phone == phone && docs[0].accno == accno));
    //         client.close();
    //     });
    });
    
}

// const findDocuments = function (db, name, callback) {
//     const collection = db.collection('stocks');
//     collection.find({
//         name: name
//     }).toArray(function (err, docs) {
//         assert.equal(err, null);
//         console.log("Found the following records");
//         // console.log(docs[0]);
//         // console.log("name: " + docs[0].name + ", id: " + docs[0].id);
//         callback(docs);
//     });
// };
