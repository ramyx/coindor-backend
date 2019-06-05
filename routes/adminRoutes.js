const { approveUser } = require("../controllers/userController");
const { addNewCoin, editCoin } = require("../controllers/coinController");
const { checkValidationResult } = require('./paramsSchemas/errorHandling');
const { checkApproveUserSchema } = require('./paramsSchemas/approveRouteSchema');

module.exports = {
  setupAdminRoutes: (app) => {
    /**
      * @api {post} /api/admin/approve/:userId Approves a registered user
      * @apiPermission authenticated admin user
      * @apiParam {String} userId
    */
    app.post('/api/admin/approve/:userId', checkApproveUserSchema, checkValidationResult, (request, reply) => {
      const { userId } = request.params;
      approveUser(userId, (err) => {
        if (err) {
          return reply.status(500).send(err.message);
        }
        return reply.status(200).send("Successfully modified");
      });
    })

    /**
      * @api {post} /api/admin/coin Adds a new coin
      * @apiPermission authenticated admin user
      * @apiBodyParam {String} prefix -> coin prefix; e.g: "EUR"
      * @apiBodyParam {String} name 
    */
    app.post('/api/admin/coin', (request, reply) => {
      const { prefix, name } = request.body;
      addNewCoin(prefix, name, (err) => {
        if (err) {
          return reply.status(500).send(err.message);
        }
        return reply.status(200).send("Successfully modified");
      });
    })

    /**
      * @api {patch} /api/admin/coin Modifies an existing coin
      * @apiPermission authenticated admin user
      * @apiParam {String} coinId
      * @apiBodyParam {String} prefix -> coin prefix; e.g: "EUR"
      * @apiBodyParam {String} name 
      * @apiBodyParam {Decimal} sellRate -> e.g: -4.5
      * @apiBodyParam {Decimal} buyRate
    */
    app.patch('/api/admin/coin/:coinId', (request, reply) => {
      const { coinId } = request.params;
      const { prefix, name, sellRate, buyRate } = request.body;
      const coin = JSON.parse(JSON.stringify({ prefix, name, sellRate, buyRate }));
      editCoin(coinId, coin, (err) => {
        if (err) {
          return reply.status(500).send(err.message);
        }
        return reply.status(200).send("Successfully modified");
      });
    })
  }
};
