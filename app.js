const { initializeServer } = require("./utils/appUtils");
const { modifyUser } = require("./controllers/userController");

const fastify = require('fastify')({
  logger: true
})

/**
  * @api {patch} /user/:userId Modifies a user
  * @apiPermission authenticated user
  * @apiParam {String} userId 
  * @apiBodyParam {[String]} coins
*/
fastify.patch('/user/:userId', (request, reply) => {
  const { userId } = request.params;
  const newFields = request.body;
  modifyUser(userId, newFields, (err) => {
    if (err) {
      reply.code(500).send(err);
    }
    reply.code(200).send("Successfully modified");
  });
})

fastify.listen(3000, async (err) => {
  if (err) {
    throw err;
  }
  fastify.log.info(`server is up`);
  await initializeServer();
})