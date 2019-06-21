const { validationResult } = require('express-validator/check');

const checkValidationResult = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
      return next();
  }
  res.status(422).json({ 'Invalid parameters': result.array() });
}

module.exports = {
  checkValidationResult
};