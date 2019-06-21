const chai = require('chai');
const chaiHttp = require('chai-http');
const settings = require('../config/test.json');
const { testData } = require('./utils/common');
require('../app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Add coin', function() {

  const url = `http://${settings.host}:${settings.appPort}`;

  it('Admin adds coin', function(done) {
    chai.request(url)
      .post('/api/admin/coin')
      .set('x-access-token', testData.adminToken)
      .send({prefix: "ARS", name: "Pesos Argentinos"})
      .end((err, res) => {
        assert.equal(res.text, 'Successfully modified');
        done();
      });
  });
});