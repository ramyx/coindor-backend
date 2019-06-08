const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { initializeDB, closeConnection } = require('./utils/database');
const { login } = require('./utils/common');
require('../app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Select coins', function() {
  const url = `http://${settings.host}:${settings.appPort}`;
  let token;
  let userId;
  let insertedCoinId;

  before(function(done) {
    initializeDB(({adminId, coinId}) => {
      userId = adminId;
      insertedCoinId = coinId;
      login("admin2", "Admin1234", (result) => {
        token = result;
        done();
      });
    });
  });

  after(function(done) {
    closeConnection();
    done();
  })

  it('Coins are added', function(done) {
    chai.request(url)
      .patch('/api/user/' + userId)
      .set('x-access-token', token)
      .send({coins: [insertedCoinId]})
      .end((err, res) => {
        assert.equal(res.text, 'Successfully modified');
        done();
      });
  });

});