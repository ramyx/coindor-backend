const addUserSchema = (db, callback) => db.createCollection("user", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        properties: {
          coins: {
            bsonType: "array",
            items: {
              bsonType: "string",
            }
          }
        }
     }
  }
}, callback);

module.exports = {
  addUserSchema
};