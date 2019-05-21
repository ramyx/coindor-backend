const addUserSchema = (db, callback) => db.createCollection("user", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        properties: {
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

module.exports = {
  addUserSchema
};