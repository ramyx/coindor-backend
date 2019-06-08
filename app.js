const express = require('express');
const bodyParser = require('body-parser');
const { initializeServer } = require("./utils/initialize/initialization");
const { verifyAuthHeader } = require("./utils/auth");
const settings = require("./config/settings");
const { setupPublicRoutes } = require("./routes/publicRoutes");
const { setupAllUsersRoutes } = require("./routes/allUsersRoutes");
const { setupAdminRoutes } = require("./routes/adminRoutes");

const app = express();

app.use(bodyParser.json());

app.use((request, reply, next) => {
  if (request.originalUrl.includes('/api/')) {
    const shouldBeAdmin = request.originalUrl.includes('/admin/');
    verifyAuthHeader(request.headers['x-access-token'], shouldBeAdmin, request, reply, next);
  } else {
    next();
  }
});

setupPublicRoutes(app);
setupAllUsersRoutes(app);
setupAdminRoutes(app);

app.listen(settings.appPort, async (err) => {
  if (err) {
    throw err;
  }
  console.log('Coindor Backend listening on port ' + settings.appPort + '!');
  await initializeServer();
})