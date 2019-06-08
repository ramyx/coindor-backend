const { getCollection } = require("../../models/database");
const settings = require("../../config/settings");
const mockData = require("./" + settings.dbName);

const initializeData = async () => {
  const promises = [];
  if (mockData.users) promises.push(getCollection('user').insertMany(mockData.users));
  if (mockData.coins) promises.push(getCollection('coin').insertMany(mockData.coins));
  await Promise.all(promises);
  return;
};

module.exports = {
  initializeData
}
