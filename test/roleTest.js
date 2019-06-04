const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { initializeDB, closeConnection } = require('./utils/database');
const { login } = require('./utils/common');
require('../app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Roles', function() {

  const url = `http://${settings.host}:${settings.appPort}`;
  let userId;
  let token;

  before(function(done) {
    initializeDB(result => {
      userId = result.userId;
      login("admin2", "admin", (result) => {
        token = result
        done();
      });
    });
  })

  after(function(done) {
    closeConnection();
    done();
  })

  describe('Log in approval', function() {

    it('User tries to log in but hasn\'t been approved yet', function(done) {
      chai.request(url)
        .post('/login')
        .send({username: "user", password: "user"})
        .end((err, res) => {
          assert.equal(res.error.text, 'User hasn\'t been approved yet');
          done();
        });
    });

    it('Admin approves user and user logs in', function(done) {
      chai.request(url)
        .post('/api/admin/approve/' + userId)
        .set('x-access-token', token)
        .send()
        .end((err, res) => {
          assert.equal(res.text, 'Successfully modified');
          chai.request(url)
            .post('/login')
            .send({username: "user", password: "user"})
            .end((err, res) => {
              assert.equal(res.body.auth, true);
              done();
            });
        });
    });
  });

  describe('Access', function() {

    let userToken;

    before(function(done) {
      login("user", "user", (result) => {
        userToken = result
        done();
      });
    })

    it('User tries to add coin but is not allowed', function(done) {
      chai.request(url)
        .post('/api/admin/coin')
        .set('x-access-token', userToken)
        .send({prefix: "EUR", name: "Euro"})
        .end((err, res) => {
          assert.equal(res.text, 'Not allowed');
          done();
        });
    });
  });
});