const addCoinSchema = async (db) => {
  await db.createCollection("coin", {
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
            },
            sellRate: {
              bsonType: ["double", "int"],
              description: "must be double"
            },
            buyRate: {
              bsonType: ["double", "int"],
              description: "must be double"
            }
          }
      }
    }
  });
  await db.collection("coin").createIndex( { "prefix": 1 }, { unique: true } );
  return;
};

module.exports = {
  addCoinSchema
};
