const { check } = require('express-validator/check');

const checkLoginSchema = [
  check('username')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be at string'),
  check('password')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be at string')
];

module.exports = {
  checkLoginSchema
}