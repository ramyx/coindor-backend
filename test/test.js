const chai = require('chai');
const chaiHttp = require('chai-http');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../config/test.json');

const { assert } = chai;
chai.use(chaiHttp);

describe('Initialize Database', function() {

  const url = `mongodb://${settings.host}:${settings.dbPort}`;
  const dbName = settings.dbName;
  let connection;
  let db;

  before(function(done) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
      connection = client;
      db = client.db(dbName);
      done();
    });
  });

  after(function(done) {
    connection.close();
    done();
  })

  it('Database should be initialized', function() {
    return assert.isDefined(db);
  });
});

describe('Initialize App', function() {
  const url = `http://${settings.host}:${settings.appPort}`;

  it('App should be initialized', function(done) {
    chai.request(url)
      .get('/')
      .end((err, res) => {
        assert.isDefined(res.body);
        done();
      });
  });
});