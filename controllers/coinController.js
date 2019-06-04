const { addCoin } = require("../models/coinModel");

const addNewCoin = (prefix, name, cb) => {
  try {
    addCoin({prefix, name})
      .then(() => cb())
      .catch(err => cb(err));
  } catch (err) {
    cb(err); 
  }
}

module.exports = {
  addNewCoin
};
