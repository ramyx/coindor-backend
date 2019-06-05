const { check } = require('express-validator/check');

const addCoinSchema = [
  check('prefix')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .matches(/^([A-Z]){3,3}$$/).withMessage('must be uppercase and 3 characters long'),
  check('name')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
];

module.exports = {
  addCoinSchema
}