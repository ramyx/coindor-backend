var express = require('express');
var bodyParser = require('body-parser')
const { initializeServer } = require("./utils/initialization");
const { modifyUser } = require("./controllers/userController");
const { verifyAuthHeader, login, register } = require("./utils/auth");

var app = express();

app.use(bodyParser.json())

app.use((request, reply, next) => {
  if (request.originalUrl.includes('/api/')) {
    verifyAuthHeader(request.headers['x-access-token'], reply, next);
  } else {
    next();
  }
});

/**
  * @api {post} /register Registers user
  * @apiBodyParam {String} username 
  * @apiBodyParam {String} password 
*/
// TODO: limit this endpoint to admin users
app.post('/register', (request, reply) => {
  const { username, password } = request.body;
  register(username, password, function (err, data) {
    if (!data) return reply.status(500).send(err);
    reply.status(200).send(data);
  });
});

/**
  * @api {post} /login If user data is correct, returns auth token 
  * @apiBodyParam {String} username 
  * @apiBodyParam {String} password 
*/
app.post('/login', (request, reply) => {
  const { username, password } = request.body;
  login(username, password, function (err, data) {
    if (!data) return reply.status(500).send(err.errMessage);
    reply.status(200).send(data);
  });
});

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

app.listen(3000, async (err) => {
  if (err) {
    throw err;
  }
  console.log('Example app listening on port 3000!');
  await initializeServer();
})