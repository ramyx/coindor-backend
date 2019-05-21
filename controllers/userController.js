const { updateUser } = require("../models/userModel");

const modifyUser = (userId, newFields, cb) => {
  try {
    let newFieldsObject;
    try {
      newFieldsObject = JSON.parse(newFields);
    } catch (notJsonError) {
      newFieldsObject = newFields;
    }
    updateUser(userId, newFieldsObject)
      .then(() => cb())
      .catch(err => cb(err));
  } catch (err) {
    cb(err); 
  }
}

module.exports = {
  modifyUser
};
