const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { initializeDB, closeConnection, addCoin } = require('./utils/database');
const { login } = require('./utils/common');
require('../app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Add rates to coin', function() {

  const url = `http://${settings.host}:${settings.appPort}`;
  let token;
  let coinId;

  before(function(done) {
    initializeDB(() => {
      login("admin2", "admin", (result) => {
        token = result;
        addCoin({prefix: "USD", name: "Dollar"}, (newCoinId) => {
          coinId = newCoinId;
          done();
        });
      });
    });
  })

  after(function(done) {
    closeConnection();
    done();
  })

  it('Admin adds coin', function(done) {
    chai.request(url)
      .patch('/api/admin/coin/' + coinId)
      .set('x-access-token', token)
      .send({sellRate: -5.1, buyRate: 9})
      .end((err, res) => {
        assert.equal(res.text, 'Successfully modified');
        done();
      });
  });
});