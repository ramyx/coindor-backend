const MongoClient = require('mongodb').MongoClient;
const settings = require("../config/settings");
const { addCoinSchema } = require("./schemas/coinSchema");

const url = `mongodb://${settings.host}:${settings.dbPort}`;
const dbName = settings.dbName;

let db;

const initializeDatabase = () =>
  new Promise ((resolve, reject) =>
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
      if (err) reject(err);
      db = client.db(dbName);
      db.dropDatabase((err) => {
        if (err) reject(err);
        addCoinSchema(db, (err) => {
          if (err) reject(err);
          resolve(db);
        });
      });
    })
  );

module.exports = {
  initializeDatabase
};
