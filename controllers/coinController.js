const { addCoin, updateCoin } = require("../models/coinModel");

const addNewCoin = (prefix, name, cb) => {
  try {
    addCoin({prefix, name})
      .then(() => cb())
      .catch(err => cb(err));
  } catch (err) {
    cb(err); 
  }
}

const editCoin = (coinId, coin, cb) => {
  try {
    updateCoin(coinId, coin)
      .then(() => cb())
      .catch(err => cb(err));
  } catch (err) {
    cb(err); 
  }
}

module.exports = {
  addNewCoin,
  editCoin
};
