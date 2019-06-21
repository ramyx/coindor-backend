const request = require('request');
const settings = require('../config/settings');

const verifyCaptcha = (req) =>
  new Promise((resolve, reject) => {
    if(settings.disableCaptcha) {
      return resolve();
    }
    if (!req.body['g-recaptcha-response']) {
      return reject({ "responseError": "Please select captcha first" });
    }
    const secretKey = settings.recaptchaSecretKey;
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationURL,function(error,response,body) {
      body = JSON.parse(body);
      if(body.success !== undefined && !body.success) {
        return reject({ "responseError": "Failed captcha verification" });
      }
      resolve();
    });
  });

module.exports = {
  verifyCaptcha
}