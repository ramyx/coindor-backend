const { check } = require('express-validator/check');

const checkAuthyRegisterSchema = [
    check('email')
        .exists().withMessage('must exist')
        .isEmail().withMessage('invalid email'),
    check('phone')
        .exists().withMessage('must exist')
        .not().isEmpty().withMessage('cannot be empty')
        .isString().withMessage('must be a string')
];

module.exports = {
    checkAuthyRegisterSchema
}