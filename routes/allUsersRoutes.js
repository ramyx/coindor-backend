const { modifyUser } = require("../controllers/userController");
const { checkPatchUserSchema } = require('./paramsSchemas/patchUserRouteSchema');
const { checkValidationResult } = require('./paramsSchemas/errorHandling');
const { checkAuthyRegisterSchema } = require('./paramsSchemas/authyRegisterRouteSchema');
const { checkVerifyTokenSchema } = require('./paramsSchemas/verifyTokenRouteSchema');
const { registerAuthy, verifyToken } = require('../controllers/authyController');
const jwt = require('jsonwebtoken');

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

    /**
      * @api {post} /api/user/authyregister authy registers user
      * @apiBodyParam {String} phone 
      * @apiBodyParam {String} email
    */
    app.post('/api/user/authyregister', checkAuthyRegisterSchema, checkValidationResult, (request, reply) => {
      const { email, phone, countryCode } = request.body;
      const idUser = jwt.decode(request.headers['x-access-token']).id;
      registerAuthy(idUser, email, phone, countryCode, (err, data) => {
        if (err) return reply.status(500).send(err)
        reply.status(200).send(data);
      });
    });

    /**
      * @api {post} /api/user/verifytoken verify token authy
      * @apiBodyParam {String} token
    */
    app.post('/api/user/verifytoken', checkVerifyTokenSchema, checkValidationResult, (request, reply) => {
      const { token } = request.body;
      const idUser = jwt.decode(request.headers['x-access-token']).id;
      verifyToken(idUser, token, (err, data) => {
        if (err) return reply.status(500).send(err)
        reply.status(200).send(data);
      });
    });
  }
};
