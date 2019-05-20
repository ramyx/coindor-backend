const MongoClient = require('mongodb').MongoClient;
const settings = require("../config/settings");

const url = `mongodb://${settings.host}:${settings.dbPort}`;
const dbName = settings.dbName;

let db;

const initializeDatabase = () =>
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    db = client.db(dbName);
    return db;
  });

module.exports = {
  initializeDatabase
};
