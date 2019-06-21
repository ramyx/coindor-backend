const settings = require('../../config/settings');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require("../../utils/initialize/testDB");
const app = require('../../app');

chai.use(chaiHttp);

const url = `http://${settings.host}:${settings.appPort}`;

const testData = {
  adminUser: mockData.users[0],
  commonUser: mockData.users[3],
  euroCoin: mockData.coins[0],
  usdCoin: mockData.coins[1]
}

const login = (username, password, cb) => {
  chai.request(url)
    .post('/login')
    .send({username, password})
    .end((err, res) => {
      cb(res.body.token);
    });
};

after(function(done) {
  process.exit(0);
  done();
})

before(function(done) {
  app.on('ready', () => {
    login("admin", "Admin1234", (result) => {
      testData.adminToken = result;
      login("user", "User1234", (result) => {
        testData.userToken = result;
        login("user2", "User1234", (result) => {
          testData.userToken2 = result;
          done();
        });
      });
    });
  });
})

module.exports = {
  login,
  testData
}