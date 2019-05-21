const chai = require('chai');
const chaiHttp = require('chai-http');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../config/test.json');

const { assert } = chai;
chai.use(chaiHttp);

describe('Select coins', function() {
  const dbName = settings.dbName;
  let connection;
  let db;
  const dbUrl = `mongodb://${settings.host}:${settings.dbPort}`;
  const url = `http://${settings.host}:${settings.appPort}`;

  let userId;

  before(function(done) {
    MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
      connection = client;
      db = client.db(dbName);
      db.collection('user').insertOne({coins: []}, (err, result) => {
        userId = result.insertedId;
        done();
      });
    });
  });

  after(function(done) {
    connection.close();
    done();
  })

  it('Coins are added', function(done) {
    chai.request(url)
      .patch('/user/' + userId)
      .send({coins: ["ARS"], coins: ["EUR"]})
      .end((err, res) => {
        assert.equal(res.text, 'Successfully modified');
        done();
      });
  });

  it('Try to add coins, but user doesn\'t exist', function(done) {
    chai.request(url)
      .patch('/user/aaaaaaaaaaaaaaaaaaaaaaaa')
      .send({coins: ["ARS"]})
      .end((err, res) => {
        assert.equal(res.text, '{"statusCode":500,"error":"Internal Server Error","message":"User doesn\'t exist"}');
        done();
      });
  });

  it('Try to add coins, but parameter is wrong', function(done) {
    chai.request(url)
      .patch('/user/' + userId)
      .send({coins: [1]})
      .end((err, res) => {
        assert.equal(res.text, '{"statusCode":500,"code":"121","error":"Internal Server Error","message":"Document failed validation"}');
        done();
      });
  });
});