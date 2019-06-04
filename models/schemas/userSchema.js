const addUserSchema = (db, callback) => {
  db.createCollection("user", {
    validator: {
      $jsonSchema: {
          bsonType: "object",
          required: [ "username", "password", "role" ],
          properties: {
            username: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            password: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            role: {
              bsonType: "string",
              description: "must be a string",
              enum: [ "admin", "user" ]
            },
            status: {
              bsonType: "string",
              description: "must be a string",
              enum: [ "pending", "approved" ]
            },
            lastSession: {
              bsonType: "timestamp",
            },
            coins: {
              bsonType: "array",
              items: {
                bsonType: "string",
                pattern: "^[A-Z]{3,3}$"
              }
            }
          }
      }
    }
  }, callback);
  db.collection("user").createIndex( { "username": 1 }, { unique: true } );
};

module.exports = {
  addUserSchema
};