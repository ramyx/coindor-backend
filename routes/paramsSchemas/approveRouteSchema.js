const { check } = require('express-validator/check');
const { getUserById } = require('../../models/userModel');

const checkApproveUserSchema = [
  check('userId')
    .exists().withMessage('must exist')
    .not().isEmpty().withMessage('cannot be empty')
    .isString().withMessage('must be a string')
    .custom(async (value, { req }) => {
      const user = await getUserById(value);
      return user && user.role !== 'admin';
    }).withMessage('must be an existing user and cannot be admin')
];

module.exports = {
  checkApproveUserSchema
}