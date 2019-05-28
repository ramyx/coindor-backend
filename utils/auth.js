
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { addUser, getUserById, getUserByUsername, updateUser } = require('../models/userModel');
const { authSecret } = require("../config/settings");

const secret = authSecret;

const register = (username, password, callback) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = { username, password: hashedPassword };
  addUser(user)
    .then((user) => {
      // create a token
      var token = jwt.sign({ id: user._id, lastSession: user.lastSession }, secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      callback(null, { auth: true, token: token });
    })
    .catch((err) => callback(err.message));
}

const verifyAuthHeader = (token, res, next) => {
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token: ' + err.message });
      } else {
        getUserById(decoded.id)
          .then(user => {
            if (!user) {
              return res.status(404).send("No user found.");
            } else if (decoded.lastSession !== user.lastSession) {
              return res.status(500).send("Token has expired");
            } else {
              next();
            }
          })
          .catch(error => res.status(500).send({ auth: false, message: error.message }));
      }
    });
  }
}

const login = (username, password, callback) => {
  getUserByUsername(username).then((user) => {
    if (!user) {
      return callback({errCode: 404, errMessage: 'No user found.'});
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return callback({errCode: 401, errMessage: { auth: false, token: null }});
    const newSession = new Date().getTime();
    updateUser(user._id, { lastSession: newSession }).then(() => {
      const token = jwt.sign({ id: user._id, lastSession: newSession }, secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      callback({}, { auth: true, token: token })
    }).catch(err => callback({errCode: 500, errMessage: err.message}));
  }).catch(error => callback({errCode: 404, errMessage: error.message}));
}

module.exports = {
  register,
  verifyAuthHeader,
  login
}