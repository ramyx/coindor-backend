const { addUser } = require("../models/userModel");
const settings = require("../config/settings");

const initializeData = async () => {
  await addUser({
    username: settings.adminUsername,
    password: settings.adminPasswordHashed
  });
  return;
};

module.exports = {
  initializeData
};