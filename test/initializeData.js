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
    const adminPassword = bcrypt.hashSync("admin", 8);
    const userPassword = bcrypt.hashSync("user", 8);
    const lastSession = new Date().getTime();
    db.dropDatabase((err) => {
      if (err) throw err;
      db.collection('user').insertOne({username: "admin2", password: adminPassword, role:'admin', lastSession}, (err, adminResult) => {
        if (err) throw err;
        const adminId = adminResult.insertedId;
        db.collection('user').insertOne({username: "user", password: userPassword, role:'user', status: 'pending', lastSession}, (err, result) => {
          if (err) throw err;
          const userId = result.insertedId;
          cb({adminId, userId});
        });
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