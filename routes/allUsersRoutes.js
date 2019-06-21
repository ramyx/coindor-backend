const { modifyUser } = require("../controllers/userController");
const { checkPatchUserSchema } = require('./paramsSchemas/patchUserRouteSchema');
const { checkValidationResult } = require('./paramsSchemas/errorHandling');

module.exports = {
  setupAllUsersRoutes: (app) => {
    /**
      * @api {patch} /api/user/:userId Modifies a user
      * @apiPermission authenticated user
      * @apiParam {String} userId 
      * @apiBodyParam {[String]} coins -> coins ids; old coins will be deleted and replaced by these
    */
    app.patch('/api/user/:userId', checkPatchUserSchema, checkValidationResult, (request, reply) => {
      const { userId } = request.params;
      const { username, password, coins } = request.body;
      const newFields = JSON.parse(JSON.stringify({ username, password, coins }));
      modifyUser(userId, newFields, (err) => {
        if (err) {
          return reply.status(500).send(err.message);
        }
        return reply.status(200).send("Successfully modified");
      });
    })
  }
};
