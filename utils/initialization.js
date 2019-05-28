const { initializeDatabase } = require("../models/database");

const initializeServer = async () => {
  await initializeDatabase();
};

module.exports = {
  initializeServer
}
