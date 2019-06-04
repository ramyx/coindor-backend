const { verifyCaptcha } = require('../utils/captcha');
const { register } = require("../utils/auth");
const { loginRoute } = require("../utils/blocks/blocking");

module.exports = {
  setupPublicRoutes: (app) => {
    /**
      * @api {post} /register Registers user
      * @apiBodyParam {String} username 
      * @apiBodyParam {String} password 
    */
    // TODO: Add KYC and extra data
    app.post('/register', (request, reply) => {
      const { username, password } = request.body;
      verifyCaptcha(request).then(() => {
        register(username, password, function (err, data) {
          if (!data) return reply.status(500).send(err);
          reply.status(200).send(data);
        });
      }).catch(err => reply.status(500).send(err));
    });

    /**
      * @api {post} /login If user data is correct, returns auth token 
      * @apiBodyParam {String} username 
      * @apiBodyParam {String} password 
    */
    app.post('/login', async (request, reply) => {
      try {
        verifyCaptcha(request).then(async () => {
          return await loginRoute(request, reply);
        }).catch(err => reply.status(500).send(err));
      } catch (err) {
        reply.status(500).send(err.errMessage);
      }
    });
  }
};
