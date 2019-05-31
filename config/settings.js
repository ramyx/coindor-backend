const initializeSettings = () => {
  switch(process.env.NODE_ENV) {
    case "production":
      return require("./production.json");
    case "test":
      return require("./test.json");
    default: {
      const newSettings = require("./development.json");
      newSettings.recaptchaSecretKey = process.env.RECAPTCHA_SECRET;
      return newSettings;
    }
  }
}

const settings = initializeSettings();

module.exports = settings;