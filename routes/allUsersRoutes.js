const { modifyUser } = require("../controllers/userController");

module.exports = {
  setupAllUsersRoutes: (app) => {
    /**
      * @api {patch} /api/user/:userId Modifies a user
      * @apiPermission authenticated user
      * @apiParam {String} userId 
      * @apiBodyParam {[String]} coins -> prefix of coins; old coins will be deleted and replaced by these
    */
    app.patch('/api/user/:userId', (request, reply) => {
      const { userId } = request.params;
      const newFields = request.body;
      modifyUser(userId, newFields, (err) => {
        if (err) {
          return reply.status(500).send(err.message);
        }
        return reply.status(200).send("Successfully modified");
      });
    })
  }
};
