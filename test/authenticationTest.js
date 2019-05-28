const chai = require('chai');
const chaiHttp = require('chai-http');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../config/test.json');
const bcrypt = require('bcryptjs');

const { assert } = chai;
chai.use(chaiHttp);

describe('Authenticate', function() {
  const dbName = settings.dbName;
  let connection;
  let db;
  const dbUrl = `mongodb://${settings.host}:${settings.dbPort}`;
  const url = `http://${settings.host}:${settings.appPort}`;

  let userId;
  let password;

  before(function(done) {
    MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
      connection = client;
      db = client.db(dbName);
      password = bcrypt.hashSync("admin", 8);
      const lastSession = new Date().getTime();
      db.dropDatabase((err) => {
        if (err) throw err;
        db.collection('user').insertOne({username: "admin", password, lastSession}, (err, result) => {
          if (err) throw err;
          userId = result.insertedId;
          done();
        });
      });
    });
  });

  after(function(done) {
    connection.close();
    done();
  })

  describe('Log in', function() {

    it('Admin user logs in', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "admin", password: "admin"})
        .end((err, res) => {
          assert.equal(res.body.auth, true);
          assert.isDefined(res.body.token);
          done();
        });
    });

    it('Admin user tries to log in but password is invalid', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "admin", password: "1234"})
        .end((err, res) => {
          assert.equal(res.error.text, '{"auth":false,"token":null}');
          done();
        });
    });

    it('User tries to log in but it doesn\'t exist', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "user", password: "1234"})
        .end((err, res) => {
          assert.equal(res.error.text, 'No user found.');
          done();
        });
    });
  });

  describe('Verify auth header in endpoints', function() {

    let token;

    before(function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "admin", password: "admin"})
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('Verifies auth header', function(done) {
      chai.request(url)
        .patch('/api/user/' + userId)
        .set('x-access-token', token)
        .send({coins: ["ARS"], coins: ["EUR"]})
        .end((err, res) => {
          assert.equal(res.text, 'Successfully modified');
          done();
        });
    });

    it('Verifies auth header but no token provided', function(done) {
      chai.request(url)
        .patch('/api/user/' + userId)
        .send({coins: ["ARS"], coins: ["EUR"]})
        .end((err, res) => {
          assert.equal(res.body.message, 'No token provided.');
          done();
        });
    });

    it('Verifies auth header but fails to authenticate', function(done) {
      chai.request(url)
        .patch('/api/user/' + userId)
        .set('x-access-token', "aa")
        .send({coins: ["ARS"], coins: ["EUR"]})
        .end((err, res) => {
          assert.equal(res.body.message, 'Failed to authenticate token: jwt malformed');
          done();
        });
    });

    it('Verifies auth header but fails to authenticate', function(done) {
      chai.request(url)
        .patch('/api/user/' + userId)
        .set('x-access-token', "aa")
        .send({coins: ["ARS"], coins: ["EUR"]})
        .end((err, res) => {
          assert.equal(res.body.message, 'Failed to authenticate token: jwt malformed');
          done();
        });
    });

    it('Verifies auth header but token has expired', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "admin", password: "admin"})
        .end((err, res) => {
          chai.request(url)
            .patch('/api/user/' + userId)
            .set('x-access-token', token)
            .send({coins: ["ARS"], coins: ["EUR"]})
            .end((err, res) => {
              assert.equal(res.text, "Token has expired");
              done();
            });
        });
    });
  });
});