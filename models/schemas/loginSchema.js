const addLoginDeviceSchema = async (db) => {
  await db.createCollection("loginDevice", {
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
            loginAttempts: {
              bsonType: "int",
              description: "must be a int"
            },
            lastAttempt: {
              bsonType: "timestamp",
              description: "must be a timestamp"
            },
            lockUntil: {
              bsonType: "timestamp",
              description: "must be a timestamp"
            },
            isLocked: {
              bsonType: "bool",
              description: "must be a bool"
            },
            devicesUsed: {
              bsonType: "array",
              items: {
                bsonType: "string"
              }
            }
          }
      }
    }
  });
  return;
};

module.exports = {
  addLoginDeviceSchema
};