const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { testData } = require('./utils/common');
require('../app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Select coins', function() {
  const url = `http://${settings.host}:${settings.appPort}`;

  it('Coins are added to users selected coins', function(done) {
    chai.request(url)
      .patch('/api/user/' + testData.adminUser._id)
      .set('x-access-token', testData.adminToken)
      .send({coins: [testData.usdCoin._id]})
      .end((err, res) => {
        assert.equal(res.text, 'Successfully modified');
        done();
      });
  });

});