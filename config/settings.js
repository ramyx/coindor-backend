const initializeSettings = () => {
  switch(process.env.NODE_ENV) {
    case "production": {
      const newSettings = require("./production.json");
      newSettings.authSecret = process.env.AUTH_SECRET;
      newSettings.recaptchaSecretKey = process.env.RECAPTCHA_SECRET;
      newSettings.adminUsername = process.env.ADMIN_USERNAME;
      newSettings.adminPasswordHashed = process.env.ADMIN_PASSWORD;
      return newSettings;
    }
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