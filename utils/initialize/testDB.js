const bcrypt = require('bcryptjs');
const { getId } = require("../../models/database");

module.exports = {
  "users": [
    {
      "_id": getId("5cfb03267a535e12f29b3927"),
      "username": "admin",
      "password": bcrypt.hashSync("Admin1234", 8),
      "role": "admin",
      "lastSession": new Date()
    },
    {
      "_id": getId("5cfb03267a535e12f29b3928"),
      "username": "user",
      "password": bcrypt.hashSync("User1234", 8),
      "role": "user",
      "lastSession": new Date()
    }
  ],
  "coins": [
    {
      "_id": getId("5cfb03267a535e12f29b3929"),
      "prefix": "EUR",
      "name": "Euro"
    },
    {
      "_id": getId("5cfb03267a535e12f29b3930"),
      "prefix": "USD",
      "name": "Dollar"
    }
  ]
};