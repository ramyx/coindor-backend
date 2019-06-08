const settings = require('../../config/settings');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require("../../utils/initialize/testDB");

chai.use(chaiHttp);

const url = `http://${settings.host}:${settings.appPort}`;

const testData = {
  adminUser: mockData.users[0],
  commonUser: mockData.users[1],
  euroCoin: mockData.coins[0],
  usdCoin: mockData.coins[1]
}

after(function(done) {
  //process.exit(0);
  done();
})

module.exports = {
  login: (username, password, cb) => {
    chai.request(url)
      .post('/login')
      .send({username, password})
      .end((err, res) => {
        cb(res.body.token);
      });
  },
  testData
}