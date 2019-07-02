const { check } = require('express-validator/check');

const checkVerifyTokenSchema = [
    check('token')
        .exists().withMessage('must exist')
        .not().isEmpty().withMessage('cannot be empty')
        .isString().withMessage('must be a string')
];

module.exports = {
    checkVerifyTokenSchema
}