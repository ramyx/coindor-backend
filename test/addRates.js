const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { testData } = require('./utils/common');

const { assert } = chai;
chai.use(chaiHttp);

describe('Add rates to coin', function() {

  const url = `http://${settings.host}:${settings.appPort}`;

  it('Admin adds rates to coins', function(done) {
    chai.request(url)
      .patch('/api/admin/coin/' + testData.usdCoin._id)
      .set('x-access-token', testData.adminToken)
      .send({sellRate: -5.1, buyRate: 9})
      .end((err, res) => {
        assert.equal(res.text, 'Successfully modified');
        done();
      });
  });
});