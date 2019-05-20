const initializeSettings = () => {
  switch(process.env.NODE_ENV) {
    case "production":
      return require("./production.json");
    default: {
      return require("./development.json");
    }
  }
  return;
}

const settings = initializeSettings();

module.exports = settings;