const { check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
const { getCoinById } = require('../../models/coinModel');

const checkPatchUserSchema = [
  check('userId')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .custom((value, { req }) => value === req.user._id.toString()).withMessage('cannot modify another user'),
  check('username')
    .optional()
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string'),
  check('password')
    .optional()
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .isLength({ min: 8 }).withMessage('must have at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z]{8,}$/).withMessage('must include at least an uppercase letter and a number')
    .custom((value, { req }) => req.body.confirmPassword).withMessage('must confirm password'),
  check('confirmPassword')
    .optional()
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .custom((value, { req }) => req.body.password).withMessage('must enter password')
    .custom((value, { req }) => value === req.body.password).withMessage('must equal password'),
  check('coins')
    .optional()
    .not().isEmpty().withMessage('cannot be empty')
    .isArray().withMessage('must be an array')
    .custom(async (value, { req }) => {
      const promises = value.map(coinId => getCoinById(coinId));      
      const results = await Promise.all(promises);
      return !results.includes(null);
    }).withMessage('coins must be existing coins'),
  sanitizeBody('password')
    .customSanitizer(value => {
      const hashedPassword = bcrypt.hashSync(value, 8);
      return hashedPassword;
    })
];

module.exports = {
  checkPatchUserSchema
}