const Token = artifacts.require("Token");

contract('Token', function(accounts) {
  describe('token tests', function () {
    beforeEach(async function() {
      this.token = await Token.new();
    })
  
    it('contract owner', async function() {
      const owner = await this.token.owner();
      assert.equal(owner, accounts[0]);
    });
  });
});