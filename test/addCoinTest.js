const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { initializeDB, closeConnection } = require('./utils/database');
const { login } = require('./utils/common');
require('../app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Add coin', function() {

  const url = `http://${settings.host}:${settings.appPort}`;
  let token;

  before(function(done) {
    initializeDB(() => {
      login("admin2", "Admin1234", (result) => {
        token = result
        done();
      });
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