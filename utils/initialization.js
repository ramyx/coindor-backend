const { initializeDatabase } = require("../models/database");
const { initializeData } = require("../models/initializeData");

const initializeServer = async () => {
  await initializeDatabase();
  await initializeData();
};

module.exports = {
  initializeServer
}
