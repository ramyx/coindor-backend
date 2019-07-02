const { getCollection, getId } = require("./database");
const settings = require("../config/settings");

// authy configuration
const authy = require('authy')(settings.authyApiKey);

const registerAuthyUser = (email, phone, countryCode, callback) => {
    const cc = countryCode ? countryCode : '54'; // codigo internacional de argentina por defecto
    authy.register_user(email, phone, cc, (err, res) => {
        if (err) return callback({ errCode: 500, errMessage: err.errors })
        callback(null, res);
        // res = {user: {id: 1337}} where 1337 = ID given to use
    });
}

const verify = (id, token, callback) => {
    authy.verify( id, token, (err, res) =>{
        if (err) return callback({ errCode: 500, errMessage: err })
        callback(null, res);
    });
}

const addAuthy = async (authy) => {
    return await getCollection('authy').insertOne(authy);
};

const updateAuthy = async (userId, newFields) => {
    const _id = getId(userId);
    const authy = await getCollection('authy').findOne({ _id });
    if (!authy) {
        throw Error('Authy doesn\'t exist');
    }
    const newUser = Object.assign(authy, newFields);
    await getCollection('authy').updateOne(
        { _id },
        {
            $set: newUser
        }
    );
};

const updateAuthyByEmail = async (userId, email, newFields) => {
    const _id = getId(userId);
    const authy = await getCollection('authy').findOne({ _id, email });
    if (!authy) {
        throw Error('Authy doesn\'t exist');
    }
    const newUser = Object.assign(authy, newFields);
    await getCollection('authy').updateOne(
        { _id },
        {
            $set: newUser
        }
    );
};

const getAuthys = async () => {
    const users = await getCollection('authy').find().toArray();
    return users;
}

const getAuthyById = async (authyId) => {
    const _id = getId(authyId);
    return await getCollection('authy').findOne({ _id });
}

const getAuthyByEmail = async (email) => {
    return await getCollection('authy').findOne({ email });
}

const getAuthyByAuthyID = async (authyID) => {
    return await getCollection('authy').findOne({ authyID });
}

module.exports = {
    registerAuthyUser,
    verify,
    addAuthy,
    updateAuthy,
    updateAuthyByEmail,
    getAuthys,
    getAuthyById,
    getAuthyByAuthyID,
    getAuthyByEmail
};
