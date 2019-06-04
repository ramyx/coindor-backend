const { getCollection } = require("./database");

const addCoin = async (coin) => {
  return await getCollection('coin').insertOne(coin);
};

module.exports = {
  addCoin
};
