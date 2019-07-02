const addAuthySchema = async (db) => {
    await db.createCollection("authy", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["authyID", "email", "phone"],
                properties: {
                    authyID: {
                        bsonType: "number",
                        description: "must be a number"
                    },
                    email: {
                        bsonType: "string",
                        description: "must be a string"
                    },
                    countryCode: {
                        bsonType: "string",
                        description: "must be a string"
                    },
                    phone: {
                        bsonType: "string",
                        description: "must be a string"
                    }
                }
            }
        }
    });
    await db.collection("authy").createIndex({ "authyID": 1 }, { unique: true });
};

module.exports = {
    addAuthySchema
};