const MongoClient = require('mongodb').MongoClient;
const settings = require('../config/test.json');
const bcrypt = require('bcryptjs');

const dbName = settings.dbName;
let connection;
let db;
const dbUrl = `mongodb://${settings.host}:${settings.dbPort}`;

const initializeDB = (cb) => {
  MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
    connection = client;
    db = client.db(dbName);
    const password = bcrypt.hashSync("admin", 8);
    const lastSession = new Date().getTime();
    db.dropDatabase((err) => {
      if (err) throw err;
      db.collection('user').insertOne({username: "admin2", password, role:'admin', lastSession}, (err, result) => {
        if (err) throw err;
        cb(result.insertedId);
      });
    });
  });
}

const closeConnection = () => connection.close();

after(function(done) {
  process.exit(0);
  done();
})

module.exports = {
  initializeDB,
  closeConnection
}