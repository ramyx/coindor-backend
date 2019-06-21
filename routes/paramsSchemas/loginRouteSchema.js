const { check } = require('express-validator/check');

const checkLoginSchema = [
  check('username')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string'),
  check('password')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .isLength({ min: 8 }).withMessage('must have at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z]{8,}$/).withMessage('must include at least an uppercase letter and a number')
];

module.exports = {
  checkLoginSchema
}