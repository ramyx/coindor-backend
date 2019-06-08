const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { initializeDB, closeConnection } = require('./utils/database');
const { login } = require('./utils/common');
require('../app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Authenticate', function() {

  const url = `http://${settings.host}:${settings.appPort}`;
  let userId;

  before(function(done) {
    initializeDB(({adminId}) => {
      userId = adminId;
      done();
    });
  })

  after(function(done) {
    closeConnection();
    done();
  })

  describe('Log in', function() {

    it('Admin user logs in', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "admin2", password: "Admin1234"})
        .end((err, res) => {
          assert.equal(res.body.auth, true);
          assert.isDefined(res.body.token);
          done();
        });
    });

    it('Admin user tries to log in but password is invalid', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "admin2", password: "Invalid1234"})
        .end((err, res) => {
          assert.equal(res.error.text, '{"auth":false,"token":null,"message":"Email or password is wrong"}');
          done();
        });
    });

    it('User tries to log in but it doesn\'t exist', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "notExistingUser", password: "Invalid1234"})
        .end((err, res) => {
          assert.equal(res.error.text, 'No user found.');
          done();
        });
    });

    it('User tries to log in but failes and exceeds attempts limit', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "admin2", password: "Invalid1234"})
        .end((err, res) => {
          chai.request(url)
            .post('/login')
            .send({username: "admin2", password: "Invalid1234"})
            .end((err, res) => {
              chai.request(url)
                .post('/login')
                .send({username: "admin2", password: "Invalid1234"})
                .end((err, res) => {
                  assert.equal(res.error.text, 'Too Many Requests');
                  done();
                });
            });
        });
    });
  });

  describe('Verify auth header in endpoints', function() {

    let token;

    before(function(done) {
      initializeDB(({adminId}) => {
        userId = adminId;
        login("admin2", "Admin1234", (result) => {
          token = result
          done();
        });
      });
    });

    it('Verifies auth header', function(done) {
      chai.request(url)
        .post('/api/admin/coin')
        .set('x-access-token', token)
        .send({prefix: "USD", name: "Dolar"})
        .end((err, res) => {
          assert.equal(res.text, 'Successfully modified');
          done();
        });
    });

    it('Verifies auth header but no token provided', function(done) {
      chai.request(url)
        .post('/api/admin/coin')
        .send({prefix: "USD", name: "Dolar"})
        .end((err, res) => {
          assert.equal(res.body.message, 'No token provided.');
          done();
        });
    });

    it('Verifies auth header but fails to authenticate', function(done) {
      chai.request(url)
        .post('/api/admin/coin')
        .set('x-access-token', "aa")
        .send({prefix: "USD", name: "Dolar"})
        .end((err, res) => {
          assert.equal(res.body.message, 'Failed to authenticate token: jwt malformed');
          done();
        });
    });

    it('Verifies auth header but fails to authenticate', function(done) {
      chai.request(url)
        .post('/api/admin/coin')
        .set('x-access-token', "aa")
        .send({prefix: "USD", name: "Dolar"})
        .end((err, res) => {
          assert.equal(res.body.message, 'Failed to authenticate token: jwt malformed');
          done();
        });
    });

    it('Verifies auth header but token has expired', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "admin2", password: "Admin1234"})
        .end((err, res) => {
          chai.request(url)
            .post('/api/admin/coin')
            .set('x-access-token', token)
            .send({prefix: "USD", name: "Dolar"})
            .end((err, res) => {
              assert.equal(res.text, "Token has expired");
              done();
            });
        });
    });
  });
});