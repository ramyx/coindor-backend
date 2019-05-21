const { updateUser } = require("../models/userModel");

const modifyUser = (userId, newFields, cb) => {
  try {
    // TODO: validate newFields
    const newFieldsObject = JSON.parse(newFields);
    updateUser(userId, newFieldsObject)
      .then(() => cb())
      .catch(err => cb(err));
  } catch (err) {
    console.log(err);
    cb(err); 
  }
}

module.exports = {
  modifyUser
};
