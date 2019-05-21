const initializeSettings = () => {
  switch(process.env.NODE_ENV) {
    case "production":
      return require("./production.json");
    case "test":
      return require("./test.json");
    default: {
      return require("./development.json");
    }
  }
}

const settings = initializeSettings();

module.exports = settings;