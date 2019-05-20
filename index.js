const { initializeServer } = require("./utils/appUtils");

const fastify = require('fastify')({
  logger: true
})

fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.listen(3000, (err) => {
  if (err) {
    throw err;
  }
  fastify.log.info(`server is up`);
  initializeServer();
})