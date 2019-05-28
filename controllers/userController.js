const { updateUser } = require("../models/userModel");

const modifyUser = (userId, newFields, cb) => {
  try {
    updateUser(userId, newFields)
      .then(() => cb())
      .catch(err => cb(err));
  } catch (err) {
    cb(err); 
  }
}

module.exports = {
  modifyUser
};
