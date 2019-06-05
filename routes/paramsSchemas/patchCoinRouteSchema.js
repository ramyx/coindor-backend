const { check } = require('express-validator/check');
const { getCoinById } = require('../../models/coinModel');

const addCoinSchema = [
  check('coinId')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .custom(async (value, { req }) => {
      const coin = await getCoinById(value);
      return coin;
    }).withMessage('must be an existing coin'),
  check('prefix')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .matches(/^([A-Z]){3,3}$$/).withMessage('must be uppercase and 3 characters long'),
  check('name')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string'),
  check('sellRate')
    .not().isEmpty().withMessage('cannot be empty')
    .isFloat().withMessage('must be a string'),
  check('buyRate')
    .not().isEmpty().withMessage('cannot be empty')
    .isFloat().withMessage('must be a string')
];

module.exports = {
  addCoinSchema
}