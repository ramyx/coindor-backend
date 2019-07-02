const { registerAuthyUser, verify, addAuthy, getAuthyByEmail, getAuthyById } = require("../models/authyModel");
const { getUserById, updateUser } = require('../models/userModel');

const registerAuthy = (idUser, email, phone, countryCode, callback) => {
    // check if authyID exists
    getAuthyByEmail(email)
        .then(authy => {
            if (authy) {
                return callback({ errCode: 404, errMessage: 'Authy user already exists.' });
            }
            // check if user exists
            getUserById(idUser)
                .then(user => {
                    if (!user) return callback({ errCode: 404, errMessage: 'No user found.' });
                    // authy user creation
                    registerAuthyUser(email, phone, countryCode, (err, authy) => {
                        if (err) return callback(err)
                        const newAuhty = { authyID: authy.user.id, email, phone };
                        addAuthy(newAuhty)
                            .then(a => {
                                // update user with authy
                                updateUser(idUser, { authy: a.insertedId })
                                    .then(updated => {
                                        callback(null, { registered: true, authyID: authy.user.id, userId: idUser });
                                    })
                            })
                    });
                })
        })
        .catch(err => callback({ errCode: 500, errMessage: err.message }));
}

const verifyToken = (idUser, token, callback) => {
    getUserById(idUser)
        .then(user => {
            if (!user) return callback({ errCode: 404, errMessage: 'No user found.' });
            if (!user.authy) return callback({ errCode: 404, errMessage: 'No user authy register.' });
            getAuthyById(user.authy)
                .then(authy => {
                    if (!authy) return callback({ errCode: 404, errMessage: 'No user authy data encountered.' });
                    verify(authy.authyID, token, (err, res) => {
                        if (err) return callback(err);
                        callback(null, res);
                    });
                })
                .catch()
        })
        .catch()
}

module.exports = {
    registerAuthy,
    verifyToken
}