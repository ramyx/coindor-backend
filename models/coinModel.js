const { getCollection, getId } = require("./database");

const addCoin = async (coin) => {
  return await getCollection('coin').insertOne(coin);
};

const updateCoin = async (coinId, fields) => {
  const _id = getId(coinId);
  const coin = await getCollection('coin').findOne({ _id });
  if (!coin) {
    throw Error('Coin doesn\'t exist');
  }
  const newCoin = Object.assign(coin, fields);
  await getCollection('coin').updateOne(
    { _id },
    {
      $set: newCoin 
    }
  );
};

module.exports = {
  addCoin,
  updateCoin
};
