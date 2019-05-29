const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const settings = require("../config/settings");
const { addCoinSchema } = require("./schemas/coinSchema");
const { addUserSchema } = require("./schemas/userSchema");
const { addLoginDeviceSchema } = require("./schemas/loginSchema");

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
        addUserSchema(db, (err) => { if (err) { reject(err) } } );
        addCoinSchema(db, (err) => { if (err) { reject(err) } } );
        addLoginDeviceSchema(db, (err) => { if (err) { reject(err) } } );
        resolve(db);
      });
    })
  );

const getId = (id) => new ObjectId(id);

const getCollection = (name) => db.collection(name);

module.exports = {
  initializeDatabase,
  getCollection,
  getId
};
