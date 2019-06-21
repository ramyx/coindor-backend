const settings = require("../../config/settings");

module.exports = {
  "users": [
    {
      "username": settings.adminUsername,
      "password": settings.adminPasswordHashed,
      role: 'admin'
    }
  ]
};