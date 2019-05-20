const MongoClient = require('mongodb').MongoClient;
const settings = require("../config/settings");

const url = `mongodb://${settings.host}:${settings.port}`;
const dbName = settings.dbName;

let db;

const initializeDatabase = () =>
  MongoClient.connect(url, function(err, client) {
    db = client.db(dbName);
    return db;
  });

module.exports = {
  initializeDatabase
};
