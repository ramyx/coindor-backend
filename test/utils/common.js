const settings = require('../../config/test.json');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const url = `http://${settings.host}:${settings.appPort}`;

module.exports = {
  login: (username, password, cb) => {
    chai.request(url)
      .post('/login')
      .send({username, password})
      .end((err, res) => {
        cb(res.body.token);
      });
  }
}