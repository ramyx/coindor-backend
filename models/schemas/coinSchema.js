const addCoinSchema = (db, callback) => db.createCollection("coin", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: [ "prefix", "name" ],
        properties: {
          prefix: {
            bsonType: "string",
            pattern: "^[A-Z]{3,3}$",
            description: "must be a string and is required"
          },
          name: {
            bsonType: "string",
            description: "must be a string and is required"
          }
        }
     }
  }
}, callback);

module.exports = {
  addCoinSchema
};
