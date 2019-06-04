const { approveUser } = require("../controllers/userController");
const { addNewCoin } = require("../controllers/coinController");

module.exports = {
  setupAdminRoutes: (app) => {
    /**
      * @api {post} /api/admin/approve/:userId Approves a registered user
      * @apiPermission authenticated admin user
      * @apiParam {String} userId
    */
    app.post('/api/admin/approve/:userId', (request, reply) => {
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
  }
};
