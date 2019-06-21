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
      "username": "admin2",
      "password": bcrypt.hashSync("Admin1234", 8),
      "role": "admin",
      "lastSession": new Date()
    },
    {
      "_id": getId("5cfb03267a535e12f29b3929"),
      "username": "admin3",
      "password": bcrypt.hashSync("Admin1234", 8),
      "role": "admin",
      "lastSession": new Date()
    },
    {
      "_id": getId("5cfb03267a535e12f29b3930"),
      "username": "user",
      "password": bcrypt.hashSync("User1234", 8),
      "role": "user",
      "lastSession": new Date()
    },
    {
      "_id": getId("5cfb03267a535e12f29b3931"),
      "username": "user2",
      "password": bcrypt.hashSync("User1234", 8),
      "role": "user",
      "status": "approved",
      "lastSession": new Date()
    }
  ],
  "coins": [
    {
      "_id": getId("5cfb03267a535e12f29b3932"),
      "prefix": "EUR",
      "name": "Euro"
    },
    {
      "_id": getId("5cfb03267a535e12f29b3933"),
      "prefix": "USD",
      "name": "Dollar"
    }
  ]
};