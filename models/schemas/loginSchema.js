const addLoginDeviceSchema = (db, callback) => {
  db.createCollection("loginDevice", {
    validator: {
      $jsonSchema: {
          bsonType: "object",
          required: [ "loginAttempts", "isLocked" ],
          properties: {
            username: {
              bsonType: "string",
              description: "must be a string"
            },
            ipAddress: {
              bsonType: "string",
              description: "must be a string"
            },
            usernameIPkey: {
              bsonType: "string",
              description: "must be a string"
            },
            loginAttempts: "int",
            lastAttempt: "timestamp",
            lockUntil: "timestamp",
            isLocked: "bool",
            devicesUsed: {
              bsonType: "array",
              items: {
                bsonType: "string"
              }
            }
          }
      }
    }
  }, callback);
};

module.exports = {
  addLoginDeviceSchema
};