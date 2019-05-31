const chai = require('chai');
const chaiHttp = require('chai-http');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../config/test.json');
const bcrypt = require('bcryptjs');

const { assert } = chai;
chai.use(chaiHttp);

describe('Select coins', function() {
  const dbName = settings.dbName;
  let connection;
  let db;
  const dbUrl = `mongodb://${settings.host}:${settings.dbPort}`;
  const url = `http://${settings.host}:${settings.appPort}`;

  let userId;
  let token;

  before(function(done) {
    MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
      connection = client;
      db = client.db(dbName);
      password = bcrypt.hashSync("admin", 8);
      const lastSession = new Date().getTime();
      db.dropDatabase((err) => {
        if (err) throw err;
        db.collection('user').insertOne({username: "admin", password, lastSession }, (err, result) => {
          if (err) throw err;
          userId = result.insertedId;
          chai.request(url)
            .post('/login')
            .send({username: "admin", password: "admin"})
            .end((err, res) => {
              token = res.body.token;
              done();
            });
        });
      });
    });
  });

  after(function(done) {
    connection.close();
    done();
  })

  it('Coins are added', function(done) {
    chai.request(url)
      .patch('/api/user/' + userId)
      .set('x-access-token', token)
      .send({coins: ["ARS"], coins: ["EUR"]})
      .end((err, res) => {
        assert.equal(res.text, 'Successfully modified');
        done();
      });
  });

  it('Try to add coins, but user doesn\'t exist', function(done) {
    chai.request(url)
      .patch('/api/user/aaaaaaaaaaaaaaaaaaaaaaaa')
      .set('x-access-token', token)
      .send({coins: ["ARS"]})
      .end((err, res) => {
        assert.equal(res.text, 'User doesn\'t exist');
        done();
      });
  });
});