const { check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { getCoinById } = require('../../models/coinModel');
const { getNumberDecimal } = require('../../models/database');

const checkPatchCoinSchema = [
  check('coinId')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .custom(async (value, { req }) => {
      const coin = await getCoinById(value);
      return coin;
    }).withMessage('must be an existing coin'),
  check('prefix')
    .optional()
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .matches(/^([A-Z]){3,3}$$/).withMessage('must be uppercase and 3 characters long'),
  check('name')
    .optional()
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string'),
  check('sellRate')
    .optional()
    .not().isEmpty().withMessage('cannot be empty')
    .isFloat().withMessage('must be a string'),
  check('buyRate')
    .optional()
    .not().isEmpty().withMessage('cannot be empty')
    .isFloat().withMessage('must be a string')
];

module.exports = {
  checkPatchCoinSchema
}