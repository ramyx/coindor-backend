const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { initializeDB, closeConnection } = require('./initializeData');

const { assert } = chai;
chai.use(chaiHttp);

describe('Add coin', function() {

  const url = `http://${settings.host}:${settings.appPort}`;
  let token;

  before(function(done) {
    initializeDB(() => {
      chai.request(url)
        .post('/login')
        .send({username: "admin2", password: "admin"})
        .end((err, res) => {
          token = res.body.token;
          done();
        })
    });
  })

  after(function(done) {
    closeConnection();
    done();
  })

  it('Admin adds coin', function(done) {
    chai.request(url)
      .post('/api/admin/coin')
      .set('x-access-token', token)
      .send({prefix: "EUR", name: "Euro"})
      .end((err, res) => {
        assert.equal(res.text, 'Successfully modified');
        done();
      });
  });
});