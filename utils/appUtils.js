const { initializeDatabase } = require("../models/database");

const initializeServer = () => {
  initializeDatabase();
};

module.exports = {
  initializeServer
}
